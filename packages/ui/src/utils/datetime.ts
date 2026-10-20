/** 日期时间选择器的纯计算。日期类型对外用时间戳，`time` 类型对外用 `HH:mm(:ss)`。 */

import { daysInMonth, formatDate, pad2 } from './date'
import type { MqPickerOption } from './picker'

export type MqDatetimeType = 'datetime' | 'date' | 'year-month' | 'year' | 'time'

export type MqDatetimeColumnType = 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second'

export interface MqDatetimeFormatter {
  (type: MqDatetimeColumnType, value: number): string
}

export interface MqDatetimeOptions {
  type?: MqDatetimeType
  /** 最小日期（时间戳）。默认当前年份前 10 年 1 月 1 日。 */
  minDate?: number
  /** 最大日期（时间戳）。默认当前年份后 10 年 12 月 31 日 23:59:59。 */
  maxDate?: number
  minHour?: number
  maxHour?: number
  minMinute?: number
  maxMinute?: number
  useSecond?: boolean
  minSecond?: number
  maxSecond?: number
  formatter?: MqDatetimeFormatter
}

export interface MqDatetimeParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

const DEFAULT_LABELS: Record<MqDatetimeColumnType, string> = {
  year: '年',
  month: '月',
  date: '日',
  hour: '时',
  minute: '分',
  second: '秒',
}

export function datetimeHasTime(type: MqDatetimeType = 'datetime'): boolean {
  return type === 'datetime' || type === 'time'
}

export function datetimeHasDate(type: MqDatetimeType = 'datetime'): boolean {
  return type !== 'time'
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function defaultMinDate(now: Date = new Date()): number {
  return new Date(now.getFullYear() - 10, 0, 1, 0, 0, 0, 0).getTime()
}

export function defaultMaxDate(now: Date = new Date()): number {
  return new Date(now.getFullYear() + 10, 11, 31, 23, 59, 59, 0).getTime()
}

function parseTimeString(input: string): MqDatetimeParts | null {
  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(input.trim())
  if (!match) {
    return null
  }
  const hour = Number(match[1])
  const minute = Number(match[2])
  const second = match[3] ? Number(match[3]) : 0
  if (hour > 23 || minute > 59 || second > 59) {
    return null
  }
  return { year: 1970, month: 1, day: 1, hour, minute, second }
}

function parseDateString(input: string): MqDatetimeParts | null {
  const match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/.exec(
    input.trim(),
  )
  if (!match) {
    return null
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = match[4] ? Number(match[4]) : 0
  const minute = match[5] ? Number(match[5]) : 0
  const second = match[6] ? Number(match[6]) : 0
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month) ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return null
  }
  return { year, month, day, hour, minute, second }
}

/** 把外部值拆成日期时间各部分。无法解析时回落到当前时间。 */
export function parseDatetime(
  value: string | number | null | undefined,
  options: MqDatetimeOptions = {},
): MqDatetimeParts {
  const type = options.type ?? 'datetime'
  if (typeof value === 'string' && value.trim()) {
    const parsed = type === 'time' ? parseTimeString(value) : parseDateString(value)
    if (parsed) {
      return parsed
    }
  }
  const date = typeof value === 'number' && Number.isFinite(value) ? new Date(value) : new Date()
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  }
}

export function datetimePartsToTimestamp(parts: MqDatetimeParts): number {
  return new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  ).getTime()
}

/** 把时间戳夹到 min/max 之间。 */
export function clampTimestamp(value: number, min?: number, max?: number): number {
  const time = Number.isFinite(value) ? value : Date.now()
  const floor = min !== undefined && Number.isFinite(min) ? min : defaultMinDate()
  const ceiling = max !== undefined && Number.isFinite(max) ? max : defaultMaxDate()
  return Math.min(Math.max(time, Math.min(floor, ceiling)), Math.max(floor, ceiling))
}

/** 校正外部值，返回该类型对外的规范值。 */
export function correctDatetime(
  value: string | number | null | undefined,
  options: MqDatetimeOptions = {},
): number | string {
  const type = options.type ?? 'datetime'
  const parts = parseDatetime(value, options)
  if (type === 'time') {
    const hour = clampNumber(parts.hour, options.minHour ?? 0, options.maxHour ?? 23)
    const minute = clampNumber(parts.minute, options.minMinute ?? 0, options.maxMinute ?? 59)
    const second = clampNumber(parts.second, options.minSecond ?? 0, options.maxSecond ?? 59)
    return options.useSecond
      ? `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
      : `${pad2(hour)}:${pad2(minute)}`
  }
  return clampTimestamp(datetimePartsToTimestamp(parts), options.minDate, options.maxDate)
}

function labelFor(type: MqDatetimeColumnType, value: number, formatter?: MqDatetimeFormatter): string {
  if (formatter) {
    return formatter(type, value)
  }
  return `${type === 'year' ? String(value) : pad2(value)}${DEFAULT_LABELS[type]}`
}

function toOptions(
  type: MqDatetimeColumnType,
  values: number[],
  formatter?: MqDatetimeFormatter,
): MqPickerOption[] {
  return values.map((value) => ({ value, label: labelFor(type, value, formatter) }))
}

function range(from: number, to: number): number[] {
  const values: number[] = []
  for (let value = from; value <= to; value += 1) {
    values.push(value)
  }
  return values
}

/** 根据当前选中时间生成各列选项。 */
export function buildDatetimeColumns(
  parts: MqDatetimeParts,
  options: MqDatetimeOptions = {},
): MqPickerOption[][] {
  const type = options.type ?? 'datetime'
  const minDate = new Date(
    options.minDate !== undefined ? options.minDate : defaultMinDate(),
  )
  const maxDate = new Date(
    options.maxDate !== undefined ? options.maxDate : defaultMaxDate(),
  )
  const columns: MqPickerOption[][] = []

  if (type === 'time') {
    const hours = range(options.minHour ?? 0, options.maxHour ?? 23)
    const minutes = range(options.minMinute ?? 0, options.maxMinute ?? 59)
    columns.push(toOptions('hour', hours, options.formatter))
    columns.push(toOptions('minute', minutes, options.formatter))
    if (options.useSecond) {
      const seconds = range(options.minSecond ?? 0, options.maxSecond ?? 59)
      columns.push(toOptions('second', seconds, options.formatter))
    }
    return columns
  }

  const minYear = minDate.getFullYear()
  const maxYear = maxDate.getFullYear()
  const years = range(minYear, maxYear)
  columns.push(toOptions('year', years, options.formatter))

  if (type !== 'year') {
    const monthFrom = parts.year === minYear ? minDate.getMonth() + 1 : 1
    const monthTo = parts.year === maxYear ? maxDate.getMonth() + 1 : 12
    columns.push(toOptions('month', range(monthFrom, monthTo), options.formatter))
  }

  if (type === 'date' || type === 'datetime') {
    const total = daysInMonth(parts.year, parts.month)
    let dayFrom = 1
    let dayTo = total
    if (parts.year === minYear && parts.month === minDate.getMonth() + 1) {
      dayFrom = minDate.getDate()
    }
    if (parts.year === maxYear && parts.month === maxDate.getMonth() + 1) {
      dayTo = maxDate.getDate()
    }
    columns.push(toOptions('date', range(dayFrom, dayTo), options.formatter))
  }

  if (datetimeHasTime(type)) {
    columns.push(toOptions('hour', range(0, 23), options.formatter))
    columns.push(toOptions('minute', range(0, 59), options.formatter))
    if (options.useSecond) {
      columns.push(toOptions('second', range(0, 59), options.formatter))
    }
  }

  return columns
}

function selectedValues(
  parts: MqDatetimeParts,
  type: MqDatetimeType,
  useSecond = false,
): number[] {
  if (type === 'time') {
    return useSecond ? [parts.hour, parts.minute, parts.second] : [parts.hour, parts.minute]
  }
  if (type === 'year') {
    return [parts.year]
  }
  if (type === 'year-month') {
    return [parts.year, parts.month]
  }
  if (type === 'date') {
    return [parts.year, parts.month, parts.day]
  }
  return useSecond
    ? [parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second]
    : [parts.year, parts.month, parts.day, parts.hour, parts.minute]
}

/** 当前值在各列中的下标。 */
export function datetimeIndexes(
  parts: MqDatetimeParts,
  columns: MqPickerOption[][],
  options: MqDatetimeOptions = {},
): number[] {
  const type = options.type ?? 'datetime'
  const values = selectedValues(parts, type, options.useSecond)
  return columns.map((column, index) => {
    const target = values[index]
    const found = column.findIndex((option) => Number(option.value) === target)
    return found >= 0 ? found : 0
  })
}

/** 由下标还原对外值。 */
export function datetimeFromIndexes(
  indexes: readonly number[],
  columns: MqPickerOption[][],
  options: MqDatetimeOptions = {},
): number | string {
  const type = options.type ?? 'datetime'
  const picked = columns.map((column, index) => {
    const option = column[indexes[index] ?? 0]
    return Number(option?.value ?? 0)
  })

  if (type === 'time') {
    const hour = clampNumber(picked[0] ?? 0, options.minHour ?? 0, options.maxHour ?? 23)
    const minute = clampNumber(picked[1] ?? 0, options.minMinute ?? 0, options.maxMinute ?? 59)
    const second = clampNumber(picked[2] ?? 0, options.minSecond ?? 0, options.maxSecond ?? 59)
    return options.useSecond
      ? `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
      : `${pad2(hour)}:${pad2(minute)}`
  }

  const parts: MqDatetimeParts = {
    year: picked[0] ?? new Date().getFullYear(),
    month: type === 'year' ? 1 : picked[1] ?? 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
  }
  if (type === 'date' || type === 'datetime') {
    parts.day = picked[2] ?? 1
  }
  if (datetimeHasTime(type)) {
    const offset = type === 'datetime' ? 3 : 0
    parts.hour = picked[offset] ?? 0
    parts.minute = picked[offset + 1] ?? 0
    parts.second = options.useSecond ? picked[offset + 2] ?? 0 : 0
  }
  return clampTimestamp(datetimePartsToTimestamp(parts), options.minDate, options.maxDate)
}

/** 展示用的默认文案。 */
export function formatDatetime(
  value: string | number | null | undefined,
  options: MqDatetimeOptions = {},
): string {
  const type = options.type ?? 'datetime'
  const parts = parseDatetime(value, options)
  if (type === 'time') {
    const time =
      options.useSecond
        ? `${pad2(parts.hour)}:${pad2(parts.minute)}:${pad2(parts.second)}`
        : `${pad2(parts.hour)}:${pad2(parts.minute)}`
    return time
  }
  const date = formatDate(parts.year, parts.month, parts.day)
  if (type === 'year') {
    return `${parts.year}年`
  }
  if (type === 'year-month') {
    return `${parts.year}年${pad2(parts.month)}月`
  }
  if (type === 'date') {
    return date
  }
  const time = options.useSecond
    ? `${pad2(parts.hour)}:${pad2(parts.minute)}:${pad2(parts.second)}`
    : `${pad2(parts.hour)}:${pad2(parts.minute)}`
  return `${date} ${time}`
}
