import { nextTick, reactive } from 'vue'
import type { MqToastCloser, MqToastInput, MqToastOptions, MqToastState } from '../components/mq-toast/types'

interface UniToastApi {
  showToast: (options: {
    title: string
    icon?: 'none' | 'success' | 'loading' | 'error'
    duration?: number
  }) => void
  hideToast?: () => void
}

export const toastState = reactive<MqToastState>({
  visible: false,
  message: '',
})

const DEFAULT_DURATION = 2000
/** 没有宿主且 duration 为 0 时，原生提示没有真正的「一直显示」，用这段时长托住，直到 hideToast。 */
const NATIVE_STICKY_MS = 600_000

let hostCount = 0
let serial = 0
let nativeOwned = false
let hideTimer: ReturnType<typeof setTimeout> | undefined

export function attachToastHost(): () => void {
  hostCount += 1
  let detached = false
  return () => {
    if (detached) {
      return
    }
    detached = true
    hostCount = Math.max(0, hostCount - 1)
  }
}

function getUni(): UniToastApi | undefined {
  const host = globalThis as typeof globalThis & { uni?: Partial<UniToastApi> }
  const uniApi = host.uni
  if (!uniApi || typeof uniApi.showToast !== 'function') {
    return undefined
  }
  return uniApi as UniToastApi
}

function clearHideTimer() {
  if (hideTimer !== undefined) {
    clearTimeout(hideTimer)
    hideTimer = undefined
  }
}

function safeNativeHide() {
  const hide = getUni()?.hideToast
  if (typeof hide !== 'function') {
    return
  }
  try {
    hide()
  } catch {
    // 原生提示已经不在时，部分端会抛错。
  }
}

function disarmNative() {
  if (!nativeOwned) {
    return
  }
  nativeOwned = false
  safeNativeHide()
}

function resolveDuration(value: number | undefined): number {
  if (value === undefined) {
    return DEFAULT_DURATION
  }
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return DEFAULT_DURATION
  }
  return value
}

function normalizeToast(input: MqToastInput): { message: string; duration: number } | undefined {
  const options: MqToastOptions | undefined = typeof input === 'string' ? { message: input } : input
  if (!options || typeof options.message !== 'string') {
    return undefined
  }
  const message = options.message.trim()
  if (!message) {
    return undefined
  }
  return {
    message,
    duration: resolveDuration(options.duration),
  }
}

function armHideTimer(id: number, duration: number) {
  clearHideTimer()
  if (duration <= 0) {
    return
  }
  hideTimer = setTimeout(() => {
    hideTimer = undefined
    if (id !== serial) {
      return
    }
    hideToast()
  }, duration)
}

function showOnHost(id: number, message: string, duration: number) {
  disarmNative()
  toastState.message = message
  toastState.visible = true
  armHideTimer(id, duration)
}

function showOnNative(id: number, message: string, duration: number) {
  const uniApi = getUni()
  if (!uniApi) {
    showOnHost(id, message, duration)
    return
  }
  clearHideTimer()
  toastState.message = message
  toastState.visible = false
  try {
    uniApi.showToast({
      title: message,
      icon: 'none',
      duration: duration > 0 ? duration : NATIVE_STICKY_MS,
    })
    nativeOwned = true
  } catch {
    nativeOwned = false
    showOnHost(id, message, duration)
  }
}

/**
 * 显示一条文字提示。同一时间只保留最后一条。
 * 页面有 `<mq-toast />` 时走宿主；否则等到本轮渲染结束，仍没有宿主再调用 `uni.showToast`。
 * 返回的函数只关闭这一条。
 */
export function showToast(input: MqToastInput): MqToastCloser {
  const normalized = normalizeToast(input)
  if (!normalized) {
    return () => {}
  }

  const id = ++serial
  clearHideTimer()
  const { message, duration } = normalized

  if (hostCount > 0) {
    showOnHost(id, message, duration)
  } else {
    toastState.message = message
    toastState.visible = true
    void nextTick(() => {
      if (id !== serial) {
        return
      }
      if (hostCount > 0) {
        showOnHost(id, message, duration)
        return
      }
      showOnNative(id, message, duration)
    })
  }

  return () => {
    if (id === serial) {
      hideToast()
    }
  }
}

/** 关掉当前提示。没有正在显示的提示时也可以调用。 */
export function hideToast(): void {
  serial += 1
  clearHideTimer()
  toastState.visible = false
  disarmNative()
}
