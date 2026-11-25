import { mount } from '@vue/test-utils'
import { describe, test, expect, vi } from 'vitest'
import MqIcon from '@/components/mq-icon/MqIcon.vue'

describe('MqIcon', () => {
  test('renders a mapped unicode glyph', () => {
    const wrapper = mount(MqIcon, { props: { name: 'add' } })
    expect(wrapper.classes()).toContain('mq-icon')
    expect(wrapper.text()).toBe('+')
  })

  test('maps built-in names', () => {
    const cases: Array<[string, string]> = [
      ['add', '+'],
      ['close', '×'],
      ['arrow-left', '‹'],
      ['arrow-right', '›'],
      ['arrow-down', '▾'],
      ['arrow-up', '▴'],
      ['check', '✓'],
      ['search', '⌕'],
      ['star', '★'],
      ['heart', '♥'],
      ['refresh', '↻'],
      ['more', '⋯'],
      ['info', 'i'],
      ['success', '✓'],
      ['warning', '!'],
      ['error', '×'],
      ['camera', '▣'],
      ['image', '▧'],
      ['location', '⌖'],
      ['phone', '✆'],
      ['shop', '▥'],
      ['user', '☻'],
      ['delete', '⌫'],
      ['edit', '✎'],
      ['chat', '❞'],
      ['clock', '◷'],
      ['gift', '❁'],
    ]
    for (const [name, glyph] of cases) {
      expect(mount(MqIcon, { props: { name } }).text(), name).toBe(glyph)
    }
  })

  test('falls back to the first character or empty text', () => {
    expect(mount(MqIcon, { props: { name: 'custom' } }).text()).toBe('c')
    expect(mount(MqIcon).text()).toBe('')
  })

  test('default slot takes priority over the glyph', () => {
    const wrapper = mount(MqIcon, {
      props: { name: 'add' },
      slots: { default: '<text class="custom-icon">X</text>' },
    })
    expect(wrapper.text()).toBe('X')
    expect(wrapper.find('.mq-icon__glyph').exists()).toBe(false)
  })

  test('applies size, color, bold and block', () => {
    const wrapper = mount(MqIcon, {
      props: { name: 'star', size: 24, color: '#ff0000', bold: true, block: true },
    })
    expect(wrapper.attributes('style')).toContain('font-size: 24px')
    expect(wrapper.attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(wrapper.classes()).toContain('is-bold')
    expect(wrapper.classes()).toContain('is-block')
  })

  test('passes string size through and omits empty color', () => {
    const wrapper = mount(MqIcon, { props: { size: '2em' } })
    expect(wrapper.attributes('style')).toContain('font-size: 2em')
    expect(wrapper.attributes('style')).not.toContain('color:')
  })

  test('emits click and calls the listener', async () => {
    const onClick = vi.fn()
    const wrapper = mount(MqIcon, { props: { name: 'add', onClick } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
