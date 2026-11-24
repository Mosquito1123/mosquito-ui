/** 图片预览的全局状态。组件不传 props 时直接读它。 */
export interface MqImagePreviewState {
  visible: boolean
  /** 可用图片地址列表。 */
  urls: string[]
  /** 本次预览的起始索引，已收敛到合法范围。 */
  current: number
  /** 当前激活索引，轮播切换时同步。 */
  index: number
}

export interface MqImagePreviewOptions {
  /** 图片地址列表。空白项会被过滤；过滤后为空则忽略本次调用。 */
  urls: string[]
  /** 起始索引。非法值收敛为 0。 */
  current?: number
  /** 当前激活索引，优先于 `current`。非法值收敛为 0。 */
  index?: number
}

export type MqImagePreviewInput = string[] | MqImagePreviewOptions

/** 只关闭对应的那一次预览；预览已被替换时调用它不会关掉新的一次。 */
export type MqImagePreviewCloser = () => void

export interface MqImagePreviewProps {
  /** 图片地址列表。不传时读取 `imagePreviewState.urls`。 */
  urls?: string[]
  /** 起始索引。不传时读取全局状态的当前索引。 */
  current?: number
  /** 配合 `v-model` 控制显隐。与 `visible` 同时存在时优先。 */
  modelValue?: boolean
  /** 配合 `v-model:visible` 控制显隐。 */
  visible?: boolean
  /** 显示「当前 / 总数」文字。 */
  showIndex?: boolean
  /** 是否循环轮播。 */
  loop?: boolean
  /** 是否显示底部圆点。 */
  indicator?: boolean
  /** 点击遮罩是否关闭。 */
  maskClosable?: boolean
}

export interface MqImagePreviewEmits {
  'update:modelValue': [value: boolean]
  'update:visible': [value: boolean]
  /** 轮播切换时发出，索引已收敛。 */
  change: [payload: { index: number }]
  /** 关闭时发出。 */
  close: []
  /** 长按图片时发出，可据此保存到相册。 */
  longpress: [payload: { index: number; url: string }]
}
