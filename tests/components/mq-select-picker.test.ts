import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MqSelectPicker from '@/components/mq-select-picker/MqSelectPicker.vue'

const options = ['北京', 2, { label: '上海', value: 'sh' }, { label: '不可选', value: 'no', disabled: true }]

function mountPicker(props: Record<string, unknown> = {}) {
  return mount(MqSelectPicker, { props: { visible: true, options, ...props } })
}

describe('MqSelectPicker', () => {
  test('renders title and normalized options', () => {
    const wrapper = mountPicker({ title: '选择城市', modelValue: 'sh' })
    expect(wrapper.find('.mq-select-picker__title').text()).toBe('选择城市')
    const items = wrapper.findAll('.mq-select-picker__option')
    expect(items).toHaveLength(4)
    expect(items.map((item) => item.text())).toEqual(['北京', '2', '上海✓', '不可选'])
    expect(items[0].classes()).not.toContain('is-selected')
    expect(items[2].classes()).toContain('is-selected')
  })

  test('supports custom value and label keys', () => {
    const wrapper = mountPicker({
      options: [{ code: 'gz', name: '广州' }],
      valueKey: 'code',
      labelKey: 'name',
    })
    expect(wrapper.find('.mq-select-picker__label').text()).toBe('广州')
  })

  test('emits change on selection, ignoring disabled options', async () => {
    const wrapper = mountPicker()
    await wrapper.findAll('.mq-select-picker__option')[3].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.findAll('.mq-select-picker__option')[0].trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0][0]).toMatchObject({ value: '北京', label: '北京' })
  })

  test('confirm commits the draft value and closes', async () => {
    const wrapper = mountPicker()
    await wrapper.findAll('.mq-select-picker__option')[2].trigger('click')
    const confirm = wrapper.findAll('.mq-select-picker__action')[1]
    await confirm.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['sh']])
    expect(wrapper.emitted('confirm')![0][0]).toMatchObject({ value: 'sh', label: '上海' })
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  test('cancel and mask close emit cancel then close', async () => {
    const wrapper = mountPicker()
    await wrapper.findAll('.mq-select-picker__action')[0].trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:visible')).toEqual([[false]])

    const masked = mountPicker()
    await masked.find('.mq-popup').trigger('click')
    expect(masked.emitted('cancel')).toHaveLength(1)
    expect(masked.emitted('close')).toHaveLength(1)
  })

  test('maskClosable false keeps the popup open', async () => {
    const wrapper = mountPicker({ maskClosable: false })
    await wrapper.find('.mq-popup').trigger('click')
    expect(wrapper.emitted('update:visible')).toBeUndefined()
  })

  test('disabled blocks opening and selection', async () => {
    const wrapper = mountPicker({ disabled: true })
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
    await wrapper.findAll('.mq-select-picker__option')[0].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect((wrapper.vm as unknown as { open: () => void }).open()).toBeUndefined()
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  test('exposes open and close', () => {
    const wrapper = mount(MqSelectPicker, { props: { options } })
    const vm = wrapper.vm as unknown as { open: () => void; close: () => void }
    vm.open()
    expect(wrapper.emitted('update:visible')).toEqual([[true]])
    vm.close()
    expect(wrapper.emitted('update:visible')).toEqual([[true]])
  })

  test('renders empty state and safe area', () => {
    const wrapper = mountPicker({ options: [], safeArea: true })
    expect(wrapper.find('.mq-select-picker__empty').text()).toBe('暂无选项')
    expect(wrapper.find('.mq-select-picker__safe-bottom').exists()).toBe(true)
  })
})
