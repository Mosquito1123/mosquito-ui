import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MqColPicker from '@/components/mq-col-picker/MqColPicker.vue'
import type { MqColPickerOption } from '@/components/mq-col-picker/types'

const columns: MqColPickerOption[][] = [
  [
    { value: 'zj', label: '浙江' },
    { value: 'js', label: '江苏' },
  ],
  [
    { value: 'hz', label: '杭州' },
    { value: 'nb', label: '宁波' },
  ],
]

function mountPicker(props: Record<string, unknown> = {}) {
  return mount(MqColPicker, { props: { label: '地区', columns, ...props } })
}

async function open(wrapper: ReturnType<typeof mountPicker>) {
  await wrapper.find('.mq-col-picker__trigger').trigger('click')
  await nextTick()
  await nextTick()
}

function items(wrapper: ReturnType<typeof mountPicker>, column: number) {
  return wrapper.findAll('.mq-col-picker__column')[column].findAll('.mq-col-picker__item')
}

describe('MqColPicker', () => {
  test('展示 label、占位与箭头，点击后打开列表面板', async () => {
    const wrapper = mountPicker()
    expect(wrapper.find('.mq-col-picker__label').text()).toBe('地区')
    expect(wrapper.find('.mq-col-picker__value').text()).toBe('请选择')
    expect(wrapper.find('.mq-popup').exists()).toBe(false)

    await open(wrapper)
    expect(wrapper.find('.mq-popup').exists()).toBe(true)
    expect(wrapper.findAll('.mq-col-picker__column')).toHaveLength(2)
  })

  test('选中最后一列后提交值并发出 confirm', async () => {
    const wrapper = mountPicker()
    await open(wrapper)

    await items(wrapper, 0)[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await items(wrapper, 1)[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['zj', 'hz']]])
    expect(wrapper.emitted('confirm')![0][0]).toMatchObject({
      value: ['zj', 'hz'],
      selectedItems: [{ label: '浙江' }, { label: '杭州' }],
    })
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  test('columnChange 的 resolve 补齐下一列，finish 提交或取消', async () => {
    const columnChange = vi.fn(({ selectedItem, resolve, finish }) => {
      if (selectedItem.value === 'zj') {
        resolve([{ value: 'hz', label: '杭州' }])
      } else {
        finish()
      }
    })
    const wrapper = mountPicker({ columns: [columns[0]], columnChange })
    await open(wrapper)

    expect(wrapper.findAll('.mq-col-picker__column')).toHaveLength(1)
    await items(wrapper, 0)[0].trigger('click')
    await nextTick()
    expect(wrapper.findAll('.mq-col-picker__column')).toHaveLength(2)
    expect(items(wrapper, 1)[0].text()).toContain('杭州')

    await items(wrapper, 1)[0].trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(columnChange).toHaveBeenCalledTimes(2)

    const failed = mountPicker({
      columns: [columns[0]],
      columnChange: ({ finish }: { finish: (ok?: boolean) => void }) => finish(false),
    })
    await open(failed)
    await items(failed, 0)[0].trigger('click')
    expect(failed.emitted('confirm')).toBeUndefined()
    expect(failed.emitted('close')).toHaveLength(1)
  })

  test('autoComplete 用初始首列值触发 columnChange', async () => {
    const columnChange = vi.fn(({ resolve, selectedItem }) => {
      resolve([{ value: selectedItem.value === 'zj' ? 'hz' : 'nj', label: '下一级' }])
    })
    const wrapper = mountPicker({
      columns: [],
      modelValue: ['zj'],
      autoComplete: true,
      columnChange,
    })
    await open(wrapper)
    expect(columnChange).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('.mq-col-picker__column')).toHaveLength(1)
  })

  test('beforeConfirm 返回 false 时留在面板，返回 true 后提交', async () => {
    const beforeConfirm = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true)
    const wrapper = mountPicker({ beforeConfirm })
    await open(wrapper)

    const confirm = wrapper.find('.mq-col-picker__action.is-confirm')
    await confirm.trigger('click')
    await nextTick()
    expect(wrapper.emitted('confirm')).toBeUndefined()

    await confirm.trigger('click')
    await nextTick()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(beforeConfirm).toHaveBeenCalledTimes(2)
  })

  test('disabled 与 readonly 不提交，displayFormat 自定义展示', async () => {
    const disabled = mountPicker({ disabled: true })
    await open(disabled)
    expect(disabled.find('.mq-popup').exists()).toBe(false)
    expect(disabled.find('.mq-col-picker__trigger').attributes('aria-disabled')).toBe('true')

    const formatted = mountPicker({
      modelValue: ['zj', 'hz'],
      displayFormat: (items: MqColPickerOption[]) => items.map((item) => item.label).join('/'),
      error: true,
      required: true,
      size: 'large',
      alignRight: true,
      ellipsis: true,
    })
    expect(formatted.find('.mq-col-picker__value').text()).toBe('浙江/杭州')
    expect(formatted.classes()).toContain('is-error')
    expect(formatted.classes()).toContain('is-large')
    expect(formatted.find('.mq-col-picker__value').classes()).toContain('is-right')
    expect(formatted.find('.mq-col-picker__required').exists()).toBe(true)

    await open(formatted)
    await items(formatted, 0)[1].trigger('click')
    expect(formatted.emitted('confirm')).toBeUndefined()
  })

  test('暴露的 open / close 与取消按钮正常工作', async () => {
    const wrapper = mountPicker()
    const vm = wrapper.vm as unknown as { open: () => void; close: () => void }
    vm.open()
    await nextTick()
    expect(wrapper.find('.mq-popup').exists()).toBe(true)

    vm.close()
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)

    await open(wrapper)
    await wrapper.find('.mq-col-picker__action').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(2)
  })
})
