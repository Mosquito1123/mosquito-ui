import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MqKeyboard from '@/components/mq-keyboard/MqKeyboard.vue'

function keyByLabel(wrapper: ReturnType<typeof mount>, label: string) {
  return wrapper.findAll('.mq-keyboard__key').find((key) => key.text() === label)
}

function mountKeyboard(props: Record<string, unknown> = {}) {
  return mount(MqKeyboard, { props: { visible: true, ...props } })
}

describe('MqKeyboard', () => {
  test('renders only when visible', async () => {
    const wrapper = mount(MqKeyboard)
    expect(wrapper.find('.mq-keyboard').exists()).toBe(false)
    await wrapper.setProps({ visible: true })
    expect(wrapper.find('.mq-keyboard').exists()).toBe(true)
    await wrapper.setProps({ visible: false })
    expect(wrapper.find('.mq-keyboard').exists()).toBe(false)
  })

  test('emits input on touch and supports click fallback', async () => {
    const wrapper = mountKeyboard()
    const q = keyByLabel(wrapper, 'q')
    expect(q).toBeTruthy()
    await q!.trigger('touchend')
    expect(wrapper.emitted('input')).toEqual([['q']])

    const w = keyByLabel(wrapper, 'w')
    await w!.trigger('click')
    expect(wrapper.emitted('input')).toEqual([['q'], ['w']])

    // 同一个键的 touchend + click 只输入一次。
    await q!.trigger('touchend')
    await q!.trigger('click')
    expect(wrapper.emitted('input')).toHaveLength(3)
  })

  test('emits space and delete', async () => {
    const wrapper = mountKeyboard()
    await keyByLabel(wrapper, '空格')!.trigger('touchend')
    expect(wrapper.emitted('input')).toEqual([[' ']])
    await keyByLabel(wrapper, '删除')!.trigger('touchend')
    expect(wrapper.emitted('delete')).toHaveLength(1)
  })

  test('maxlength stops further input until a delete', async () => {
    const wrapper = mountKeyboard({ maxlength: 1 })
    await keyByLabel(wrapper, 'q')!.trigger('touchend')
    await keyByLabel(wrapper, 'w')!.trigger('touchend')
    expect(wrapper.emitted('input')).toEqual([['q']])
    await keyByLabel(wrapper, '删除')!.trigger('touchend')
    await keyByLabel(wrapper, 'w')!.trigger('touchend')
    expect(wrapper.emitted('input')).toEqual([['q'], ['w']])
  })

  test('shift toggles letter case', async () => {
    const wrapper = mountKeyboard()
    expect(keyByLabel(wrapper, 'q')).toBeTruthy()
    await keyByLabel(wrapper, 'Shift')!.trigger('touchend')
    expect(keyByLabel(wrapper, 'Q')).toBeTruthy()
    await keyByLabel(wrapper, 'Q')!.trigger('touchend')
    expect(wrapper.emitted('input')).toEqual([['Q']])
    expect(keyByLabel(wrapper, 'Shift')!.classes()).toContain('is-active')
  })

  test('switches mode via tabs and control keys, emitting change', async () => {
    const wrapper = mountKeyboard()
    const numTab = wrapper.findAll('.mq-keyboard__tab').find((tab) => tab.text() === '数字')
    await numTab!.trigger('touchend')
    expect(wrapper.emitted('change')).toEqual([['num']])
    expect(keyByLabel(wrapper, '1')).toBeTruthy()

    await keyByLabel(wrapper, '符号')!.trigger('touchend')
    expect(wrapper.emitted('change')).toEqual([['num'], ['symbol']])
    expect(keyByLabel(wrapper, '返回')).toBeTruthy()

    await keyByLabel(wrapper, '返回')!.trigger('touchend')
    expect(wrapper.emitted('change')).toEqual([['num'], ['symbol'], ['num']])
  })

  test('external mode prop syncs internal page without emitting change', async () => {
    const wrapper = mountKeyboard({ mode: 'abc' })
    await wrapper.setProps({ mode: 'symbol' })
    expect(keyByLabel(wrapper, '返回')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  test('confirm emits confirm then closes; mask emits close', async () => {
    const wrapper = mountKeyboard({ showConfirm: true, confirmText: '完成' })
    const confirm = wrapper.find('.mq-keyboard__confirm')
    expect(confirm.text()).toBe('完成')
    await confirm.trigger('touchend')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
    expect(wrapper.emitted('close')).toHaveLength(1)

    const other = mountKeyboard()
    await other.find('.mq-keyboard').trigger('click')
    expect(other.emitted('close')).toHaveLength(1)
  })

  test('random order keeps every letter key', () => {
    const wrapper = mountKeyboard({ randomOrder: true })
    const letters = wrapper.findAll('.mq-keyboard__key').filter((key) => /^[a-z]$/.test(key.text()))
    expect(letters).toHaveLength(26)
  })
})
