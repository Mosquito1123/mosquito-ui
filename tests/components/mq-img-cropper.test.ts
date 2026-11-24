import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MqImgCropper from '@/components/mq-img-cropper/MqImgCropper.vue'

const uniApi = (globalThis as unknown as { uni: Record<string, any> }).uni

function mockImageInfo(width = 300, height = 200) {
  return vi.spyOn(uniApi, 'getImageInfo').mockImplementation((options: any) => {
    options?.success?.({ width, height, path: 'source.png' })
  })
}

function mockExport() {
  // setup.ts 没有预置该能力，先补一个再 spy，避免污染全局 setup。
  if (typeof uniApi.canvasToTempFilePath !== 'function') {
    uniApi.canvasToTempFilePath = vi.fn()
  }
  return vi.spyOn(uniApi, 'canvasToTempFilePath').mockImplementation((options: any) => {
    options?.success?.({ tempFilePath: 'out.png' })
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MqImgCropper', () => {
  it('图片信息加载完成后发出 ready', () => {
    mockImageInfo(320, 240)
    const wrapper = mount(MqImgCropper, { props: { src: 'a.png' } })
    expect(wrapper.emitted('ready')).toEqual([[{ width: 320, height: 240 }]])
  })

  it('裁剪导出发出带尺寸与路径的 confirm', () => {
    mockImageInfo()
    mockExport()
    const wrapper = mount(MqImgCropper, {
      props: { src: 'a.png', width: 100, height: 50, aspectRatio: '2:1', quality: 0.8 },
    })
    ;(wrapper.vm as any).crop()
    expect(wrapper.emitted('confirm')).toEqual([[{ path: 'out.png', width: 100, height: 50 }]])
  })

  it('只有宽度时按 aspect-ratio 推算高度', () => {
    mockImageInfo()
    mockExport()
    const wrapper = mount(MqImgCropper, {
      props: { src: 'a.png', width: 100, aspectRatio: 0.5 },
    })
    ;(wrapper.vm as any).crop()
    expect(wrapper.emitted('confirm')).toEqual([[{ path: 'out.png', width: 100, height: 200 }]])
  })

  it('选图后更新图片并重新加载', async () => {
    mockImageInfo(10, 20)
    vi.spyOn(uniApi, 'chooseImage').mockImplementation((options: any) => {
      options?.success?.({ tempFilePaths: ['picked.png'] })
    })
    const wrapper = mount(MqImgCropper)
    expect(wrapper.find('image').exists()).toBe(false)
    ;(wrapper.vm as any).chooseImage()
    await nextTick()
    expect(wrapper.find('image').attributes('src')).toBe('picked.png')
    expect(wrapper.emitted('ready')).toEqual([[{ width: 10, height: 20 }]])
  })

  it('旋转、重置与九宫格', async () => {
    mockImageInfo()
    const wrapper = mount(MqImgCropper, { props: { src: 'a.png', showGrid: true } })
    expect(wrapper.find('.mq-img-cropper__grid').exists()).toBe(true)
    ;(wrapper.vm as any).rotate()
    await nextTick()
    expect(wrapper.find('image').attributes('style')).toContain('rotate(90deg)')
    ;(wrapper.vm as any).reset()
    await nextTick()
    expect(wrapper.find('image').attributes('style')).toContain('rotate(0deg)')
  })

  it('单指拖动改变位移', async () => {
    mockImageInfo()
    const wrapper = mount(MqImgCropper, { props: { src: 'a.png' } })
    const image = wrapper.find('image')
    await image.trigger('touchstart', { touches: [{ clientX: 10, clientY: 10 }] })
    await image.trigger('touchmove', { touches: [{ clientX: 30, clientY: 25 }] })
    await nextTick()
    expect(wrapper.find('image').attributes('style')).toContain('translate(20px, 15px)')
  })

  it('禁用态不发出事件且不响应方法', async () => {
    mockImageInfo()
    mockExport()
    const wrapper = mount(MqImgCropper, { props: { src: 'a.png', disabled: true } })
    ;(wrapper.vm as any).rotate()
    ;(wrapper.vm as any).crop()
    ;(wrapper.vm as any).chooseImage()
    await wrapper.find('.mq-img-cropper__action.is-confirm').trigger('click')
    await nextTick()
    expect(wrapper.find('image').attributes('style')).toContain('rotate(0deg)')
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('取消发出 cancel', async () => {
    mockImageInfo()
    const wrapper = mount(MqImgCropper, { props: { src: 'a.png' } })
    const cancel = wrapper.findAll('.mq-img-cropper__action').filter((item) => item.text() === '取消')[0]
    await cancel.trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('jsdom 下缺少原生能力时不抛错', async () => {
    // setup.ts 里的 uni.getImageInfo / canvasToTempFilePath 是未设实现的 vi.fn()
    const wrapper = mount(MqImgCropper, { props: { src: 'a.png' } })
    await expect(Promise.resolve().then(() => (wrapper.vm as any).crop())).resolves.toBeUndefined()
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })
})
