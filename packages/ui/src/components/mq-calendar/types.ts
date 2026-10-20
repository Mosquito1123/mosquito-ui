import type { MqCalendarMode } from '../../utils/date'

export type { MqCalendarMode }

export interface MqCalendarValuePayload {
  value: string | string[]
  mode: MqCalendarMode
}

export interface MqCalendarProps {
  /** 单选为日期字符串，区间和多选为日期数组。格式 `YYYY-MM-DD`。 */
  modelValue?: string | string[]
  mode?: MqCalendarMode
  /** 可选最小日期。 */
  minDate?: string
  /** 可选最大日期。 */
  maxDate?: string
  /** 一周从周日还是周一开始。 */
  firstDayOfWeek?: 0 | 1
  /** 是否显示底部确定按钮。 */
  showConfirm?: boolean
  showClear?: boolean
  confirmText?: string
  clearText?: string
  /** 额外禁用某些日期。 */
  disabledDate?: (date: string) => boolean
  /** 初始展示月份，`YYYY-MM` 或 `YYYY-MM-DD`。 */
  month?: string
}

export interface MqCalendarEmits {
  'update:modelValue': [value: string | string[]]
  change: [payload: MqCalendarValuePayload]
  confirm: [payload: MqCalendarValuePayload]
  monthChange: [payload: { year: number; month: number }]
}
