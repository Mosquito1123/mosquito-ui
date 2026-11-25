import { afterEach, describe, expect, test } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MqMessageBox from '@/components/mq-message-box/MqMessageBox.vue'
import { useMessage } from '@/composables/use-message'
import { resetMessageBoxes } from '@/utils/message-box'

afterEach(() => {
  resetMessageBoxes()
})

describe('MqMessageBox', () => {
  test('alert 只有确定按钮，确认后 Promise 完成', async () => {
    const wrapper = mount(MqMessageBox)
    const message = useMessage()
    const pending = message.alert('操作成功')
    await nextTick()

    expect(wrapper.find('.mq-message-box__msg').text()).toBe('操作成功')
    expect(wrapper.find('.mq-dialog__btn--cancel').exists()).toBe(false)
    expect(wrapper.find('.mq-dialog__btn--confirm').exists()).toBe(true)

    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await flushPromises()
    await expect(pending).resolves.toBeUndefined()
  })

  test('confirm 取消时以 cancel 拒绝', async () => {
    const wrapper = mount(MqMessageBox)
    const pending = useMessage().confirm({ title: '提示', msg: '确定删除吗' })
    await nextTick()

    expect(wrapper.find('.mq-dialog__title').text()).toBe('提示')
    await wrapper.find('.mq-dialog__btn--cancel').trigger('click')
    await expect(pending).rejects.toBe('cancel')
  })

  test('prompt 校验失败时留在面板，校验通过后返回输入值', async () => {
    const wrapper = mount(MqMessageBox)
    const pending = useMessage().prompt({
      title: '输入数字',
      inputValue: 'abc',
      inputPattern: /^\d+$/,
      inputError: '只能输入数字',
    })
    await nextTick()

    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入内容')
    expect(wrapper.find('input').element.value).toBe('abc')

    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await flushPromises()
    expect(wrapper.find('.mq-message-box__error').text()).toBe('只能输入数字')
    expect(wrapper.find('.mq-dialog').exists()).toBe(true)

    await wrapper.find('input').setValue('123')
    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await flushPromises()
    await expect(pending).resolves.toBe('123')
  })

  test('inputValidate 支持异步校验', async () => {
    const wrapper = mount(MqMessageBox)
    const pending = useMessage().prompt({
      inputValidate: async (value: string) => value === 'ok',
    })
    await nextTick()

    await wrapper.find('input').setValue('no')
    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await flushPromises()
    expect(wrapper.find('.mq-message-box__error').text()).toBe('输入的数据不合法')

    await wrapper.find('input').setValue('ok')
    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await flushPromises()
    await expect(pending).resolves.toBe('ok')
  })

  test('beforeConfirm 可通过 resolve(false) 拦截关闭', async () => {
    const wrapper = mount(MqMessageBox)
    let allow = false
    const pending = useMessage().confirm({
      msg: '删除',
      beforeConfirm: ({ resolve }) => resolve(allow),
    })
    await nextTick()

    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await flushPromises()
    expect(wrapper.find('.mq-dialog').exists()).toBe(true)

    allow = true
    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await flushPromises()
    await expect(pending).resolves.toBeUndefined()
  })

  test('点击遮罩以 modal 拒绝，maskClosable 为 false 时不关闭', async () => {
    const wrapper = mount(MqMessageBox)
    const message = useMessage()
    const blocked = message.confirm({ msg: '提示', closeOnClickModal: false })
    await nextTick()

    await wrapper.find('.mq-popup').trigger('click')
    await flushPromises()
    expect(wrapper.find('.mq-dialog').exists()).toBe(true)

    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await expect(blocked).resolves.toBeUndefined()
    await nextTick()

    const second = message.confirm({ msg: '可关闭' })
    await nextTick()
    await wrapper.find('.mq-popup').trigger('click')
    await expect(second).rejects.toBe('modal')
  })

  test('selector 隔离多个宿主', async () => {
    const first = mount(MqMessageBox, { props: { selector: 'first' } })
    const second = mount(MqMessageBox, { props: { selector: 'second' } })
    const pending = useMessage('second').alert('只给第二个')
    await nextTick()

    expect(first.find('.mq-dialog').exists()).toBe(false)
    expect(second.find('.mq-message-box__msg').text()).toBe('只给第二个')

    await second.find('.mq-dialog__btn--confirm').trigger('click')
    await flushPromises()
    await expect(pending).resolves.toBeUndefined()
  })
})
