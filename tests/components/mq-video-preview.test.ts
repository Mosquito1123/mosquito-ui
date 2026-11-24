import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MqVideoPreview from '@/components/mq-video-preview/MqVideoPreview.vue'
import { hideVideoPreview, showVideoPreview, videoPreviewState } from '@/utils/video-preview'

afterEach(() => {
  hideVideoPreview()
  vi.restoreAllMocks()
})

describe('MqVideoPreview', () => {
  it('用 props 渲染视频、标题和封面', () => {
    const wrapper = mount(MqVideoPreview, {
      props: {
        modelValue: true,
        src: 'a.mp4',
        title: '演示',
        poster: 'cover.png',
      },
    })
    const video = wrapper.find('video')
    expect(video.attributes('src')).toBe('a.mp4')
    expect(video.attributes('poster')).toBe('cover.png')
    expect(wrapper.find('.mq-video-preview__title').text()).toBe('演示')
  })

  it('转发 play / pause / end 事件', async () => {
    const wrapper = mount(MqVideoPreview, { props: { modelValue: true, src: 'a.mp4' } })
    const video = wrapper.find('video')
    await video.trigger('play')
    await video.trigger('pause')
    await video.trigger('ended')
    expect(wrapper.emitted('play')).toHaveLength(1)
    expect(wrapper.emitted('pause')).toHaveLength(1)
    expect(wrapper.emitted('end')).toHaveLength(1)
  })

  it('关闭按钮发出 update 和 close', async () => {
    const wrapper = mount(MqVideoPreview, { props: { modelValue: true, src: 'a.mp4' } })
    await wrapper.find('.mq-video-preview__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('show-close 为 false 时不渲染关闭按钮', () => {
    const wrapper = mount(MqVideoPreview, {
      props: { modelValue: true, src: 'a.mp4', showClose: false },
    })
    expect(wrapper.find('.mq-video-preview__close').exists()).toBe(false)
  })

  it('不传 props 时读全局状态，关闭时清理全局状态', async () => {
    showVideoPreview({ src: 'global.mp4', title: '全局', poster: 'g.png' })
    const wrapper = mount(MqVideoPreview)
    expect(videoPreviewState.visible).toBe(true)
    expect(wrapper.find('video').attributes('src')).toBe('global.mp4')
    expect(wrapper.find('.mq-video-preview__title').text()).toBe('全局')
    await wrapper.find('.mq-video-preview__close').trigger('click')
    expect(videoPreviewState.visible).toBe(false)
  })

  it('受控模式不会改动全局预览状态', async () => {
    showVideoPreview('global.mp4')
    const wrapper = mount(MqVideoPreview, { props: { modelValue: true, src: 'local.mp4' } })
    await wrapper.find('.mq-video-preview__close').trigger('click')
    expect(videoPreviewState.visible).toBe(true)
  })

  it('visible 命名 v-model 同样可用', async () => {
    const wrapper = mount(MqVideoPreview, { props: { visible: true, src: 'a.mp4' } })
    expect(wrapper.find('.mq-video-preview').exists()).toBe(true)
    await wrapper.find('.mq-video-preview__close').trigger('click')
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })
})
