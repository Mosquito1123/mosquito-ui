export type MqCalendarViewType = 'date' | 'daterange' | 'datetime' | 'datetimerange'

export interface MqCalendarViewChangePayload {
  value: string | string[]
}

export interface MqCalendarViewProps {
  /** 日期字符串，区间用长度为 2 的数组。带时间的类型接受 `YYYY-MM-DD HH:mm:ss`。 */
  modelValue?: string | string[] | null
  /** 初始展示的月份，未传时取选中日期或今天。 */
  month?: string
  type?: MqCalendarViewType
  minDate?: string
  maxDate?: string
  disabledDate?: (date: string) => boolean
  /** 区间最多可选天数（含首尾）。 */
  maxRange?: number
  /** 是否允许区间起止为同一天。 */
  allowSameDay?: boolean
  showPanelTitle?: boolean
  /** 带时间的类型所使用的日内时刻，字符串或 `[开始, 结束]`。 */
  defaultTime?: string | string[]
  /** 滚动面板高度，像素。 */
  panelHeight?: number
  firstDayOfWeek?: 0 | 1
}

export interface MqCalendarViewEmits {
  'update:modelValue': [value: string | string[]]
  change: [payload: MqCalendarViewChangePayload]
}

export interface MqCalendarViewExpose {
  scrollIntoView: () => void
}
