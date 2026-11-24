import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MqBarCode from '../../packages/ui/src/components/mq-bar-code/MqBarCode.vue'
import {
  encodeBarCode,
  getCode128CheckDigit,
  isValidBarCodeText,
} from '../../packages/ui/src/components/mq-bar-code/barcode'
import {
  countModules,
  drawBarCode,
  resolveBarCodeLayout,
} from '../../packages/ui/src/components/mq-bar-code/barcode-render'
import type { BarCodeRenderOptions } from '../../packages/ui/src/components/mq-bar-code/barcode-render'

const uniApi = (globalThis as Record<string, any>).uni

const options: BarCodeRenderOptions = {
  width: 200,
  height: 60,
  lineWidth: 2,
  displayValue: true,
  textPosition: 'bottom',
  fontSize: 12,
  textMargin: 4,
  color: '#000000',
  background: '#ffffff',
}

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

function mountBar(props: Record<string, unknown> = {}) {
  return mount(MqBarCode, {
    props: { canvasId: 'mq-bar-test-canvas', text: 'HELLO', ...props },
    attachTo: document.body,
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('encodeBarCode', () => {
  it('CODE128B 首尾为黑条，模块数符合码制规则', () => {
    const { bars, text } = encodeBarCode('HELLO', 'CODE128')
    expect(text).toBe('HELLO')
    expect(bars.length).toBeGreaterThan(0)
    expect(bars.every((width) => width > 0)).toBe(true)
    // 下标 0 为黑条：首尾同为黑条等价于 run 数为奇数
    expect(bars.length % 2).toBe(1)
    expect(bars[0]).toBeGreaterThan(0)
    expect(bars[bars.length - 1]).toBeGreaterThanOrEqual(2) // 停止符末尾与终止黑条相连
    // 起始 + 5 个数据符 + 校验位 = 7 * 11，停止符 13，终止黑条 2
    expect(countModules(bars)).toBe(7 * 11 + 13 + 2)
  })

  it('校验位计算正确并对偶数位数字启用 CODE128C', () => {
    expect(getCode128CheckDigit([104, 33])).toBe(34) // 起始 B + 'A'
    const { bars } = encodeBarCode('123456')
    expect(countModules(bars)).toBe(5 * 11 + 13 + 2) // 起始 C + 3 组数字对 + 校验 = 5 个 11 模块符号
    expect(bars.length % 2).toBe(1)
  })

  it('覆盖 ASCII 32-126 全部可打印字符', () => {
    const text = Array.from({ length: 95 }, (_, index) => String.fromCharCode(32 + index)).join('')
    const { bars } = encodeBarCode(text)
    expect(countModules(bars)).toBe((1 + 95 + 1) * 11 + 13 + 2)
  })

  it('非法字符、空内容与非 CODE128 格式给出明确错误', () => {
    expect(() => encodeBarCode('你好')).toThrow(/ASCII/)
    expect(() => encodeBarCode('')).toThrow(/不能为空/)
    expect(() => encodeBarCode('ABC', 'EAN13')).toThrow(/CODE128/)
    expect(isValidBarCodeText('你好')).toBe(false)
    expect(isValidBarCodeText('ABC')).toBe(true)
  })
})

describe('barcode-render', () => {
  it('按宽度缩放模块并预留文字空间', () => {
    const { bars } = encodeBarCode('HELLO')
    const layout = resolveBarCodeLayout(bars, options)
    expect(layout.width).toBe(200)
    expect(layout.height).toBe(60)
    expect(layout.moduleWidth).toBeCloseTo(200 / 92)
    expect(layout.barHeight).toBe(44)
    expect(layout.textY).toBe(56)

    const top = resolveBarCodeLayout(bars, { ...options, textPosition: 'top' })
    expect(top.barTop).toBe(16)
    expect(top.textY).toBe(12)
  })

  it('仅绘制黑条并标注文字，兼容两种 context', () => {
    const { bars } = encodeBarCode('HELLO')
    const ctx = {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      setFillStyle: vi.fn(),
      setFontSize: vi.fn(),
      setTextAlign: vi.fn(),
      fillText: vi.fn(),
      draw: vi.fn(),
    }
    const layout = drawBarCode(ctx as any, bars, 'HELLO', options)
    expect(ctx.clearRect).toHaveBeenCalled()
    expect(ctx.fillRect.mock.calls.length).toBeGreaterThan(1)
    expect(ctx.fillText).toHaveBeenCalledWith('HELLO', layout.width / 2, layout.textY)
    expect(ctx.draw).toHaveBeenCalled()
  })

  it('H5 context 使用属性写法时不抛错', () => {
    const { bars } = encodeBarCode('A')
    const ctx = { fillRect: vi.fn() }
    expect(() => drawBarCode(ctx as any, bars, 'A', options)).not.toThrow()
    expect(ctx.fillRect).toHaveBeenCalled()
  })
})

describe('MqBarCode', () => {
  it('合法内容发出 valid(true) 并通过 uni canvas 绘制', async () => {
    const spy = vi.spyOn(uniApi, 'createCanvasContext')
    const wrapper = mountBar()
    await settle()
    expect(wrapper.emitted('valid')?.[0]).toEqual([true])
    expect(spy).toHaveBeenCalled()
    expect(spy.mock.results[0].value.fillRect).toHaveBeenCalled()
    expect(wrapper.find('.mq-bar-code__fallback').exists()).toBe(false)

    const vm = wrapper.vm as unknown as { draw: () => void }
    expect(typeof vm.draw).toBe('function')
    wrapper.unmount()
  })

  it('非法字符与不支持的格式发出 valid(false) 和 error', async () => {
    const wrapper = mountBar({ text: '你好' })
    await settle()
    expect(wrapper.emitted('valid')?.[0]).toEqual([false])
    expect(wrapper.emitted('error')).toBeTruthy()
    expect(wrapper.find('.mq-bar-code__fallback').exists()).toBe(true)
    wrapper.unmount()

    const other = mountBar({ format: 'EAN13' })
    await settle()
    expect(other.emitted('valid')?.[0]).toEqual([false])
    expect(other.emitted('error')).toBeTruthy()
    other.unmount()
  })

  it('文本变化时重绘', async () => {
    const spy = vi.spyOn(uniApi, 'createCanvasContext')
    const wrapper = mountBar()
    await settle()
    const before = spy.mock.calls.length
    await wrapper.setProps({ text: 'WORLD' })
    await settle()
    expect(spy.mock.calls.length).toBeGreaterThan(before)
    wrapper.unmount()
  })

  it('无 canvas 环境安全降级，不抛错', async () => {
    vi.spyOn(uniApi, 'createCanvasContext').mockReturnValue(undefined)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const wrapper = mountBar()
    await settle()
    expect(wrapper.find('.mq-bar-code__fallback').exists()).toBe(true)
    expect(() => (wrapper.vm as unknown as { draw: () => void }).draw()).not.toThrow()
    wrapper.unmount()
  })
})
