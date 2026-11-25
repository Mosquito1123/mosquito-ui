import { afterEach, describe, expect, test } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MqMessageBox from '@/components/mq-message-box/MqMessageBox.vue'
import { useMessage } from '@/composables/use-message'
import { currentMessageBox, resetMessageBoxes } from '@/utils/message-box'

afterEach(() => {
  resetMessageBoxes()
})

describe('useMessage', () => {
  test('show 默认按 alert 渲染，也接受显式 type', async () => {
    const wrapper = mount(MqMessageBox)
    const message = useMessage()

    const defaulted = message.show('默认 alert')
    await nextTick()
    expect(wrapper.find('.mq-dialog__btn--cancel').exists()).toBe(false)
    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await expect(defaulted).resolves.toBeUndefined()

    const typed = message.show({ msg: '显式 confirm', type: 'confirm' })
    await nextTick()
    expect(wrapper.find('.mq-dialog__btn--cancel').exists()).toBe(true)
    await wrapper.find('.mq-dialog__btn--cancel').trigger('click')
    await expect(typed).rejects.toBe('cancel')
  })

  test('selector 与 show 的原样参数透传', async () => {
    const wrapper = mount(MqMessageBox, { props: { selector: 'page-a' } })
    const message = useMessage('page-a')
    expect(message.selector).toBe('page-a')

    const pending = message.show({ msg: '自定义', type: 'confirm', title: '标题' })
    await nextTick()
    expect(wrapper.find('.mq-dialog__title').text()).toBe('标题')
    expect(wrapper.find('.mq-message-box__msg').text()).toBe('自定义')

    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await expect(pending).resolves.toBeUndefined()
  })

  test('alert 接受纯字符串，prompt 返回输入值', async () => {
    const wrapper = mount(MqMessageBox)
    const message = useMessage()

    const alerted = message.alert('纯字符串')
    await nextTick()
    expect(wrapper.find('.mq-message-box__msg').text()).toBe('纯字符串')
    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await expect(alerted).resolves.toBeUndefined()

    const prompted = message.prompt({ inputValue: 42 })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('42')
    await wrapper.find('.mq-dialog__btn--confirm').trigger('click')
    await flushPromises()
    await expect(prompted).resolves.toBe('42')
  })

  test('close 关闭当前弹框并以 modal 拒绝', async () => {
    mount(MqMessageBox)
    const message = useMessage()
    const pending = message.confirm('关闭我')
    await nextTick()

    const rejected = expect(pending).rejects.toBe('modal')
    message.close()
    await rejected
    await flushPromises()
    expect(currentMessageBox()).toBeUndefined()
  })
})
