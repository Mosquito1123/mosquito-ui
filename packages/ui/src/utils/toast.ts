import { reactive } from 'vue'
import type { MqToastOptions, MqToastState } from '../components/mq-toast/types'

interface UniToastApi {
  showToast: (options: {
    title: string
    icon?: 'none' | 'success' | 'loading' | 'error'
    duration?: number
  }) => void
  hideToast: () => void
}

export const toastState = reactive<MqToastState>({
  visible: false,
  message: '',
})

let hostCount = 0
let timer: ReturnType<typeof setTimeout> | undefined

export function attachToastHost(): () => void {
  hostCount += 1
  return () => {
    hostCount = Math.max(0, hostCount - 1)
  }
}

function getUni(): UniToastApi | undefined {
  const host = globalThis as typeof globalThis & { uni?: UniToastApi }
  return host.uni
}

function clearTimer() {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

export function showToast(input: string | MqToastOptions): void {
  const options: MqToastOptions = typeof input === 'string' ? { message: input } : input
  const duration = options.duration ?? 2000
  const message = options.message

  if (hostCount > 0) {
    toastState.message = message
    toastState.visible = true
    clearTimer()
    if (duration > 0) {
      timer = setTimeout(() => {
        hideToast()
      }, duration)
    }
    return
  }

  const uniApi = getUni()
  if (uniApi) {
    uniApi.showToast({
      title: message,
      icon: 'none',
      duration,
    })
    return
  }

  toastState.message = message
  toastState.visible = true
  clearTimer()
  if (duration > 0) {
    timer = setTimeout(() => {
      hideToast()
    }, duration)
  }
}

export function hideToast(): void {
  clearTimer()
  toastState.visible = false
  if (hostCount === 0) {
    getUni()?.hideToast()
  }
}
