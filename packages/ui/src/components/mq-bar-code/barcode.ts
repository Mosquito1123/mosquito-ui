/**
 * 紧凑的一维条码编码器（不依赖第三方打包产物）。
 *
 * 支持 CODE128（自动选集 A/B/C）、EAN13、EAN8、UPC-A 与 CODE39。
 * 所有格式共用同一套「模块宽度」约定：bars 下标为偶数表示黑条，奇数表示白条，
 * 首尾均为黑条；需要补校验位时由编码器内部计算并写入 bars。
 */

export type BarCodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC-A' | 'CODE39'

export interface BarCodeOptions {
  /** CODE39 是否追加 mod43 校验字符。默认 `false`。 */
  mod43?: boolean
}

export interface BarCodeResult {
  /** 模块宽度序列：下标为偶数表示黑条，奇数表示白条。首尾必为黑条。 */
  bars: number[]
  /** 实际用于显示的文本（EAN/UPC 含校验位，CODE39 不含 `*` 起止符）。 */
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

function fromBits(bits: string, text: string): BarCodeResult {
  return { bars: toBars(bits), text }
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

function code128Values(text: string): number[] {
  if (!text) {
    throw new Error('条码内容不能为空')
  }
  const set = codeSetFor(text)
  const start = set === 'A' ? START_A : set === 'B' ? START_B : START_C
  return [start, ...valuesFor(text, set)]
}

function encodeCode128(text: string): BarCodeResult {
  const values = code128Values(text)
  const check = getCode128CheckDigit(values)
  const bits = [...values, check, STOP].map((index) => pattern(index)).join('') + '11'
  return fromBits(bits, text)
}

/* ------------------------------------------------------------------ *
 * EAN13 / EAN8 / UPC-A
 * ------------------------------------------------------------------ */

/** L 码（左奇编码，数字 0-9）。 */
const EAN_L = [
  '0001101',
  '0011001',
  '0010011',
  '0111101',
  '0100011',
  '0110001',
  '0101111',
  '0111011',
  '0110111',
  '0001011',
]

/** G 码（左偶编码，数字 0-9）。 */
const EAN_G = [
  '0100111',
  '0110011',
  '0011011',
  '0100001',
  '0011101',
  '0111001',
  '0000101',
  '0010001',
  '0001001',
  '0010111',
]

/** R 码（右侧编码，数字 0-9）。 */
const EAN_R = [
  '1110010',
  '1100110',
  '1101100',
  '1000010',
  '1011100',
  '1001110',
  '1010000',
  '1000100',
  '1001000',
  '1110100',
]

/** EAN13 首位数字决定的左侧六位奇偶规则。 */
const EAN13_PARITY = [
  'LLLLLL',
  'LLGLGG',
  'LLGGLG',
  'LLGGGL',
  'LGLLGG',
  'LGGLLG',
  'LGGGLL',
  'LGLGLG',
  'LGLGGL',
  'LGGLGL',
]

const EAN_START = '101'
const EAN_MIDDLE = '01010'

function isDigits(text: string, lengths: number[]): boolean {
  return lengths.includes(text.length) && Array.from(text).every((char) => char >= '0' && char <= '9')
}

/**
 * EAN13 / EAN8 / UPC-A 通用校验位：从最右侧数据位开始，权重按 3、1、3、1… 交替。
 * UPC-A 前置 0 后即为 EAN13，因此同一公式对三种格式都成立。
 */
function eanCheckDigit(prefix: string): number {
  let sum = 0
  let weight = 3
  for (let index = prefix.length - 1; index >= 0; index -= 1) {
    sum += Number(prefix[index]) * weight
    weight = weight === 3 ? 1 : 3
  }
  return (10 - (sum % 10)) % 10
}

/** 校验长度与数字字符，返回带校验位的完整码；13/8/12 位输入会校验已有校验位。 */
function normalizeEan(text: string, prefixLength: number, format: BarCodeFormat): string {
  if (!isDigits(text, [prefixLength, prefixLength + 1])) {
    throw new Error(`${format} 需要 ${prefixLength} 位（补校验位）或 ${prefixLength + 1} 位（含校验位）数字`)
  }
  const prefix = text.slice(0, prefixLength)
  const check = eanCheckDigit(prefix)
  if (text.length === prefixLength + 1 && Number(text[prefixLength]) !== check) {
    throw new Error(`${format} 校验位错误，应为 ${check}`)
  }
  return prefix + check
}

/** 仅供校验位 API 使用：不校验已有校验位，只取数字前缀。 */
function eanPrefix(text: string, prefixLength: number, format: BarCodeFormat): string {
  if (!isDigits(text, [prefixLength, prefixLength + 1])) {
    throw new Error(`${format} 需要 ${prefixLength} 位数字前缀`)
  }
  return text.slice(0, prefixLength)
}

function ean13Bits(code: string): string {
  const digits = Array.from(code, Number)
  const parity = EAN13_PARITY[digits[0]]
  let bits = EAN_START
  for (let index = 1; index <= 6; index += 1) {
    bits += (parity[index - 1] === 'L' ? EAN_L : EAN_G)[digits[index]]
  }
  bits += EAN_MIDDLE
  for (let index = 7; index <= 12; index += 1) {
    bits += EAN_R[digits[index]]
  }
  return bits + EAN_START
}

function ean8Bits(code: string): string {
  const digits = Array.from(code, Number)
  let bits = EAN_START
  for (let index = 0; index < 4; index += 1) {
    bits += EAN_L[digits[index]]
  }
  bits += EAN_MIDDLE
  for (let index = 4; index < 8; index += 1) {
    bits += EAN_R[digits[index]]
  }
  return bits + EAN_START
}

/* ------------------------------------------------------------------ *
 * CODE39
 * ------------------------------------------------------------------ */

/** 标准 CODE39 字符集；`*` 只作起止符，不参与数据。 */
const CODE39_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*'
const CODE39_START_INDEX = CODE39_CHARS.indexOf('*')

/**
 * 每个元素按「窄 1 模块 / 宽 3 模块」展开后的模块位串（1 黑 0 白）。
 * 数据符为 15 模块（5 条 4 空 + 3 个宽元素），`*` 为 16 模块（含尾部窄空，兼作分隔符）。
 */
const CODE39_PATTERNS = [
  '101000111011101',
  '111010001010111',
  '101110001010111',
  '111011100010101',
  '101000111010111',
  '111010001110101',
  '101110001110101',
  '101000101110111',
  '111010001011101',
  '101110001011101',
  '111010100010111',
  '101110100010111',
  '111011101000101',
  '101011100010111',
  '111010111000101',
  '101110111000101',
  '101010001110111',
  '111010100011101',
  '101110100011101',
  '101011100011101',
  '111010101000111',
  '101110101000111',
  '111011101010001',
  '101011101000111',
  '111010111010001',
  '101110111010001',
  '101010111000111',
  '111010101110001',
  '101110101110001',
  '101011101110001',
  '111000101010111',
  '100011101010111',
  '111000111010101',
  '100010111010111',
  '111000101110101',
  '100011101110101',
  '100010101110111',
  '111000101011101',
  '100011101011101',
  '100010001000101',
  '100010001010001',
  '100010100010001',
  '101000100010001',
  '1000101110111010',
]

function normalizeCode39(text: string): string {
  let body = text
  if (body.length >= 2 && body.startsWith('*') && body.endsWith('*')) {
    body = body.slice(1, -1)
  }
  if (!body || Array.from(body).some((char) => char === '*' || CODE39_CHARS.indexOf(char) < 0)) {
    throw new Error('CODE39 仅支持 0-9 A-Z - . $ / + % 与空格，* 只能作为起止符')
  }
  return body
}

function code39CheckDigit(body: string): string {
  const sum = Array.from(body).reduce((total, char) => total + CODE39_CHARS.indexOf(char), 0)
  return CODE39_CHARS[sum % 43]
}

/* ------------------------------------------------------------------ *
 * 公共 API
 * ------------------------------------------------------------------ */

/**
 * 编码条码。EAN13/EAN8/UPC-A 自动补校验位或校验已有校验位；CODE39 可选 mod43。
 * 非法输入抛出错误，组件层捕获后转为 `error` / `valid(false)` 事件。
 *
 * @param text 条码内容
 * @param format 条码格式，默认 `CODE128`
 * @param options 可选参数（目前仅 CODE39 的 `mod43`）
 */
export function encodeBarCode(
  text: string,
  format: BarCodeFormat = 'CODE128',
  options: BarCodeOptions = {},
): BarCodeResult {
  switch (format) {
    case 'CODE128':
      return encodeCode128(text)
    case 'EAN13': {
      const code = normalizeEan(text, 12, format)
      return fromBits(ean13Bits(code), code)
    }
    case 'EAN8': {
      const code = normalizeEan(text, 7, format)
      return fromBits(ean8Bits(code), code)
    }
    case 'UPC-A': {
      const code = normalizeEan(text, 11, format)
      return fromBits(ean13Bits(`0${code}`), code)
    }
    case 'CODE39': {
      const body = normalizeCode39(text)
      const data = options.mod43 ? body + code39CheckDigit(body) : body
      let bits = CODE39_PATTERNS[CODE39_START_INDEX]
      for (const char of data) {
        bits += CODE39_PATTERNS[CODE39_CHARS.indexOf(char)] + '0'
      }
      bits += CODE39_PATTERNS[CODE39_START_INDEX]
      return fromBits(bits.replace(/0+$/, ''), data)
    }
    default:
      throw new Error(`暂不支持条码格式 ${format as string}`)
  }
}

/** 校验输入是否可被当前编码器编码（不绘制）。 */
export function isValidBarCodeText(
  text: string,
  format: BarCodeFormat = 'CODE128',
  options: BarCodeOptions = {},
): boolean {
  try {
    encodeBarCode(text, format, options)
    return true
  } catch {
    return false
  }
}

/**
 * 计算校验位，返回单个字符（CODE128 返回十进制数值的字符串）。
 *
 * - EAN13：传 12 位前缀（或 13 位完整码），返回第 13 位
 * - EAN8：传 7 位前缀（或 8 位完整码），返回第 8 位
 * - UPC-A：传 11 位前缀（或 12 位完整码），返回第 12 位
 * - CODE39：传数据字符（可含 `*` 起止符），返回 mod43 校验字符
 * - CODE128：按自动选集规则计算起始符 + 数据符的校验值
 */
export function getBarCodeCheckDigit(text: string, format: BarCodeFormat = 'CODE128'): string {
  switch (format) {
    case 'EAN13':
      return String(eanCheckDigit(eanPrefix(text, 12, format)))
    case 'EAN8':
      return String(eanCheckDigit(eanPrefix(text, 7, format)))
    case 'UPC-A':
      return String(eanCheckDigit(eanPrefix(text, 11, format)))
    case 'CODE39':
      return code39CheckDigit(normalizeCode39(text))
    case 'CODE128':
      return String(getCode128CheckDigit(code128Values(text)))
    default:
      throw new Error(`暂不支持条码格式 ${format as string}`)
  }
}
