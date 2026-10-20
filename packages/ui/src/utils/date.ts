/** 日历用到的纯日期计算。日期统一写成 `YYYY-MM-DD`，字符串比较即时间比较。 */

export interface MqDateParts {
  year: number
  month: number
  day: number
}

export type MqCalendarMode = 'single' | 'range' | 'multiple'

export interface MqCalendarCell {
  /** `YYYY-MM-DD` */
  date: string
  day: number
  currentMonth: boolean
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

export function daysInMonth(year: number, month: number): number {
  const y = Number.isFinite(year) ? Math.floor(year) : 1970
  const m = Number.isFinite(month) ? Math.floor(month) : 1
  return new Date(y, m, 0).getDate()
}

export function formatDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${pad2(month)}-${pad2(day)}`
}

export function parseDate(input: string | null | undefined): MqDateParts | null {
  if (!input) {
    return null
  }
  const match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(String(input).trim())
  if (!match) {
    return null
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return null
  }
  return { year, month, day }
}

/** 把任意日期值收成 `YYYY-MM-DD`。解析失败时返回空串。 */
export function normalizeDate(input: string | null | undefined): string {
  const parts = parseDate(input)
  return parts ? formatDate(parts.year, parts.month, parts.day) : ''
}

export function todayString(now: Date = new Date()): string {
  return formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

export function weekdayOf(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getDay()
}

/** 月份偏移，自动处理跨年。 */
export function addMonths(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const base = year * 12 + (month - 1) + (Number.isFinite(delta) ? Math.trunc(delta) : 0)
  const nextYear = Math.floor(base / 12)
  const nextMonth = (base % 12 + 12) % 12 + 1
  return { year: nextYear, month: nextMonth }
}

/** 返回 -1 / 0 / 1。非法日期按空串处理，空串排在所有日期前面。 */
export function compareDate(a: string, b: string): number {
  const left = normalizeDate(a)
  const right = normalizeDate(b)
  if (left === right) {
    return 0
  }
  return left < right ? -1 : 1
}

export function isDateBetween(date: string, min?: string, max?: string): boolean {
  const target = normalizeDate(date)
  if (!target) {
    return false
  }
  const floor = min ? normalizeDate(min) : ''
  const ceiling = max ? normalizeDate(max) : ''
  if (floor && target < floor) {
    return false
  }
  if (ceiling && target > ceiling) {
    return false
  }
  return true
}

/** 固定 42 格，前后补上相邻月份的日期，让六行高度稳定。 */
export function buildCalendarDays(
  year: number,
  month: number,
  firstDayOfWeek: 0 | 1 = 0,
): MqCalendarCell[] {
  const lead = (weekdayOf(year, month, 1) - firstDayOfWeek + 7) % 7
  const total = daysInMonth(year, month)
  const previous = addMonths(year, month, -1)
  const previousTotal = daysInMonth(previous.year, previous.month)
  const cells: MqCalendarCell[] = []

  for (let offset = lead - 1; offset >= 0; offset -= 1) {
    const day = previousTotal - offset
    cells.push({
      date: formatDate(previous.year, previous.month, day),
      day,
      currentMonth: false,
    })
  }

  for (let day = 1; day <= total; day += 1) {
    cells.push({ date: formatDate(year, month, day), day, currentMonth: true })
  }

  const next = addMonths(year, month, 1)
  let nextDay = 1
  while (cells.length < 42) {
    cells.push({
      date: formatDate(next.year, next.month, nextDay),
      day: nextDay,
      currentMonth: false,
    })
    nextDay += 1
  }

  return cells
}

/** 把外部值收成日期数组。单选用长度为 0 或 1 的数组表示。 */
export function normalizeDateList(
  value: string | readonly string[] | null | undefined,
): string[] {
  const list = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
  const unique: string[] = []
  for (const item of list) {
    const date = normalizeDate(item)
    if (date && !unique.includes(date)) {
      unique.push(date)
    }
  }
  return unique
}

/**
 * 日历点击后的下一次选中值。
 * - single：替换
 * - multiple：切换
 * - range：第一次记起点，第二次按先后顺序补成区间，第三次重新开始
 */
export function nextDateSelection(
  current: readonly string[],
  date: string,
  mode: MqCalendarMode,
): string[] {
  const target = normalizeDate(date)
  if (!target) {
    return [...current]
  }
  const list = normalizeDateList(current)

  if (mode === 'single') {
    return [target]
  }

  if (mode === 'multiple') {
    return list.includes(target)
      ? list.filter((item) => item !== target)
      : [...list, target].sort()
  }

  if (list.length === 0 || list.length >= 2) {
    return [target]
  }

  const start = list[0]
  return compareDate(target, start) < 0 ? [target, start] : [start, target]
}

/** 把选中值格式化给日历底部看。 */
export function formatDateSummary(
  value: readonly string[],
  mode: MqCalendarMode,
  placeholder = '请选择日期',
): string {
  if (mode === 'multiple') {
    return value.length ? `已选 ${value.length} 天` : placeholder
  }
  if (mode === 'range') {
    if (!value.length) {
      return placeholder
    }
    return value.length > 1 ? `${value[0]} ~ ${value[1]}` : `${value[0]} ~ 结束`
  }
  return value[0] || placeholder
}
