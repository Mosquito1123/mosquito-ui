import { afterEach, describe, expect, test, vi } from 'vitest'
import { useCountDown } from '@/composables/use-count-down'

const g = globalThis as any
const originalRaf = g.requestAnimationFrame
const originalCaf = g.cancelAnimationFrame

afterEach(() => {
  vi.useRealTimers()
  g.requestAnimationFrame = originalRaf
  g.cancelAnimationFrame = originalCaf
  vi.restoreAllMocks()
})

function useIntervalFallback() {
  g.requestAnimationFrame = undefined
  g.cancelAnimationFrame = undefined
  vi.useFakeTimers()
  vi.setSystemTime(0)
}

describe('useCountDown', () => {
  test('setInterval 回退：读数、暂停、继续与 Finish', () => {
    useIntervalFallback()
    const onFinish = vi.fn()
    const timer = useCountDown({ time: 1000, format: 'ss.SSS', onFinish })
    expect(timer.isRunning.value).toBe(true)
    expect(timer.current.value.total).toBe(1000)
    expect(timer.formatted.value).toBe('01.000')

    vi.advanceTimersByTime(250)
    expect(timer.formatted.value).toBe('00.750')

    timer.pause()
    expect(timer.isRunning.value).toBe(false)
    const frozen = timer.formatted.value
    vi.advanceTimersByTime(500)
    expect(timer.formatted.value).toBe(frozen)

    timer.start()
    vi.advanceTimersByTime(750)
    expect(timer.isRunning.value).toBe(false)
    expect(timer.formatted.value).toBe('00.000')
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  test('autoStart=false 时 start/reset/update 的语义', () => {
    useIntervalFallback()
    const timer = useCountDown({ time: 500, autoStart: false })
    expect(timer.isRunning.value).toBe(false)
    timer.start()
    vi.advanceTimersByTime(250)
    expect(timer.current.value.total).toBe(250)

    timer.update(1000)
    expect(timer.current.value.total).toBe(1000)
    expect(timer.isRunning.value).toBe(true)
    vi.advanceTimersByTime(1000)
    expect(timer.isRunning.value).toBe(false)

    timer.reset()
    expect(timer.current.value.total).toBe(1000)
    expect(timer.isRunning.value).toBe(false)

    timer.start()
    vi.advanceTimersByTime(300)
    timer.update()
    expect(timer.current.value.total).toBe(700)
  })

  test('requestAnimationFrame 可用时用它驱动，结束后不再排队', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const frames: Array<(time: number) => void> = []
    g.requestAnimationFrame = (cb: (time: number) => void) => {
      frames.push(cb)
      return frames.length
    }
    g.cancelAnimationFrame = vi.fn()

    const onFinish = vi.fn()
    const timer = useCountDown({ time: 60, millisecond: true, format: 'SSS', onFinish })
    expect(frames).toHaveLength(1)

    vi.setSystemTime(30)
    frames.shift()!(30)
    expect(timer.formatted.value).toBe('030')
    expect(frames).toHaveLength(1)

    vi.setSystemTime(60)
    frames.shift()!(60)
    expect(timer.formatted.value).toBe('000')
    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(timer.isRunning.value).toBe(false)
    expect(frames).toHaveLength(0)
  })

  test('卸载作用域自动清理定时器', async () => {
    const { effectScope } = await import('vue')
    useIntervalFallback()
    const scope = effectScope()
    const cleared = vi.spyOn(globalThis, 'clearInterval')
    scope.run(() => {
      useCountDown({ time: 1000 })
    })
    expect(cleared).not.toHaveBeenCalled()
    scope.stop()
    expect(cleared).toHaveBeenCalled()
  })
})
