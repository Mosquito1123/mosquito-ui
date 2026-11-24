import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MqTour from '@/components/mq-tour/MqTour.vue'

const steps = [
  { target: '.first', title: '第一步', content: '欢迎使用', placement: 'bottom' },
  { target: '.second', title: '第二步', content: '继续了解' },
]

function mountTour(props: Record<string, unknown> = {}) {
  return mount(MqTour, { props: { visible: true, steps, ...props } })
}

describe('MqTour', () => {
  test('renders only when visible or show is true', async () => {
    const wrapper = mount(MqTour, { props: { steps } })
    expect(wrapper.find('.mq-tour').exists()).toBe(false)
    await wrapper.setProps({ show: true })
    expect(wrapper.find('.mq-tour').exists()).toBe(true)
    expect(wrapper.find('.mq-tour__title').text()).toBe('第一步')
    expect(wrapper.find('.mq-tour__progress').text()).toBe('1/2')
    expect(wrapper.find('.mq-tour__button.is-next').text()).toBe('下一步')
    expect(wrapper.find('.mq-tour__button.is-prev').exists()).toBe(false)
  })

  test('supports custom button texts and hides overlay', () => {
    const wrapper = mountTour({ nextText: '继续', prevText: '返回', doneText: '知道了', overlay: false })
    expect(wrapper.find('.mq-tour__button.is-next').text()).toBe('继续')
    expect(wrapper.find('.mq-tour').classes()).toContain('is-plain')
  })

  test('next and prev emit change with index and step', async () => {
    const wrapper = mountTour()
    await wrapper.find('.mq-tour__button.is-next').trigger('click')
    expect(wrapper.emitted('update:current')).toEqual([[1]])
    expect(wrapper.emitted('change')![0][0]).toMatchObject({ index: 1, step: steps[1] })
    expect(wrapper.find('.mq-tour__button.is-prev').exists()).toBe(true)

    await wrapper.find('.mq-tour__button.is-prev').trigger('click')
    expect(wrapper.emitted('update:current')).toEqual([[1], [0]])
    expect(wrapper.emitted('change')![1][0]).toMatchObject({ index: 0, step: steps[0] })
  })

  test('done and finish close the tour; skip emits skip', async () => {
    const wrapper = mountTour({ current: 1 })
    expect(wrapper.find('.mq-tour__button.is-next').text()).toBe('完成')
    await wrapper.find('.mq-tour__button.is-next').trigger('click')
    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:visible')).toEqual([[false]])

    const skipped = mountTour()
    await skipped.find('.mq-tour__skip').trigger('click')
    expect(skipped.emitted('skip')).toHaveLength(1)
    expect(skipped.emitted('finish')).toBeUndefined()
  })

  test('mask closes only when maskClosable', async () => {
    const wrapper = mountTour({ maskClosable: true })
    await wrapper.find('.mq-tour').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)

    const locked = mountTour()
    await locked.find('.mq-tour').trigger('click')
    expect(locked.emitted('close')).toBeUndefined()
  })

  test('measures target rect and draws a highlight', async () => {
    const query: {
      select: ReturnType<typeof vi.fn>
      boundingClientRect: ReturnType<typeof vi.fn>
      exec: ReturnType<typeof vi.fn>
    } = {
      select: vi.fn(),
      boundingClientRect: vi.fn(),
      exec: vi.fn(),
    }
    query.select.mockReturnValue(query)
    query.boundingClientRect.mockImplementation((callback: (result: unknown) => void) => {
      callback({ left: 20, top: 30, width: 100, height: 40 })
      return query
    })
    const spy = vi
      .spyOn((globalThis as { uni?: { createSelectorQuery?: () => unknown } }).uni!, 'createSelectorQuery')
      .mockReturnValue(query)

    const wrapper = mountTour()
    await wrapper.vm.$nextTick()
    expect(query.select).toHaveBeenCalledWith('.first')
    expect(query.exec).toHaveBeenCalled()
    const highlight = wrapper.find('.mq-tour__highlight')
    expect(highlight.exists()).toBe(true)
    expect(highlight.attributes('style')).toContain('left: 16px')
    expect(highlight.attributes('style')).toContain('width: 108px')

    spy.mockRestore()
  })

  test('falls back to centered card when selector query is unavailable', async () => {
    const wrapper = mountTour()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.mq-tour__highlight').exists()).toBe(false)
    expect(wrapper.find('.mq-tour__card').attributes('style')).toContain('translate(-50%, -50%)')
  })

  test('exposes next, prev and finish', () => {
    const wrapper = mountTour()
    const vm = wrapper.vm as unknown as { next: () => void; prev: () => void; finish: () => void }
    vm.prev()
    expect(wrapper.emitted('change')).toBeUndefined()
    vm.next()
    expect(wrapper.emitted('change')![0][0]).toMatchObject({ index: 1 })
    vm.finish()
    expect(wrapper.emitted('finish')).toHaveLength(1)
  })

  test('clamps current to a valid step index', () => {
    const wrapper = mountTour({ current: 99 })
    expect(wrapper.find('.mq-tour__progress').text()).toBe('2/2')
  })
})
