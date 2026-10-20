import type { MqWaterfallHeight } from '../../utils/waterfall'

export interface MqWaterfallProps<T = unknown> {
  data?: T[]
  /** 列数，1~6。 */
  column?: number
  /** 列间距与行间距，数字按 px 处理。 */
  gap?: number | string
  /** 可选的单项高度估算，用于把内容分到较短的列。 */
  estimateHeight?: MqWaterfallHeight<T>
}

export interface MqWaterfallClickPayload<T = unknown> {
  item: T
  index: number
  column: number
}

export interface MqWaterfallEmits<T = unknown> {
  (e: 'click', payload: MqWaterfallClickPayload<T>): void
}
