import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import MqActionSheet from '@/components/mq-action-sheet/MqActionSheet.vue'
import type { MqActionSheetItem } from '@/components/mq-action-sheet/types'

const actions: MqActionSheetItem[] = [
  { name: '编辑', description: '修改内容', color: '#ff0000' },
  { name: '删除', disabled: true },
  { name: '提交中', loading: true },
  { name: '分享' },
]

function mountSheet(props: Record<string, unknown> = {}) {
  return mount(MqActionSheet, { props: { modelValue: true, actions, ...props } })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MqActionSheet', () => {
  test('渲染标题、操作项、描述、颜色与默认取消文案', async () => {
    const wrapper = mountSheet({ title: '更多操作' })
    await nextTick()

    expect(wrapper.find('.mq-action-sheet__title').text()).toBe('更多操作')
    const rows = wrapper.findAll('.mq-action-sheet__row')
    expect(rows).toHaveLength(4)
    expect(rows[0].find('.mq-action-sheet__name').text()).toBe('编辑')
    expect(rows[0].find('.mq-action-sheet__desc').text()).toBe('修改内容')
    expect(rows[0].find('.mq-action-sheet__name').attributes('style')).toContain('rgb(255, 0, 0)')
    expect(rows[1].classes()).toContain('is-disabled')
    expect(rows[1].attributes('aria-disabled')).toBe('true')
    expect(wrapper.find('.mq-action-sheet__cancel').text()).toBe('取消')
    expect(wrapper.find('.mq-safe-bottom').exists()).toBe(true)
  })

  test('选中操作项发出带 item 和 index 的 select，并默认关闭', async () => {
    const wrapper = mountSheet()

    await wrapper.findAll('.mq-action-sheet__row')[0].trigger('click')
    expect(wrapper.emitted('select')).toEqual([[{ item: actions[0], index: 0 }]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  test('closeOnClickAction 为 false 时选中不自动关闭', async () => {
    const wrapper = mountSheet({ closeOnClickAction: false })

    await wrapper.findAll('.mq-action-sheet__row')[3].trigger('click')
    expect(wrapper.emitted('select')).toEqual([[{ item: actions[3], index: 3 }]])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  test('禁用项和加载项都不可选中，加载项显示文字标记', async () => {
    const wrapper = mountSheet()

    const disabled = wrapper.findAll('.mq-action-sheet__row')[1]
    const loading = wrapper.findAll('.mq-action-sheet__row')[2]
    expect(loading.classes()).toContain('is-loading')
    expect(loading.attributes('aria-disabled')).toBe('true')
    expect(loading.attributes('tabindex')).toBeUndefined()
    expect(loading.find('.mq-action-sheet__loading').text()).toBe('…')

    await disabled.trigger('click')
    await loading.trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  test('键盘 Enter 和 Space 也能选中，加载项不响应键盘', async () => {
    const wrapper = mountSheet({ closeOnClickAction: false })

    await wrapper.findAll('.mq-action-sheet__row')[3].trigger('keydown.enter')
    await wrapper.findAll('.mq-action-sheet__row')[3].trigger('keydown.space')
    await wrapper.findAll('.mq-action-sheet__row')[2].trigger('keydown.enter')
    expect(wrapper.emitted('select')).toHaveLength(2)
    expect(wrapper.emitted('select')![1][0]).toMatchObject({ index: 3 })
  })

  test('点击取消发出 cancel 并关闭，可自定义取消文案', async () => {
    const wrapper = mountSheet()
    await wrapper.find('.mq-action-sheet__cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])

    const custom = mountSheet({ cancelText: '关闭菜单' })
    expect(custom.find('.mq-action-sheet__cancel').text()).toBe('关闭菜单')
  })

  test('取消项支持键盘触发', async () => {
    const wrapper = mountSheet()
    await wrapper.find('.mq-action-sheet__cancel').trigger('keydown.enter')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  test('遮罩点击按 maskClosable 决定是否关闭，并转发 popup 的 close', async () => {
    const wrapper = mountSheet({ maskClosable: false })
    await nextTick()
    await wrapper.find('.mq-popup__mask').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    const closable = mountSheet({ duration: 80, zIndex: 50 })
    await nextTick()
    await closable.find('.mq-popup__mask').trigger('click')
    expect(closable.emitted('update:modelValue')).toEqual([[false]])

    await closable.setProps({ modelValue: false })
    expect(closable.emitted('close')).toHaveLength(1)
    expect(closable.find('.mq-popup').attributes('style')).toContain('--mq-popup-duration: 80ms')
    expect(closable.find('.mq-popup').attributes('style')).toContain('z-index: 50')
  })
})
