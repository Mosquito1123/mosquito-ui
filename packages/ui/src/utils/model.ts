export type MqOptionValue = string | number | boolean

/** 组内多选。返回 undefined 表示这次点击被 min/max 拦住。max <= 0 表示不限制。 */
export function toggleCheckedValues(
  current: readonly MqOptionValue[],
  name: MqOptionValue,
  min = 0,
  max = 0,
): MqOptionValue[] | undefined {
  const floor = Number.isFinite(min) ? Math.max(0, min) : 0
  const selected = current.some((item) => item === name)
  if (selected) {
    if (current.length <= floor) {
      return undefined
    }
    return current.filter((item) => item !== name)
  }
  const ceiling = Number.isFinite(max) ? max : 0
  if (ceiling > 0 && current.length >= ceiling) {
    return undefined
  }
  return [...current, name]
}

export function nextRadioValue(
  current: MqOptionValue | undefined,
  value: MqOptionValue,
  allowUncheck: boolean,
): { value: MqOptionValue | undefined; changed: boolean } {
  if (current === value) {
    if (!allowUncheck) {
      return { value: current, changed: false }
    }
    return { value: undefined, changed: true }
  }
  return { value, changed: true }
}

export function nextSwitchValue<T extends MqOptionValue>(current: T, active: T, inactive: T): T {
  return current === active ? inactive : active
}

export function resolvePx(value: string | number | undefined, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }
  return fallback
}

export function clampPercent(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0
  }
  return Math.min(100, Math.max(0, Math.round(value)))
}

/** 把滑块值吸到步长上，并夹在 min/max 之间。步长非法时按 1。 */
export function snapSlider(value: number, min = 0, max = 100, step = 1): number {
  const lo = Number.isFinite(min) ? min : 0
  const hi = Number.isFinite(max) ? max : 100
  const floor = Math.min(lo, hi)
  const ceiling = Math.max(lo, hi)
  const stride = Number.isFinite(step) && step > 0 ? step : 1
  const raw = typeof value === 'number' && Number.isFinite(value) ? value : floor
  const clamped = Math.min(ceiling, Math.max(floor, raw))
  const steps = Math.round((clamped - floor) / stride)
  const snapped = floor + steps * stride
  const places = decimalPlaces(stride)
  const fixed = Number(snapped.toFixed(Math.min(places + 2, 8)))
  return Math.min(ceiling, Math.max(floor, fixed))
}

function decimalPlaces(value: number): number {
  const text = String(value)
  const dot = text.indexOf('.')
  return dot === -1 ? 0 : text.length - dot - 1
}

/**
 * 评分下一次的值。index 从 1 起。half 表示点在这颗星的左半边。
 * clearable 时再点当前值会回到 0。
 */
export function nextRateValue(
  current: number,
  index: number,
  half: boolean,
  clearable: boolean,
  max = 5,
): number {
  const ceiling = Number.isFinite(max) && max > 0 ? Math.floor(max) : 5
  const star = Math.min(ceiling, Math.max(1, Math.floor(index)))
  const next = half ? star - 0.5 : star
  const safe = typeof current === 'number' && Number.isFinite(current) ? current : 0
  if (clearable && safe === next) {
    return 0
  }
  return next
}

/** 折叠面板的下一次展开值。手风琴返回字符串，多选返回数组。 */
export function nextCollapseValue(
  current: string | readonly string[] | undefined,
  name: string,
  accordion: boolean,
): string | string[] {
  if (accordion) {
    return current === name ? '' : name
  }
  const list = Array.isArray(current) ? [...current] : []
  const index = list.indexOf(name)
  if (index >= 0) {
    list.splice(index, 1)
    return list
  }
  list.push(name)
  return list
}

/** 计数器把值夹到区间，并按精度取整。stepStrictly 时再吸到步长。 */
export function snapNumber(
  value: number,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  precision = 0,
  stepStrictly = false,
): number {
  const lo = Number.isFinite(min) ? min : 0
  const hi = Number.isFinite(max) ? max : Number.MAX_SAFE_INTEGER
  const floor = Math.min(lo, hi)
  const ceiling = Math.max(lo, hi)
  const places = Number.isFinite(precision) && precision >= 0 ? Math.floor(precision) : 0
  let next = typeof value === 'number' && Number.isFinite(value) ? value : floor
  next = Math.min(ceiling, Math.max(floor, next))
  if (stepStrictly) {
    next = snapSlider(next, floor, ceiling, step)
  }
  return Number(next.toFixed(places))
}

export interface MqTimeData {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export function parseTimeData(remain: number): MqTimeData {
  const total = typeof remain === 'number' && Number.isFinite(remain) ? Math.max(0, Math.floor(remain)) : 0
  const days = Math.floor(total / 86_400_000)
  const hours = Math.floor((total % 86_400_000) / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1000)
  const milliseconds = total % 1000
  return { total, days, hours, minutes, seconds, milliseconds }
}

/** 把剩余毫秒格式化。支持 DD HH mm ss S SS SSS。 */
export function formatCountDown(remain: number, format = 'HH:mm:ss'): string {
  const current = parseTimeData(remain)
  const pad = (value: number, width: number) => String(value).padStart(width, '0')
  return format
    .replace(/DD/g, pad(current.days, 2))
    .replace(/HH/g, pad(current.hours, 2))
    .replace(/mm/g, pad(current.minutes, 2))
    .replace(/ss/g, pad(current.seconds, 2))
    .replace(/SSS/g, pad(current.milliseconds, 3))
    .replace(/SS/g, pad(Math.floor(current.milliseconds / 10), 2))
    .replace(/S/g, String(Math.floor(current.milliseconds / 100)))
}

export function formatBadge(
  value: string | number | null | undefined,
  options: { max?: number; showZero?: boolean; dot?: boolean } = {},
): string | null {
  if (options.dot) {
    return ''
  }
  if (value == null) {
    return null
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return null
    }
    if (value === 0 && !options.showZero) {
      return null
    }
    const max = options.max
    if (typeof max === 'number' && Number.isFinite(max) && max >= 0 && value > max) {
      return `${max}+`
    }
    return String(value)
  }
  const text = value.trim()
  return text ? text : null
}

/** 总页数。total / pageSize 非法或非正时按 1 页。 */
export function pageCount(total = 0, pageSize = 10): number {
  const size = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 10
  const all = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0
  return Math.max(1, Math.ceil(all / size) || 1)
}

/** 把页码夹到 [1, pages]。 */
export function clampPage(page: number, pages = 1): number {
  const ceiling = Number.isFinite(pages) && pages > 0 ? Math.floor(pages) : 1
  const current = typeof page === 'number' && Number.isFinite(page) ? Math.floor(page) : 1
  return Math.min(ceiling, Math.max(1, current))
}

export function formatPrice(value: string | number | null | undefined): string {
  if (value == null || value === '') {
    return ''
  }
  const raw = typeof value === 'number' ? value : Number.parseFloat(String(value).replace(/,/g, ''))
  if (!Number.isFinite(raw)) {
    return String(value)
  }
  const fixed = raw.toFixed(2)
  const [integer, decimal] = fixed.split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${grouped}.${decimal}`
}

export function formatPhone(value: string | number | null | undefined): string {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (digits.length < 7) {
    return String(value ?? '')
  }
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}****${digits.slice(7)}`
  }
  return `${digits.slice(0, 3)}****${digits.slice(-4)}`
}

export function formatName(value: string | number | null | undefined): string {
  const text = String(value ?? '').trim()
  if (!text) {
    return ''
  }
  if (text.length === 1) {
    return '*'
  }
  if (text.length === 2) {
    return `${text[0]}*`
  }
  return `${text[0]}${'*'.repeat(text.length - 2)}${text[text.length - 1]}`
}

export function formatDisplayText(
  value: string | number | null | undefined,
  options: {
    mode?: 'text' | 'price' | 'phone' | 'name'
    prefix?: string
    suffix?: string
  } = {},
): string {
  const mode = options.mode || 'text'
  let body = ''
  if (mode === 'price') {
    body = formatPrice(value)
  } else if (mode === 'phone') {
    body = formatPhone(value)
  } else if (mode === 'name') {
    body = formatName(value)
  } else if (value == null) {
    body = ''
  } else {
    body = String(value)
  }
  return `${options.prefix || ''}${body}${options.suffix || ''}`
}
