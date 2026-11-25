import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MqBadge from '@/components/mq-badge/MqBadge.vue'

function mountBadge(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MqBadge, { props, slots })
}

describe('MqBadge', () => {
  test('renders the default danger circle with its value and slot content', () => {
    const wrapper = mountBadge({ value: 5 }, { default: '<text class="anchor">消息</text>' })
    expect(wrapper.classes()).toContain('mq-badge')
    expect(wrapper.find('.anchor').text()).toBe('消息')
    const value = wrapper.find('.mq-badge__value')
    expect(value.text()).toBe('5')
    expect(value.classes()).toContain('mq-badge--danger')
    expect(value.classes()).toContain('mq-badge--circle')
    expect(value.attributes('style')).toBeUndefined()
    expect(wrapper.find('.mq-badge__dot').exists()).toBe(false)
  })

  test('honours dot, hidden, max and showZero', () => {
    const dot = mountBadge({ value: 1, isDot: true })
    expect(dot.find('.mq-badge__dot').exists()).toBe(true)
    expect(dot.find('.mq-badge__value').exists()).toBe(false)

    const hidden = mountBadge({ value: 1, hidden: true })
    expect(hidden.find('.mq-badge__value').exists()).toBe(false)
    expect(hidden.find('.mq-badge__dot').exists()).toBe(false)

    expect(mountBadge({ value: 120, max: 99 }).find('.mq-badge__value').text()).toBe('99+')
    expect(mountBadge({ value: 0 }).find('.mq-badge__value').exists()).toBe(false)
    expect(mountBadge({ value: 0, showZero: true }).find('.mq-badge__value').text()).toBe('0')
    expect(mountBadge({ value: null }).find('.mq-badge__value').exists()).toBe(false)
  })

  test('supports info type, bubble shape, background color and border', () => {
    const wrapper = mountBadge({
      value: 3,
      type: 'info',
      shape: 'bubble',
      bgColor: '#123456',
      border: true,
    })
    const value = wrapper.find('.mq-badge__value')
    expect(value.classes()).toContain('mq-badge--info')
    expect(value.classes()).toContain('mq-badge--bubble')
    expect(value.classes()).toContain('has-border')
    expect(value.attributes('style')).toContain('background-color: rgb(18, 52, 86)')

    const square = mountBadge({ value: 1, shape: 'square', type: 'primary' })
    expect(square.find('.mq-badge__value').classes()).toContain('mq-badge--square')
  })

  test('applies top and right offsets as inline styles', () => {
    const valueBadge = mountBadge({ value: 7, top: '-4px', right: 8 })
    const valueStyle = valueBadge.find('.mq-badge__value').attributes('style') ?? ''
    expect(valueStyle).toContain('top: -4px')
    expect(valueStyle).toContain('right: 8px')

    const dotBadge = mountBadge({ isDot: true, top: 2, right: '10%' })
    const dotStyle = dotBadge.find('.mq-badge__dot').attributes('style') ?? ''
    expect(dotStyle).toContain('top: 2px')
    expect(dotStyle).toContain('right: 10%')

    const ignored = mountBadge({ value: 1, top: Number.NaN, right: '  ' })
    expect(ignored.find('.mq-badge__value').attributes('style')).toBeUndefined()

    const combined = mountBadge({ value: 1, bgColor: '#fff', top: 1, right: 2 })
    const combinedStyle = combined.find('.mq-badge__value').attributes('style') ?? ''
    expect(combinedStyle).toContain('background-color: rgb(255, 255, 255)')
    expect(combinedStyle).toContain('top: 1px')
    expect(combinedStyle).toContain('right: 2px')
  })
})
