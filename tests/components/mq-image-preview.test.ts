import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MqImagePreview from '@/components/mq-image-preview/MqImagePreview.vue'
import { hideImagePreview, imagePreviewState, showImagePreview } from '@/utils/image-preview'

afterEach(() => {
  hideImagePreview()
  vi.restoreAllMocks()
})

describe('MqImagePreview', () => {
  it('渲染每张图片并展示当前序号', () => {
    const wrapper = mount(MqImagePreview, {
      props: { modelValue: true, urls: ['a.png', 'b.png', 'c.png'], current: 1, showIndex: true },
    })
    expect(wrapper.findAll('swiper-item')).toHaveLength(3)
    expect(wrapper.find('swiper').attributes('circular')).toBe('true')
    expect(wrapper.find('.mq-image-preview__index').text()).toBe('2 / 3')
    expect(wrapper.findAll('.mq-image-preview__dot')).toHaveLength(3)
    expect(wrapper.find('.mq-image-preview__dot.is-active').exists()).toBe(true)
  })

  it('轮播切换发出 change 并更新序号', async () => {
    const wrapper = mount(MqImagePreview, {
      props: { modelValue: true, urls: ['a.png', 'b.png'], showIndex: true },
    })
    await wrapper.find('swiper').trigger('change', { detail: { current: 1 } })
    expect(wrapper.emitted('change')).toEqual([[{ index: 1 }]])
    expect(wrapper.find('.mq-image-preview__index').text()).toBe('2 / 2')
  })

  it('遮罩点击、关闭按钮都会请求关闭', async () => {
    const wrapper = mount(MqImagePreview, {
      props: { modelValue: true, urls: ['a.png'] },
    })
    await wrapper.find('.mq-image-preview').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('mask-closable 为 false 时遮罩不关闭，但按钮仍可关闭', async () => {
    const wrapper = mount(MqImagePreview, {
      props: { modelValue: true, urls: ['a.png'], maskClosable: false },
    })
    await wrapper.find('.mq-image-preview').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
    await wrapper.find('.mq-image-preview__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('长按发出带索引和地址的 longpress', async () => {
    const wrapper = mount(MqImagePreview, {
      props: { modelValue: true, urls: ['a.png', 'b.png'], current: 1 },
    })
    await wrapper.find('image').trigger('longpress')
    expect(wrapper.emitted('longpress')).toEqual([[{ index: 1, url: 'b.png' }]])
  })

  it('双击切换放大状态', async () => {
    const wrapper = mount(MqImagePreview, {
      props: { modelValue: true, urls: ['a.png'] },
    })
    await wrapper.find('image').trigger('click')
    expect(wrapper.find('image').classes()).not.toContain('is-zoomed')
    await wrapper.find('image').trigger('click')
    expect(wrapper.find('image').classes()).toContain('is-zoomed')
  })

  it('不传 props 时读取全局状态，并由组件关闭全局预览', async () => {
    showImagePreview({ urls: ['g1.png', 'g2.png'], current: 1 })
    const wrapper = mount(MqImagePreview)
    expect(imagePreviewState.visible).toBe(true)
    expect(wrapper.findAll('swiper-item')).toHaveLength(2)
    await wrapper.find('swiper').trigger('change', { detail: { current: 0 } })
    expect(imagePreviewState.index).toBe(0)
    await wrapper.find('.mq-image-preview__close').trigger('click')
    expect(imagePreviewState.visible).toBe(false)
  })

  it('受控模式不会改动全局预览状态', async () => {
    showImagePreview(['g.png'])
    const wrapper = mount(MqImagePreview, { props: { modelValue: true, urls: ['a.png'] } })
    await wrapper.find('.mq-image-preview__close').trigger('click')
    expect(imagePreviewState.visible).toBe(true)
  })

  it('visible 命名 v-model 同样可用', async () => {
    const wrapper = mount(MqImagePreview, { props: { visible: true, urls: ['a.png'] } })
    expect(wrapper.find('.mq-image-preview').exists()).toBe(true)
    await wrapper.find('.mq-image-preview__close').trigger('click')
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })
})
