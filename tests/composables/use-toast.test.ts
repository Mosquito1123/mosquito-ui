import { afterEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import { attachToastHost, hideToast, toastState } from '@/utils/toast'
import { useToast } from '@/composables/use-toast'

interface UniToastApi {
  showToast: (options: { title: string; icon?: string; duration?: number }) => void
  hideToast: () => void
}

const uni = (globalThis as unknown as { uni: UniToastApi }).uni

afterEach(() => {
  hideToast()
  vi.restoreAllMocks()
})

describe('useToast', () => {
  test('转发全局状态与 show/hide', async () => {
    const { state, toasts, show, hide } = useToast()
    expect(state).toBe(toastState)
    expect(toasts).toBe(toastState)

    const detach = attachToastHost()
    try {
      const close = show('  你好  ')
      await nextTick()
      expect(toastState.message).toBe('你好')
      expect(toastState.visible).toBe(true)
      expect(typeof close).toBe('function')

      hide()
      expect(toastState.visible).toBe(false)
    } finally {
      detach()
    }
  })

  test('预设的 duration 会传给 uni.showToast', async () => {
    const show = vi.spyOn(uni, 'showToast')
    const { success } = useToast({ duration: 1234 })
    success('成功')
    await nextTick()
    expect(show).toHaveBeenCalledWith({ title: '成功', icon: 'none', duration: 1234 })
  })

  test('每次调用的 options 可覆盖预设，且 0 不会被默认值吞掉', async () => {
    const show = vi.spyOn(uni, 'showToast')
    const { show: notify } = useToast({ duration: 1000 })
    notify({ message: '常驻', duration: 0 })
    await nextTick()
    expect(show.mock.calls[0][0].duration).toBe(600_000)
  })

  test('多次调用预设互相独立，外部修改 preset 不影响已创建的实例', async () => {
    const show = vi.spyOn(uni, 'showToast')
    const preset = { duration: 100 }
    const a = useToast(preset)
    const b = useToast({ duration: 200 })
    preset.duration = 999

    a.success('A')
    await nextTick()
    b.warning('B')
    await nextTick()

    expect(show.mock.calls.map((call) => call[0].duration)).toEqual([100, 200])
  })

  test('四种语义方法都走 showToast，空文案被忽略', async () => {
    const show = vi.spyOn(uni, 'showToast')
    const { success, error, info, warning } = useToast()
    success('s')
    await nextTick()
    error('e')
    await nextTick()
    info('i')
    await nextTick()
    warning('w')
    await nextTick()
    expect(show.mock.calls.map((call) => call[0].title)).toEqual(['s', 'e', 'i', 'w'])

    success('   ')
    await nextTick()
    expect(show).toHaveBeenCalledTimes(4)
  })
})
