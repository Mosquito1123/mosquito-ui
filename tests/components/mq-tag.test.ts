import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MqTag from '@/components/mq-tag/MqTag.vue'

function mountTag(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MqTag, { props, slots })
}

describe('MqTag', () => {
  test('renders the default tag with its slot content', () => {
    const wrapper = mountTag({}, { default: '<text class="label">标签</text>' })
    expect(wrapper.classes()).toContain('mq-tag')
    expect(wrapper.classes()).toContain('mq-tag--default')
    expect(wrapper.classes()).toContain('mq-tag--base')
    expect(wrapper.classes()).toContain('mq-tag--medium')
    expect(wrapper.find('.mq-tag__text .label').text()).toBe('标签')
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('.mq-tag__close').exists()).toBe(false)
  })

  test('applies type, dashed variant, size and round classes', () => {
    const wrapper = mountTag({
      type: 'success',
      variant: 'dashed',
      size: 'large',
      round: true,
    })
    expect(wrapper.classes()).toContain('mq-tag--success')
    expect(wrapper.classes()).toContain('mq-tag--dashed')
    expect(wrapper.classes()).toContain('mq-tag--large')
    expect(wrapper.classes()).toContain('mq-tag--round')
  })

  test('applies color and background color to inline styles', () => {
    const base = mountTag({ color: '#ff0000', bgColor: '#00ff00' })
    expect(base.attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(base.attributes('style')).toContain('border-color: rgb(0, 255, 0)')
    expect(base.attributes('style')).toContain('background-color: rgb(0, 255, 0)')

    const plain = mountTag({ color: '#ff0000', bgColor: '#00ff00', variant: 'plain' })
    expect(plain.attributes('style')).toContain('border-color: rgb(0, 255, 0)')
    expect(plain.attributes('style') ?? '').not.toContain('background-color')

    expect(mountTag().attributes('style')).toBeUndefined()
  })

  test('emits click with the event unless disabled', async () => {
    const wrapper = mountTag()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('click')![0][0]).toBeInstanceOf(MouseEvent)

    const disabled = mountTag({ disabled: true })
    await disabled.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()
  })

  test('keeps close behavior and does not bubble a close click to click', async () => {
    const wrapper = mountTag({ closable: true })
    const close = wrapper.find('.mq-tag__close')
    expect(close.text()).toBe('×')
    expect(close.attributes('aria-hidden')).toBe('true')
    await close.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  test('dynamic tags render an input and emit confirm on Enter', async () => {
    const wrapper = mountTag({ dynamic: true })
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('disabled')).toBeUndefined()

    const vm = wrapper.vm as unknown as { onInput: (event?: Event) => void }
    vm.onInput()
    await input.setValue('新标签')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('confirm')![0][0]).toEqual({ value: '新标签' })

    input.element.value = '直接确认'
    await input.trigger('confirm')
    expect(wrapper.emitted('confirm')![1][0]).toEqual({ value: '直接确认' })
  })

  test('confirm reads uni-style detail and falls back to the stored input value', async () => {
    const wrapper = mountTag({ dynamic: true })
    const input = wrapper.find('input')
    await input.trigger('confirm', { detail: { value: '来自 detail' } })
    expect(wrapper.emitted('confirm')![0][0]).toEqual({ value: '来自 detail' })

    await input.setValue('已输入')
    const vm = wrapper.vm as unknown as { onConfirm: () => void }
    vm.onConfirm()
    expect(wrapper.emitted('confirm')![1][0]).toEqual({ value: '已输入' })
  })

  test('disabled dynamic inputs cannot be edited and do not emit click', async () => {
    const wrapper = mountTag({ dynamic: true, disabled: true })
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
