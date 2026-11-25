import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import MqPopup from '@/components/mq-popup/MqPopup.vue'

const duration = 120

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('MqPopup', () => {
  test('默认渲染遮罩、面板与插槽，并带上无障碍属性', async () => {
    const wrapper = mount(MqPopup, {
      props: { modelValue: true, title: '提示', zIndex: 99, duration },
      slots: { default: '<text class="content">内容</text>' },
    })
    await nextTick()

    const root = wrapper.find('.mq-popup')
    expect(root.exists()).toBe(true)
    expect(root.classes()).toContain('mq-popup--center')
    expect(root.classes()).toContain('is-open')
    expect(root.classes()).toContain('is-modal')
    expect(root.attributes('aria-modal')).toBe('true')
    expect(root.attributes('aria-label')).toBe('提示')
    expect(root.attributes('style')).toContain('--mq-popup-duration: 120ms')
    expect(root.attributes('style')).toContain('z-index: 99')
    expect(wrapper.find('.mq-popup__mask').exists()).toBe(true)
    expect(wrapper.find('.content').text()).toBe('内容')
    expect(wrapper.find('.mq-popup__close').exists()).toBe(false)
    expect(wrapper.emitted('after-enter')).toHaveLength(1)
  })

  test('支持 center/top/right/bottom/left 五种位置', () => {
    const positions = ['center', 'top', 'right', 'bottom', 'left'] as const
    for (const position of positions) {
      const wrapper = mount(MqPopup, { props: { modelValue: true, position } })
      expect(wrapper.find('.mq-popup').classes()).toContain(`mq-popup--${position}`)
      wrapper.unmount()
    }
  })

  test('modal 为 false 时不渲染遮罩，点击根节点也不发 click-modal', async () => {
    const wrapper = mount(MqPopup, { props: { modelValue: true, modal: false } })
    await nextTick()

    expect(wrapper.find('.mq-popup__mask').exists()).toBe(false)
    expect(wrapper.find('.mq-popup').classes()).not.toContain('is-modal')
    expect(wrapper.find('.mq-popup').attributes('aria-modal')).toBeUndefined()

    await wrapper.find('.mq-popup').trigger('click')
    expect(wrapper.emitted('click-modal')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  test('closable 显示文字关闭按钮，点击后请求关闭且不发 click-modal', async () => {
    const wrapper = mount(MqPopup, { props: { modelValue: true, closable: true } })
    await nextTick()

    const close = wrapper.find('.mq-popup__close')
    expect(close.exists()).toBe(true)
    expect(close.text()).toBe('×')

    await close.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('click-modal')).toBeUndefined()
  })

  test('点击遮罩先发 click-modal 再请求关闭，点面板不关闭', async () => {
    const wrapper = mount(MqPopup, { props: { modelValue: true, duration } })

    await wrapper.find('.mq-popup__mask').trigger('click')
    expect(wrapper.emitted('click-modal')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])

    await wrapper.setProps({ modelValue: true })
    await wrapper.find('.mq-popup__panel').trigger('click')
    expect(wrapper.emitted('click-modal')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  test('点击根节点仍按旧行为关闭，且只发一次 click-modal', async () => {
    const wrapper = mount(MqPopup, { props: { modelValue: true, duration } })
    await wrapper.find('.mq-popup').trigger('click')
    expect(wrapper.emitted('click-modal')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  test('maskClosable 为 false 时遮罩仍发 click-modal，但不关闭也不响应 Esc', async () => {
    const wrapper = mount(MqPopup, { props: { modelValue: true, maskClosable: false } })
    await nextTick()

    await wrapper.find('.mq-popup__mask').trigger('click')
    expect(wrapper.emitted('click-modal')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  test('maskClosable 为 true 时 Esc 请求关闭', async () => {
    const wrapper = mount(MqPopup, { props: { modelValue: true } })
    await nextTick()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()
  })

  test('打开时依次发出 before-enter / enter / open / after-enter', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MqPopup, { props: { modelValue: false, duration } })
    expect(wrapper.find('.mq-popup').exists()).toBe(false)
    expect(wrapper.emitted('before-enter')).toBeUndefined()

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.emitted('before-enter')).toHaveLength(1)
    expect(wrapper.emitted('enter')).toHaveLength(1)
    expect(wrapper.emitted('open')).toHaveLength(1)
    await nextTick()
    expect(wrapper.emitted('after-enter')).toHaveLength(1)
    expect(wrapper.find('.mq-popup').exists()).toBe(true)

    const names = Object.keys(wrapper.emitted())
    expect(names.indexOf('before-enter')).toBeLessThan(names.indexOf('enter'))
    expect(names.indexOf('enter')).toBeLessThan(names.indexOf('open'))
    expect(names.indexOf('open')).toBeLessThan(names.indexOf('after-enter'))
  })

  test('关闭时依次发出 before-leave / leave / close / after-leave 并卸载节点', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MqPopup, { props: { modelValue: true, duration } })
    await nextTick()

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.emitted('before-leave')).toHaveLength(1)
    expect(wrapper.emitted('leave')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('after-leave')).toBeUndefined()
    expect(wrapper.find('.mq-popup').exists()).toBe(true)
    expect(wrapper.find('.mq-popup').classes()).not.toContain('is-open')

    await vi.advanceTimersByTimeAsync(duration)
    expect(wrapper.emitted('after-leave')).toHaveLength(1)
    expect(wrapper.find('.mq-popup').exists()).toBe(false)
  })

  test('关闭过程中重新打开会取消 leave 定时器，不发 after-leave', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MqPopup, { props: { modelValue: true, duration } })
    await nextTick()

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    await vi.advanceTimersByTimeAsync(duration * 2)

    expect(wrapper.emitted('after-leave')).toBeUndefined()
    expect(wrapper.find('.mq-popup').exists()).toBe(true)
    expect(wrapper.find('.mq-popup').classes()).toContain('is-open')
    expect(wrapper.emitted('before-enter')).toHaveLength(2)
  })

  test('duration 非法时按 200ms 计算离场时长', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MqPopup, { props: { modelValue: true, duration: -1 } })
    expect(wrapper.find('.mq-popup').attributes('style')).toContain('--mq-popup-duration: 200ms')
    await nextTick()

    await wrapper.setProps({ modelValue: false })
    await vi.advanceTimersByTimeAsync(199)
    expect(wrapper.find('.mq-popup').exists()).toBe(true)
    await vi.advanceTimersByTimeAsync(1)
    expect(wrapper.find('.mq-popup').exists()).toBe(false)
  })

  test('关闭后点击仍在 DOM 中的遮罩不会重复请求关闭', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MqPopup, { props: { modelValue: true, duration } })
    await wrapper.setProps({ modelValue: false })

    await wrapper.find('.mq-popup__mask').trigger('click')
    expect(wrapper.emitted('click-modal')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
