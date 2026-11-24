import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import MqResize from '@/components/mq-resize/MqResize.vue'

class FakeRO {
  static instances: FakeRO[] = []

  cb: () => void
  observe = vi.fn()
  disconnect = vi.fn()

  constructor(cb: () => void) {
    this.cb = cb
    FakeRO.instances.push(this)
  }
}

type Size = { width: number; height: number }

function sizeOf(wrapper: ReturnType<typeof mount>): Size | null {
  return (wrapper.vm as unknown as { measure: () => Size | null }).measure()
}

beforeEach(() => {
  FakeRO.instances = []
  vi.stubGlobal('ResizeObserver', undefined)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('MqResize', () => {
  test('renders a single view root with the default throttle', () => {
    const wrapper = mount(MqResize, {
      slots: { default: '<text class="child">内容</text>' },
    })
    expect(wrapper.element.tagName).toBe('VIEW')
    expect(wrapper.find('.child').exists()).toBe(true)
    expect(wrapper.props('throttle')).toBe(100)
  })

  test('measure reads the DOM rect and emits resize', () => {
    vi.stubGlobal('ResizeObserver', FakeRO)
    const wrapper = mount(MqResize)
    wrapper.element.getBoundingClientRect = () => ({ width: 120, height: 80 }) as DOMRect
    expect(sizeOf(wrapper)).toEqual({ width: 120, height: 80 })
    expect(wrapper.emitted('resize')).toEqual([[{ width: 120, height: 80 }]])
  })

  test('measure normalizes missing dimensions to zero', () => {
    vi.stubGlobal('ResizeObserver', FakeRO)
    const wrapper = mount(MqResize)
    wrapper.element.getBoundingClientRect = () => ({ width: undefined }) as unknown as DOMRect
    expect(sizeOf(wrapper)).toEqual({ width: 0, height: 0 })
  })

  test('disabled prevents events but still returns a size', () => {
    const wrapper = mount(MqResize, { props: { disabled: true } })
    wrapper.element.getBoundingClientRect = () => ({ width: 10, height: 20 }) as DOMRect
    expect(sizeOf(wrapper)).toEqual({ width: 10, height: 20 })
    expect(wrapper.emitted('resize')).toBeUndefined()
    expect(FakeRO.instances).toHaveLength(0)
  })

  test('falls back to uni.createSelectorQuery and uses id as selector', () => {
    const callbacks: Array<(rect: unknown) => void> = []
    const query: Record<string, unknown> = {
      select: vi.fn(() => query),
      boundingClientRect: vi.fn((cb: (rect: unknown) => void) => {
        callbacks.push(cb)
        return query
      }),
      exec: vi.fn(() => query),
    }
    const uniObj = (globalThis as any).uni
    const spy = vi.spyOn(uniObj, 'createSelectorQuery').mockReturnValue(query)
    // 模拟无 DOM 几何信息的环境，迫使 measure 走 uni 查询回退。
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(undefined as unknown as DOMRect)

    const wrapper = mount(MqResize, { props: { id: 'box' } })
    expect(wrapper.attributes('id')).toBe('box')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(query.select).toHaveBeenCalledWith('#box')
    expect(callbacks).toHaveLength(1)
    callbacks[0]({ width: 66, height: 44 })
    expect(wrapper.emitted('resize')).toEqual([[{ width: 66, height: 44 }]])
  })

  test('uses ResizeObserver, throttles callbacks and disconnects on unmount', () => {
    vi.stubGlobal('ResizeObserver', FakeRO)
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const wrapper = mount(MqResize, { props: { throttle: 100 } })
    wrapper.element.getBoundingClientRect = () => ({ width: 10, height: 20 }) as DOMRect
    expect(FakeRO.instances).toHaveLength(1)
    const instance = FakeRO.instances[0]
    expect(instance.observe).toHaveBeenCalledWith(wrapper.element)

    instance.cb()
    expect(wrapper.emitted('resize')).toHaveLength(1)
    instance.cb()
    expect(wrapper.emitted('resize')).toHaveLength(1)
    vi.advanceTimersByTime(99)
    expect(wrapper.emitted('resize')).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(wrapper.emitted('resize')).toHaveLength(2)

    wrapper.unmount()
    expect(instance.disconnect).toHaveBeenCalledTimes(1)
  })

  test('throttle zero emits on every observer callback', () => {
    vi.stubGlobal('ResizeObserver', FakeRO)
    const wrapper = mount(MqResize, { props: { throttle: 0 } })
    wrapper.element.getBoundingClientRect = () => ({ width: 1, height: 2 }) as DOMRect
    const instance = FakeRO.instances[0]
    instance.cb()
    instance.cb()
    expect(wrapper.emitted('resize')).toHaveLength(2)
  })
})
