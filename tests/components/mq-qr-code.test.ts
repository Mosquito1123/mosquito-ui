import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MqQrCode from '../../packages/ui/src/components/mq-qr-code/MqQrCode.vue'
import { generateQRCode, QRErrorCorrectLevel } from '../../packages/ui/src/components/mq-qr-code/qrcode'

const uniApi = (globalThis as Record<string, any>).uni

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

function mountQr(props: Record<string, unknown> = {}) {
  return mount(MqQrCode, {
    props: { canvasId: 'mq-qr-test-canvas', text: 'HELLO', ...props },
    attachTo: document.body,
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('generateQRCode', () => {
  it('生成非空方阵，尺寸与模块数一致', () => {
    const { modules, size } = generateQRCode('HELLO', 'M')
    expect(modules.length).toBeGreaterThan(0)
    expect(size).toBe(modules.length)
    expect(modules[0].length).toBe(size)
    expect(modules.some((row) => row.some(Boolean))).toBe(true)
    expect(size).toBe(21) // 短文本使用 version 1
  })

  it('左上角定位图形为 7x7 黑白相间的回字形', () => {
    const { modules } = generateQRCode('A')
    expect(modules[0][0]).toBe(true)
    expect(modules[6][6]).toBe(true)
    expect(modules[1][1]).toBe(false)
    expect(modules[3][3]).toBe(true)
  })

  it('支持中文 UTF-8 与纠错级别数值/字符两种入参', () => {
    const byChar = generateQRCode('你好，世界', 'H')
    const byValue = generateQRCode('你好，世界', QRErrorCorrectLevel.H)
    expect(byChar.size).toBe(byValue.size)
    expect(byChar.modules).toEqual(byValue.modules)
  })

  it('不同内容和纠错级别产生不同矩阵，超长文本抛错', () => {
    const a = generateQRCode('HELLO', 'L')
    const b = generateQRCode('WORLD', 'L')
    const c = generateQRCode('HELLO', 'H')
    expect(a.modules).not.toEqual(b.modules)
    expect(a.modules).not.toEqual(c.modules)
    expect(() => generateQRCode('x'.repeat(5000), 'H')).toThrow()
  })
})

describe('MqQrCode', () => {
  it('挂载后通过 uni canvas 绘制，并暴露 draw / toDataURL', async () => {
    const spy = vi.spyOn(uniApi, 'createCanvasContext')
    const wrapper = mountQr()
    await settle()

    expect(spy).toHaveBeenCalled()
    const ctx = spy.mock.results[0].value
    expect(ctx.fillRect).toHaveBeenCalled()
    expect(ctx.draw).toHaveBeenCalled()
    expect(wrapper.find('.mq-qr-code__fallback').exists()).toBe(false)

    const vm = wrapper.vm as unknown as { draw: () => void; toDataURL: () => string | undefined }
    expect(typeof vm.draw).toBe('function')
    expect(typeof vm.toDataURL).toBe('function')
    // jsdom 的 toDataURL 不可用：返回 null 或抛错都应安全降级为 undefined
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(null)
    expect(vm.toDataURL()).toBeUndefined()
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(() => {
      throw new Error('no canvas')
    })
    expect(vm.toDataURL()).toBeUndefined()
    wrapper.unmount()
  })

  it('文本变化时重绘', async () => {
    const spy = vi.spyOn(uniApi, 'createCanvasContext')
    const wrapper = mountQr()
    await settle()
    const before = spy.mock.calls.length

    await wrapper.setProps({ text: 'WORLD' })
    await settle()
    expect(spy.mock.calls.length).toBeGreaterThan(before)
    wrapper.unmount()
  })

  it('空文本发出 error 并显示占位', async () => {
    const wrapper = mountQr({ text: '' })
    await settle()
    expect(wrapper.emitted('error')).toBeTruthy()
    expect(wrapper.find('.mq-qr-code__fallback').text()).toContain('二维码内容为空')
    wrapper.unmount()
  })

  it('点击发出 click 事件', async () => {
    const wrapper = mountQr()
    await settle()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    wrapper.unmount()
  })

  it('无 canvas 环境安全降级，不抛错', async () => {
    vi.spyOn(uniApi, 'createCanvasContext').mockReturnValue(undefined)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const wrapper = mountQr()
    await settle()
    expect(wrapper.find('.mq-qr-code__fallback').exists()).toBe(true)
    expect(() => (wrapper.vm as unknown as { draw: () => void }).draw()).not.toThrow()
    wrapper.unmount()
  })

  it('卸载时清理重绘定时器', async () => {
    const spy = vi.spyOn(globalThis, 'clearTimeout')
    const wrapper = mountQr()
    const callsOnMount = spy.mock.calls.length
    wrapper.unmount()
    expect(spy.mock.calls.length).toBeGreaterThan(callsOnMount)
  })
})
