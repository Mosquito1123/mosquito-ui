import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MqSearch from '@/components/mq-search/MqSearch.vue'

describe('MqSearch', () => {
  test('renders a single view root with default input and action', () => {
    const wrapper = mount(MqSearch)

    expect(wrapper.element.tagName).toBe('VIEW')
    expect(wrapper.classes()).toContain('mq-search')
    expect(wrapper.attributes('role')).toBe('search')

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('confirm-type')).toBe('search')
    expect(input.attributes('placeholder')).toBe('搜索')
    expect(input.attributes('maxlength')).toBe('-1')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.mq-search__action').text()).toBe('搜索')
    expect(wrapper.find('.mq-search__clear').exists()).toBe(false)
  })

  test('binds the type prop to the native input and reacts to changes', async () => {
    const wrapper = mount(MqSearch, { props: { type: 'number' } })
    expect(wrapper.find('input').attributes('type')).toBe('number')

    await wrapper.setProps({ type: 'search' })
    expect(wrapper.find('input').attributes('type')).toBe('search')
  })

  test('trims explicit placeholder and action text', () => {
    const wrapper = mount(MqSearch, {
      props: { placeholder: '  姓名  ', actionText: '  查询  ', maxlength: 20 },
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe('姓名')
    expect(wrapper.find('input').attributes('maxlength')).toBe('20')
    expect(wrapper.find('.mq-search__action').text()).toBe('查询')
  })

  test('emits update:modelValue and input from native input events', async () => {
    const wrapper = mount(MqSearch, { props: { modelValue: '旧' } })

    await wrapper.find('input').trigger('input', { detail: { value: '新' } })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['新'])
    expect(wrapper.emitted('input')?.[0]).toEqual([{ value: '新' }])
  })

  test('reads input value from the target when detail is absent', async () => {
    const wrapper = mount(MqSearch)
    const input = wrapper.find('input')
    input.element.value = '键盘输入'

    await input.trigger('input')

    expect(wrapper.emitted('input')?.[0]).toEqual([{ value: '键盘输入' }])
  })

  test('emits search on confirm and on action click', async () => {
    const wrapper = mount(MqSearch, { props: { modelValue: '关键词', actionText: '搜索' } })

    await wrapper.find('input').trigger('confirm')
    await wrapper.find('.mq-search__action').trigger('click')

    expect(wrapper.emitted('search')).toHaveLength(2)
    expect(wrapper.emitted('search')?.[0]).toEqual([{ value: '关键词' }])
    expect(wrapper.emitted('search')?.[1]).toEqual([{ value: '关键词' }])
  })

  test('hiding the action keeps confirm working but suppresses cancel', async () => {
    const wrapper = mount(MqSearch, {
      props: { modelValue: 'abc', hideCancel: true },
    })

    expect(wrapper.find('.mq-search__action').exists()).toBe(false)

    await wrapper.find('input').trigger('confirm')

    expect(wrapper.emitted('search')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  test('action click emits cancel with the current value', async () => {
    const wrapper = mount(MqSearch, { props: { modelValue: 42, actionText: '搜索' } })

    await wrapper.find('.mq-search__action').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('cancel')?.[0]).toEqual([{ value: '42' }])
    expect(wrapper.emitted('search')).toHaveLength(1)
  })

  test('emits focus and blur with the current input value', async () => {
    const wrapper = mount(MqSearch, { props: { modelValue: '初始' } })
    const input = wrapper.find('input')

    await input.trigger('focus')
    await input.trigger('blur')

    expect(wrapper.emitted('focus')?.[0]).toEqual([{ value: '初始' }])
    expect(wrapper.emitted('blur')?.[0]).toEqual([{ value: '初始' }])
  })

  test('focus and blur honor event detail when provided', async () => {
    const wrapper = mount(MqSearch)
    const element = wrapper.find('input').element

    // FocusEvent.detail 在 jsdom 中是只读的，这里直接派发带 detail 的 CustomEvent。
    element.dispatchEvent(new CustomEvent('focus', { detail: { value: '焦点' } }))
    element.dispatchEvent(new CustomEvent('blur', { detail: { value: 7 } }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('focus')?.[0]).toEqual([{ value: '焦点' }])
    expect(wrapper.emitted('blur')?.[0]).toEqual([{ value: '7' }])
  })

  test('clearable shows clear only with a value and clears without emitting search', async () => {
    const wrapper = mount(MqSearch, {
      props: { modelValue: 'abc', clearable: true },
    })
    const clear = wrapper.find('.mq-search__clear')
    expect(clear.exists()).toBe(true)

    await clear.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('input')?.[0]).toEqual([{ value: '' }])
    expect(wrapper.emitted('search')).toBeUndefined()
  })

  test('clearable with an empty value has no clear affordance', async () => {
    const wrapper = mount(MqSearch, { props: { clearable: true } })
    expect(wrapper.find('.mq-search__clear').exists()).toBe(false)
  })

  test('disabled suppresses input, search, cancel, focus, blur and clear', async () => {
    const wrapper = mount(MqSearch, {
      props: { modelValue: 'abc', clearable: true, disabled: true },
    })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.mq-search__clear').exists()).toBe(false)

    await wrapper.find('input').trigger('input', { detail: { value: '新' } })
    await wrapper.find('input').trigger('confirm')
    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').trigger('blur')
    await wrapper.find('.mq-search__action').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('input')).toBeUndefined()
    expect(wrapper.emitted('search')).toBeUndefined()
    expect(wrapper.emitted('cancel')).toBeUndefined()
    expect(wrapper.emitted('focus')).toBeUndefined()
    expect(wrapper.emitted('blur')).toBeUndefined()
  })

  test('empty action text hides the action label', () => {
    const wrapper = mount(MqSearch, { props: { actionText: '' } })
    expect(wrapper.find('.mq-search__action').exists()).toBe(false)
  })

  test('clear handler ignores calls when there is nothing to clear', () => {
    const wrapper = mount(MqSearch, { props: { clearable: true } })
    const vm = wrapper.vm as unknown as { onClear: () => void }

    vm.onClear()

    expect(wrapper.emitted('clear')).toBeUndefined()
    expect(wrapper.emitted('input')).toBeUndefined()
  })
})
