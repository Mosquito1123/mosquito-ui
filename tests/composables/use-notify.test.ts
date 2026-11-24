import { afterEach, describe, expect, test, vi } from 'vitest'
import { hideNotify, notifyState } from '@/utils/notify'
import { useNotify } from '@/composables/use-notify'

afterEach(() => {
  hideNotify()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useNotify', () => {
  test('转发全局状态与 show/hide', () => {
    const { state, show, hide } = useNotify()
    expect(state).toBe(notifyState)
    const close = show('  通知  ')
    expect(notifyState.visible).toBe(true)
    expect(notifyState.message).toBe('通知')
    expect(notifyState.type).toBe('danger')
    expect(typeof close).toBe('function')
    hide()
    expect(notifyState.visible).toBe(false)
  })

  test('error 对应底层 danger 类型，其余方法按名字设置类型', () => {
    const { primary, success, warning, error } = useNotify()
    primary('主')
    expect(notifyState.type).toBe('primary')
    success('成')
    expect(notifyState.type).toBe('success')
    warning('警')
    expect(notifyState.type).toBe('warning')
    error('错')
    expect(notifyState.type).toBe('danger')
    expect(notifyState.message).toBe('错')
  })

  test('预设的位置、颜色与 closable 生效，单次 options 可覆盖', () => {
    const api = useNotify({ position: 'bottom', color: '#fff', background: '#000', closable: true })
    api.show('预设')
    expect(notifyState.position).toBe('bottom')
    expect(notifyState.color).toBe('#fff')
    expect(notifyState.background).toBe('#000')
    expect(notifyState.closable).toBe(true)

    api.success('覆盖', { position: 'top', closable: false })
    expect(notifyState.position).toBe('top')
    expect(notifyState.closable).toBe(false)
    expect(notifyState.type).toBe('success')
  })

  test('预设 duration 会决定自动关闭时间，且实例之间互不影响', () => {
    vi.useFakeTimers()
    const a = useNotify({ duration: 100 })
    const b = useNotify({ duration: 500 })
    a.success('短')
    expect(notifyState.visible).toBe(true)
    vi.advanceTimersByTime(100)
    expect(notifyState.visible).toBe(false)

    b.show('长')
    vi.advanceTimersByTime(100)
    expect(notifyState.visible).toBe(true)
    vi.advanceTimersByTime(400)
    expect(notifyState.visible).toBe(false)
  })

  test('外部修改预设对象不影响已创建的实例', () => {
    const preset: { position: 'top' | 'bottom' } = { position: 'top' }
    const api = useNotify(preset)
    preset.position = 'bottom'
    api.show('仍然是顶部')
    expect(notifyState.position).toBe('top')
  })
})
