/**
 * 紧凑的 CODE128 编码器（不依赖第三方打包产物）。
 *
 * CODE128 的 107 个条码符号图案是标准码表（三个启动符 + 103 个数据符 + 停止符），
 * 下表按符号索引存放 11 位二进制条空序列；停止符为 13 位，末尾补 2 位终止黑条。
 */

export type BarCodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC-A' | 'CODE39'

export interface BarCodeResult {
  /** 模块宽度序列：下标为偶数表示黑条，奇数表示白条。首尾必为黑条。 */
  bars: number[]
  /** 实际用于显示的文本。 */
  text: string
}

/** 每个符号 11 个模块（停止符 13 个模块），共 107 个符号。 */
const CODE128_BARS = `
11011001100 11001101100 11001100110 10010011000 10010001100 10001001100 10011001000 10011000100 10001100100 11001001000 11001000100
11000100100 10110011100 10011011100 10011001110 10111001100 10011101100 10011100110 11001110010 11001011100 11001001110 11011100100
11001110100 11101101110 11101001100 11100101100 11100100110 11101100100 11100110100 11100110010 11011011000 11011000110 11000110110
10100011000 10001011000 10001000110 10110001000 10001101000 10001100010 11010001000 11000101000 11000100010 10110111000 10110001110
10001101110 10111011000 10111000110 10001110110 11101110110 11010001110 11000101110 11011101000 11011100010 11011101110 11101011000
11101000110 11100010110 11101101000 11101100010 11100011010 11101111010 11001000010 11110001010 10100110000 10100001100 10010110000
10010000110 10000101100 10000100110 10110010000 10110000100 10011010000 10011000010 10000110100 10000110010 11000010010 11001010000
11110111010 11000010100 10001111010 10100111100 10010111100 10010011110 10111100100 10011110100 10011110010 11110100100 11110010100
11110010010 11011011110 11011110110 11110110110 10101111000 10100011110 10001011110 10111101000 10111100010 11110101000 11110100010
10111011110 10111101110 11101011110 11110101110 11010000100 11010010000 11010011100 1100011101011
`
  .trim()
  .split(/\s+/)

const START_A = 103
const START_B = 104
const START_C = 105
const STOP = 106
const MODULO = 103

type CodeSet = 'A' | 'B' | 'C'

function pattern(index: number): string {
  return CODE128_BARS[index] ?? ''
}

/** 把连续相同位合并为「黑条 / 白条」宽度序列，奇数位为黑条。 */
function toBars(bits: string): number[] {
  const bars: number[] = []
  let cursor = 0
  let previous = bits[0]
  while (cursor < bits.length) {
    let width = 0
    while (cursor < bits.length && bits[cursor] === previous) {
      cursor += 1
      width += 1
    }
    bars.push(width)
    previous = bits[cursor]
  }
  return bars
}

/** CODE128 校验位：起始符权重为 1，之后第 n 个数据符权重为 n。 */
export function getCode128CheckDigit(values: number[]): number {
  let sum = 0
  values.forEach((value, index) => {
    sum += index === 0 ? value : value * index
  })
  return sum % MODULO
}

function codeSetFor(text: string): CodeSet {
  const codes = Array.from(text, (char) => char.charCodeAt(0))
  if (codes.length >= 2 && codes.every((code) => code >= 48 && code <= 57) && codes.length % 2 === 0) {
    return 'C'
  }
  if (codes.every((code) => code >= 32 && code <= 126)) {
    return 'B'
  }
  if (codes.every((code) => code >= 0 && code <= 95)) {
    return 'A'
  }
  throw new Error('CODE128 仅支持 ASCII 0-126；CODE128B 覆盖可打印字符 ASCII 32-126')
}

function valuesFor(text: string, set: CodeSet): number[] {
  const values: number[] = []
  if (set === 'C') {
    for (let index = 0; index < text.length; index += 2) {
      values.push((text.charCodeAt(index) - 48) * 10 + (text.charCodeAt(index + 1) - 48))
    }
  } else {
    for (const char of text) {
      const code = char.charCodeAt(0)
      values.push(set === 'A' ? (code < 32 ? code + 64 : code - 32) : code - 32)
    }
  }
  return values
}

/**
 * 编码条码。目前支持 CODE128（自动在 A/B/C 子集间选择），其他格式给出明确错误。
 *
 * @param text 条码内容
 * @param format 条码格式，默认 `CODE128`
 */
export function encodeBarCode(text: string, format: BarCodeFormat = 'CODE128'): BarCodeResult {
  if (format !== 'CODE128') {
    throw new Error(`暂不支持条码格式 ${format}，当前仅支持 CODE128`)
  }
  if (!text) {
    throw new Error('条码内容不能为空')
  }

  const set = codeSetFor(text)
  const start = set === 'A' ? START_A : set === 'B' ? START_B : START_C
  const values = [start, ...valuesFor(text, set)]
  const check = getCode128CheckDigit(values)
  const bits = [...values, check, STOP].map((index) => pattern(index)).join('') + '11'
  const bars = toBars(bits)

  return { bars, text }
}

/** 校验输入是否可被当前编码器编码（不绘制）。 */
export function isValidBarCodeText(text: string, format: BarCodeFormat = 'CODE128'): boolean {
  try {
    encodeBarCode(text, format)
    return true
  } catch {
    return false
  }
}
