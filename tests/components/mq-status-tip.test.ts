import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import MqStatusTip from '@/components/mq-status-tip/MqStatusTip.vue'

describe('MqStatusTip', () => {
  test('默认展示 network 预设与提示文案', () => {
    const wrapper = mount(MqStatusTip, { props: { tip: '网络异常' } })
    expect(wrapper.find('.mq-status-tip__symbol').text()).toBe('⌁')
    expect(wrapper.find('.mq-status-tip__tip').text()).toBe('网络异常')
    expect(wrapper.find('image').exists()).toBe(false)
    expect(wrapper.attributes('role')).toBe('status')
  })

  test('预设类型使用文字符号，不引入图标字体或外链', () => {
    const wrapper = mount(MqStatusTip, { props: { image: 'search' } })
    expect(wrapper.find('.mq-status-tip__symbol').text()).toBe('⌕')
  })

  test('非预设字符串作为自定义图片 URL，并支持前缀与 mode', () => {
    const wrapper = mount(MqStatusTip, {
      props: { image: 'empty.png', urlPrefix: '/assets/', imageMode: 'widthFix' },
    })
    const image = wrapper.find('image')
    expect(image.attributes('src')).toBe('/assets/empty.png')
    expect(image.attributes('mode')).toBe('widthFix')
    expect(wrapper.find('.mq-status-tip__symbol').exists()).toBe(false)
  })

  test('imageSize 支持数字、字符串和对象', () => {
    const number = mount(MqStatusTip, { props: { imageSize: 80 } })
    expect(number.find('.mq-status-tip__mark').attributes('style')).toContain('width: 80px')

    const string = mount(MqStatusTip, { props: { imageSize: '6rem' } })
    expect(string.find('.mq-status-tip__mark').attributes('style')).toContain('height: 6rem')

    const object = mount(MqStatusTip, { props: { imageSize: { width: 120, height: '2em' } } })
    expect(object.find('.mq-status-tip__mark').attributes('style')).toContain('width: 120px')
    expect(object.find('.mq-status-tip__mark').attributes('style')).toContain('height: 2em')
  })

  test('image 插槽优先于预设与自定义图片，底部支持默认与 bottom 插槽', () => {
    const wrapper = mount(MqStatusTip, {
      props: { image: 'https://example.com/x.png', tip: '空' },
      slots: {
        image: '<text class="custom-image">自定义</text>',
        bottom: '<text class="custom-bottom">重试</text>',
        default: '<text class="custom-default">返回</text>',
      },
    })
    expect(wrapper.find('.custom-image').exists()).toBe(true)
    expect(wrapper.find('image').exists()).toBe(false)
    expect(wrapper.find('.custom-bottom').exists()).toBe(true)
    expect(wrapper.find('.custom-default').exists()).toBe(true)
  })
})
