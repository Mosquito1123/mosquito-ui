export interface MqBannerItem {
  image?: string
  title?: string
  url?: string
  [key: string]: unknown
}

export interface MqBannerProps {
  data?: MqBannerItem[]
  /** 当前下标，配合 `v-model`。 */
  modelValue?: number
  /** 高度，数字按 px 处理。 */
  height?: number | string
  autoplay?: boolean
  /** 自动切换间隔（ms）。 */
  interval?: number
  /** 切换动画时长（ms）。 */
  duration?: number
  circular?: boolean
  indicator?: boolean
  indicatorColor?: string
  activeIndicatorColor?: string
  /** 圆角，数字按 px 处理。 */
  radius?: number | string
  /** 是否在图片上叠加标题。 */
  showTitle?: boolean
}

export interface MqBannerChangePayload {
  index: number
  item: MqBannerItem | undefined
}

export interface MqBannerEmits {
  (e: 'update:modelValue', index: number): void
  (e: 'change', payload: MqBannerChangePayload): void
  (e: 'click', payload: MqBannerChangePayload): void
}

export interface MqBannerExpose {
  /** 切换到指定下标。 */
  switchTo: (index: number) => void
}
