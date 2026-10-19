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
