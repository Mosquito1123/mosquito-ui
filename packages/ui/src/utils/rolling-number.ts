/** 滚动数字的字符拆分与格式化。 */

export interface MqRollingChar {
  char: string
  /** 是否是可滚动的 0-9 数字。 */
  digit: boolean
}

/** 千分位 + 固定小数位，保留负号。 */
export function formatRollingNumber(
  value: number,
  decimals = 0,
  separator = ',',
): string {
  const number = Number.isFinite(value) ? value : 0
  const places = Math.min(6, Math.max(0, Math.floor(Number(decimals)) || 0))
  const fixed = Math.abs(number).toFixed(places)
  const [integer, fraction] = fixed.split('.')
  const grouped = separator
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : integer
  const sign = number < 0 ? '-' : ''
  return fraction ? `${sign}${grouped}.${fraction}` : `${sign}${grouped}`
}

/** 把格式化结果拆成数字与静态字符，交给数字列渲染。 */
export function toRollingChars(text: string): MqRollingChar[] {
  return String(text)
    .split('')
    .map((char) => ({ char, digit: /\d/.test(char) }))
}
