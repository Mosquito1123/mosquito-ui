import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import MqLayout from '@/components/mq-layout/MqLayout.vue'

describe('MqLayout', () => {
  test('renders a single view root with default modifiers', () => {
    const wrapper = mount(MqLayout)
    expect(wrapper.element.tagName).toBe('VIEW')
    expect(wrapper.classes()).toContain('mq-layout')
    expect(wrapper.classes()).toContain('mq-layout--row')
    expect(wrapper.classes()).toContain('mq-layout--nowrap')
  })

  test('renders the default slot', () => {
    const wrapper = mount(MqLayout, {
      slots: { default: '<text class="child">内容</text>' },
    })
    expect(wrapper.find('.child').text()).toBe('内容')
  })

  test('applies direction, wrap, justify and align', () => {
    const wrapper = mount(MqLayout, {
      props: {
        direction: 'column',
        wrap: 'wrap-reverse',
        justify: 'space-between',
        align: 'center',
      },
    })
    expect(wrapper.classes()).toContain('mq-layout--column')
    expect(wrapper.classes()).toContain('mq-layout--wrap-reverse')
    expect(wrapper.classes()).toContain('mq-layout--justify-space-between')
    expect(wrapper.classes()).toContain('mq-layout--align-center')
    expect(wrapper.classes()).not.toContain('mq-layout--row')
  })

  test('converts gutter to gap in px', () => {
    const wrapper = mount(MqLayout, { props: { gutter: 12 } })
    expect(wrapper.attributes('style')).toContain('gap: 12px')
  })

  test('omits gap for the default gutter', () => {
    const wrapper = mount(MqLayout)
    expect(wrapper.attributes('style') ?? '').not.toContain('gap')
  })

  test('sets full height', () => {
    const wrapper = mount(MqLayout, { props: { full: true } })
    expect(wrapper.attributes('style')).toContain('height: 100%')
  })

  test('accepts reversed wrap and baseline align', () => {
    const wrapper = mount(MqLayout, {
      props: { wrap: 'wrap', justify: 'flex-end', align: 'baseline' },
    })
    expect(wrapper.classes()).toContain('mq-layout--wrap')
    expect(wrapper.classes()).toContain('mq-layout--justify-flex-end')
    expect(wrapper.classes()).toContain('mq-layout--align-baseline')
  })
})
