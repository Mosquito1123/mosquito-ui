import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MqBarCode from '../../packages/ui/src/components/mq-bar-code/MqBarCode.vue'
import {
  encodeBarCode,
  getBarCodeCheckDigit,
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

/** 公开已知条码向量对应的模块宽度序列（下标为偶数是黑条）。 */
const VECTORS = {
  ean13: [
    1, 1, 1, 3, 1, 1, 2, 1, 1, 2, 3, 1, 2, 2, 2, 2, 1, 2, 2, 1, 4, 1, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
    1, 2, 1, 2, 2, 1, 4, 1, 1, 1, 1, 3, 2, 1, 2, 3, 1, 1, 3, 1, 2, 1, 1, 1,
  ],
  ean8: [
    1, 1, 1, 3, 1, 1, 2, 1, 1, 1, 4, 1, 4, 1, 1, 1, 2, 1, 3, 1, 1, 1, 1, 1, 1, 2, 3, 1, 3, 2, 1, 1, 1, 3, 1,
    2, 1, 1, 3, 2, 1, 1, 1,
  ],
  upca: [
    1, 1, 1, 3, 2, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 3, 2, 1, 1, 3, 2, 1, 1, 3, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2,
    2, 3, 1, 1, 2, 2, 2, 2, 1, 1, 1, 3, 2, 1, 2, 3, 1, 2, 1, 2, 2, 1, 1, 1,
  ],
  code39: [
    1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3,
    3, 1, 1, 3, 1, 3, 1, 1, 1, 3, 3, 1, 1, 1, 1, 3, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 3, 1, 1, 1,
    1, 3, 1, 1, 3, 1, 3, 1, 1,
  ],
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

function expectBars(actual: number[], expected: number[]) {
  expect(actual).toEqual(expected)
  expect(actual.length % 2).toBe(1) // 首尾均为黑条
  expect(actual[0]).toBeGreaterThan(0)
  expect(actual[actual.length - 1]).toBeGreaterThan(0)
  expect(actual.every((width) => width > 0)).toBe(true)
}

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('encodeBarCode / CODE128', () => {
  it('CODE128B 首尾为黑条，模块数符合码制规则', () => {
    const { bars, text } = encodeBarCode('HELLO', 'CODE128')
    expect(text).toBe('HELLO')
    expect(bars.length).toBeGreaterThan(0)
    expect(bars.every((width) => width > 0)).toBe(true)
    expect(bars.length % 2).toBe(1)
    expect(bars[0]).toBeGreaterThan(0)
    expect(bars[bars.length - 1]).toBeGreaterThanOrEqual(2)
    // 起始 + 5 个数据符 + 校验位 = 7 * 11，停止符 13，终止黑条 2
    expect(countModules(bars)).toBe(7 * 11 + 13 + 2)
  })

  it('校验位计算正确并对偶数位数字启用 CODE128C', () => {
    expect(getCode128CheckDigit([104, 33])).toBe(34) // 起始 B + 'A'
    const { bars } = encodeBarCode('123456')
    expect(countModules(bars)).toBe(5 * 11 + 13 + 2)
    expect(bars.length % 2).toBe(1)
  })

  it('覆盖 ASCII 32-126 全部可打印字符', () => {
    const text = Array.from({ length: 95 }, (_, index) => String.fromCharCode(32 + index)).join('')
    const { bars } = encodeBarCode(text)
    expect(countModules(bars)).toBe((1 + 95 + 1) * 11 + 13 + 2)
  })

  it('非法字符与空内容抛出明确错误', () => {
    expect(() => encodeBarCode('你好')).toThrow(/ASCII/)
    expect(() => encodeBarCode('')).toThrow(/不能为空/)
    expect(() => encodeBarCode('ABC', 'UNKNOWN' as any)).toThrow(/暂不支持/)
    expect(isValidBarCodeText('你好')).toBe(false)
    expect(isValidBarCodeText('ABC')).toBe(true)
  })
})

describe('encodeBarCode / EAN13', () => {
  it('已知向量 5901234123457 的 bars 与起始/中间/终止符一致', () => {
    const { bars, text } = encodeBarCode('5901234123457', 'EAN13')
    expect(text).toBe('5901234123457')
    expectBars(bars, VECTORS.ean13)
    expect(countModules(bars)).toBe(95) // 3 + 6*7 + 5 + 6*7 + 3
  })

  it('12 位自动补校验位，13 位校验已有校验位', () => {
    expect(getBarCodeCheckDigit('590123412345', 'EAN13')).toBe('7')
    expect(getBarCodeCheckDigit('5901234123457', 'EAN13')).toBe('7')
    const auto = encodeBarCode('590123412345', 'EAN13')
    expect(auto.text).toBe('5901234123457')
    expect(auto.bars).toEqual(encodeBarCode('5901234123457', 'EAN13').bars)
    expect(isValidBarCodeText('590123412345', 'EAN13')).toBe(true)
    expect(isValidBarCodeText('5901234123457', 'EAN13')).toBe(true)
  })

  it('错误校验位、长度或字符均视为非法', () => {
    expect(() => encodeBarCode('5901234123458', 'EAN13')).toThrow(/校验位/)
    expect(isValidBarCodeText('5901234123458', 'EAN13')).toBe(false)
    expect(isValidBarCodeText('12345', 'EAN13')).toBe(false)
    expect(isValidBarCodeText('59012341234A', 'EAN13')).toBe(false)
    expect(isValidBarCodeText('', 'EAN13')).toBe(false)
  })
})

describe('encodeBarCode / EAN8', () => {
  it('已知向量 96385074 的 bars 正确', () => {
    const { bars, text } = encodeBarCode('96385074', 'EAN8')
    expect(text).toBe('96385074')
    expectBars(bars, VECTORS.ean8)
    expect(countModules(bars)).toBe(67) // 3 + 4*7 + 5 + 4*7 + 3
  })

  it('7 位自动补校验位且 8 位校验已有校验位', () => {
    expect(getBarCodeCheckDigit('9638507', 'EAN8')).toBe('4')
    expect(getBarCodeCheckDigit('96385074', 'EAN8')).toBe('4')
    expect(encodeBarCode('9638507', 'EAN8').bars).toEqual(encodeBarCode('96385074', 'EAN8').bars)
    expect(encodeBarCode('9638507', 'EAN8').text).toBe('96385074')
    expect(isValidBarCodeText('9638507', 'EAN8')).toBe(true)
    expect(isValidBarCodeText('96385075', 'EAN8')).toBe(false)
    expect(isValidBarCodeText('963850', 'EAN8')).toBe(false)
  })
})

describe('encodeBarCode / UPC-A', () => {
  it('已知向量 036000291452 的 bars 正确', () => {
    const { bars, text } = encodeBarCode('036000291452', 'UPC-A')
    expect(text).toBe('036000291452')
    expectBars(bars, VECTORS.upca)
    expect(countModules(bars)).toBe(95)
  })

  it('bars 与前置 0 的 EAN13 完全一致，11 位自动补校验位', () => {
    expect(getBarCodeCheckDigit('03600029145', 'UPC-A')).toBe('2')
    expect(getBarCodeCheckDigit('036000291452', 'UPC-A')).toBe('2')
    expect(encodeBarCode('036000291452', 'UPC-A').bars).toEqual(encodeBarCode('0036000291452', 'EAN13').bars)
    const auto = encodeBarCode('03600029145', 'UPC-A')
    expect(auto.text).toBe('036000291452')
    expect(auto.bars).toEqual(VECTORS.upca)
    expect(isValidBarCodeText('03600029145', 'UPC-A')).toBe(true)
  })

  it('错误校验位或非法字符视为非法', () => {
    expect(() => encodeBarCode('036000291453', 'UPC-A')).toThrow(/校验位/)
    expect(isValidBarCodeText('036000291453', 'UPC-A')).toBe(false)
    expect(isValidBarCodeText('0360002914', 'UPC-A')).toBe(false)
    expect(isValidBarCodeText('0360002914A', 'UPC-A')).toBe(false)
  })
})

describe('encodeBarCode / CODE39', () => {
  it('已知向量 CODE39 的 bars 使用 * 起止符', () => {
    const { bars, text } = encodeBarCode('CODE39', 'CODE39')
    expect(text).toBe('CODE39')
    expectBars(bars, VECTORS.code39)
    expect(countModules(bars)).toBe(127)
    expect(encodeBarCode('*CODE39*', 'CODE39').bars).toEqual(bars)
  })

  it('mod43 校验字符与可选校验位', () => {
    expect(getBarCodeCheckDigit('CODE39', 'CODE39')).toBe('W') // (12+24+13+14+3+9) % 43 = 32 -> W
    const plain = encodeBarCode('CODE39', 'CODE39')
    const withCheck = encodeBarCode('CODE39', 'CODE39', { mod43: true })
    expect(withCheck.text).toBe('CODE39W')
    expect(withCheck.bars).not.toEqual(plain.bars)
    expect(isValidBarCodeText('CODE39', 'CODE39', { mod43: true })).toBe(true)
    expect(encodeBarCode('A 1-$/.+%Z', 'CODE39').bars.length % 2).toBe(1)
  })

  it('小写、非法字符与数据区 * 不合法', () => {
    expect(() => encodeBarCode('hello', 'CODE39')).toThrow(/CODE39/)
    expect(isValidBarCodeText('CODE*39', 'CODE39')).toBe(false)
    expect(isValidBarCodeText('AB!', 'CODE39')).toBe(false)
    expect(isValidBarCodeText('*', 'CODE39')).toBe(false)
    expect(isValidBarCodeText('', 'CODE39')).toBe(false)
  })
})

describe('getBarCodeCheckDigit', () => {
  it('各格式均返回单个校验字符', () => {
    expect(getBarCodeCheckDigit('590123412345', 'EAN13')).toMatch(/^\d$/)
    expect(getBarCodeCheckDigit('9638507', 'EAN8')).toBe('4')
    expect(getBarCodeCheckDigit('03600029145', 'UPC-A')).toBe('2')
    expect(getBarCodeCheckDigit('A', 'CODE128')).toBe('34')
    expect(() => getBarCodeCheckDigit('ABC', 'UNKNOWN' as any)).toThrow(/暂不支持/)
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

  it('支持的格式发出 valid(true) 且不发 error', async () => {
    const spy = vi.spyOn(uniApi, 'createCanvasContext')
    const wrapper = mountBar({ text: '5901234123457', format: 'EAN13' })
    await settle()
    expect(wrapper.emitted('valid')?.[0]).toEqual([true])
    expect(wrapper.emitted('error')).toBeUndefined()
    expect(spy).toHaveBeenCalled()
    expect(wrapper.find('.mq-bar-code__fallback').exists()).toBe(false)
    wrapper.unmount()
  })

  it('非法内容发出 valid(false) 和 error', async () => {
    const wrapper = mountBar({ text: '你好' })
    await settle()
    expect(wrapper.emitted('valid')?.[0]).toEqual([false])
    expect(wrapper.emitted('error')).toBeTruthy()
    expect(wrapper.find('.mq-bar-code__fallback').exists()).toBe(true)
    wrapper.unmount()

    const other = mountBar({ format: 'EAN13' }) // HELLO 不是 EAN13 合法输入
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
