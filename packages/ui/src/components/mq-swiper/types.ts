export interface MqSwiperItem {
  url?: string
  title?: string
  [key: string]: unknown
}

export type MqSwiperListItem = string | MqSwiperItem

export interface MqSwiperProps {
  /** 图片地址字符串，或 `{ url, title }` 对象。 */
  list?: MqSwiperListItem[]
  /** 当前下标，配合 `v-model`。 */
  modelValue?: number
  autoplay?: boolean
  /** 自动切换间隔（ms）。 */
  interval?: number
  /** 切换动画时长（ms）。 */
  duration?: number
  circular?: boolean
  /** 是否纵向轮播。 */
  vertical?: boolean
  /** 是否显示自绘指示点。 */
  indicator?: boolean
  indicatorColor?: string
  indicatorActiveColor?: string
  /** 高度，数字按 px 处理。 */
  height?: number | string
  /** 左侧露出宽度，数字按 px 处理。 */
  previousMargin?: number | string
  /** 右侧露出宽度，数字按 px 处理。 */
  nextMargin?: number | string
}

export interface MqSwiperChangePayload {
  index: number
  /** 原始列表元素：`list` 里传的是什么就回传什么。 */
  item: MqSwiperListItem | undefined
}

export interface MqSwiperTransitionPayload {
  dx: number
  dy: number
}

export interface MqSwiperEmits {
  (e: 'update:modelValue', index: number): void
  (e: 'change', payload: MqSwiperChangePayload): void
  (e: 'click', payload: MqSwiperChangePayload): void
  (e: 'transition', payload: MqSwiperTransitionPayload): void
}

export interface MqSwiperExpose {
  switchTo: (index: number) => void
}
