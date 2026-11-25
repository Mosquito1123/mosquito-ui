import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import MqButton from '@/components/mq-button/MqButton.vue'
import type { MqButtonVariant } from '@/components/mq-button/types'

describe('MqButton', () => {
  test('renders a single native button with default modifiers', () => {
    const wrapper = mount(MqButton)

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mq-button', 'mq-button--default', 'mq-button--base', 'mq-button--medium']),
    )
    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.attributes('hover-class')).toBe('mq-button--pressed')
    expect(wrapper.attributes('aria-disabled')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  test('renders the default slot', () => {
    const wrapper = mount(MqButton, { slots: { default: '<text class="label">保存</text>' } })
    expect(wrapper.find('.label').text()).toBe('保存')
  })

  test('applies type, size, block and round modifiers', () => {
    const wrapper = mount(MqButton, {
      props: { type: 'danger', size: 'large', block: true, round: true },
    })

    expect(wrapper.classes()).toContain('mq-button--danger')
    expect(wrapper.classes()).toContain('mq-button--large')
    expect(wrapper.classes()).toContain('mq-button--block')
    expect(wrapper.classes()).toContain('mq-button--round')
    expect(wrapper.classes()).not.toContain('mq-button--medium')
  })

  test('supports every variant including the wot-ui parity variants', () => {
    const variants: MqButtonVariant[] = ['base', 'plain', 'text', 'dashed', 'soft', 'subtle']
    for (const variant of variants) {
      const wrapper = mount(MqButton, { props: { variant } })
      expect(wrapper.classes(), variant).toContain(`mq-button--${variant}`)
      expect(wrapper.classes(), variant).not.toContain('is-hairline')
    }
  })

  test('hairline is off by default and toggles is-hairline reactively', async () => {
    const wrapper = mount(MqButton, { props: { variant: 'text' } })
    expect(wrapper.classes()).not.toContain('is-hairline')

    await wrapper.setProps({ hairline: true })
    expect(wrapper.classes()).toContain('is-hairline')

    await wrapper.setProps({ hairline: false })
    expect(wrapper.classes()).not.toContain('is-hairline')
  })

  test('emits click with the native event', async () => {
    const onClick = vi.fn()
    const wrapper = mount(MqButton, { props: { onClick } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('click')?.[0][0]).toBeInstanceOf(Event)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('disabled blocks clicks and exposes aria-disabled', async () => {
    const wrapper = mount(MqButton, { props: { disabled: true } })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('hover-class')).toBe('none')
    expect(wrapper.classes()).toContain('is-disabled')

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  test('loading blocks clicks and exposes aria-busy', async () => {
    const wrapper = mount(MqButton, { props: { loading: true } })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('hover-class')).toBe('none')
    expect(wrapper.classes()).toContain('is-loading')

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
