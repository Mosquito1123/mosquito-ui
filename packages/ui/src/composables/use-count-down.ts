import { computed, getCurrentScope, onScopeDispose, ref, type ComputedRef, type Ref } from 'vue'
import { formatCountDown, parseTimeData, type MqTimeData } from '../utils/model'

export interface UseCountDownOptions {
  /** 总时长，毫秒。 */
  time?: number
  /** 格式化模板，支持 DD HH mm ss S SS SSS。默认 `HH:mm:ss`。 */
  format?: string
  /** 创建后是否立即开始，默认 true。 */
  autoStart?: boolean
  /** 是否按毫秒刷新（更细的刻度），格式串需要包含 S/SS/SSS 才能看到毫秒。 */
  millisecond?: boolean
  /** 倒计时归零时触发一次。 */
  onFinish?: () => void
}

export interface UseCountDownReturn {
  current: ComputedRef<MqTimeData>
  formatted: ComputedRef<string>
  start: () => void
  pause: () => void
  reset: () => void
  update: (time?: number) => void
  isRunning: Ref<boolean>
}

function normalizeTime(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0
}

/**
 * 基于时间戳的倒计时。优先用 `requestAnimationFrame` 驱动，缺失时回退到 `setInterval`；
 * 在组件作用域内卸载会自动停止。
 */
export function useCountDown(options: UseCountDownOptions = {}): UseCountDownReturn {
  let total = normalizeTime(options.time)
  const format = typeof options.format === 'string' && options.format ? options.format : 'HH:mm:ss'
  const millisecond = options.millisecond === true
  const autoStart = options.autoStart !== false
  const onFinish = options.onFinish

  const remain = ref(total)
  const isRunning = ref(false)
  const current = computed(() => parseTimeData(remain.value))
  const formatted = computed(() => formatCountDown(remain.value, format))

  let endAt = 0
  let rafId: number | undefined
  let intervalId: ReturnType<typeof setInterval> | undefined

  function canUseRaf(): boolean {
    return (
      typeof globalThis.requestAnimationFrame === 'function' &&
      typeof globalThis.cancelAnimationFrame === 'function'
    )
  }

  function stopTicker() {
    if (rafId !== undefined) {
      globalThis.cancelAnimationFrame?.(rafId)
      rafId = undefined
    }
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }

  function tick() {
    if (!isRunning.value) {
      return
    }
    const next = Math.max(0, endAt - Date.now())
    remain.value = next
    if (next <= 0) {
      isRunning.value = false
      stopTicker()
      onFinish?.()
    }
  }

  function startTicker() {
    stopTicker()
    if (canUseRaf()) {
      const frame = () => {
        if (!isRunning.value) {
          return
        }
        tick()
        if (isRunning.value) {
          rafId = globalThis.requestAnimationFrame(frame)
        }
      }
      rafId = globalThis.requestAnimationFrame(frame)
    } else {
      intervalId = setInterval(tick, millisecond ? 30 : 250)
    }
  }

  function start() {
    if (isRunning.value || remain.value <= 0) {
      return
    }
    isRunning.value = true
    endAt = Date.now() + remain.value
    startTicker()
  }

  function pause() {
    if (isRunning.value) {
      remain.value = Math.max(0, endAt - Date.now())
    }
    isRunning.value = false
    stopTicker()
  }

  function reset() {
    pause()
    remain.value = total
    if (autoStart && total > 0) {
      start()
    }
  }

  /** 传数字时更换总时长并回到该值；不传时按时间戳强制刷新一次。 */
  function update(time?: number) {
    if (typeof time === 'number') {
      total = normalizeTime(time)
      remain.value = total
      if (isRunning.value) {
        endAt = Date.now() + remain.value
        if (remain.value <= 0) {
          tick()
        }
      }
      return
    }
    tick()
  }

  if (getCurrentScope()) {
    onScopeDispose(pause)
  }

  if (autoStart && total > 0) {
    start()
  }

  return {
    current,
    formatted,
    start,
    pause,
    reset,
    update,
    isRunning,
  }
}
