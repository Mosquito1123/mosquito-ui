/** 视频预览的全局状态。组件不传 props 时直接读它。 */
export interface MqVideoPreviewState {
  visible: boolean
  src: string
  title: string
  poster: string
}

export interface MqVideoPreviewOptions {
  /** 视频地址。空白字符串会被忽略。 */
  src: string
  title?: string
  poster?: string
}

export type MqVideoPreviewInput = string | MqVideoPreviewOptions

/** 只关闭对应的那一次预览；预览已被替换时调用它不会关掉新的一次。 */
export type MqVideoPreviewCloser = () => void

export interface MqVideoPreviewProps {
  /** 视频地址。不传时读取 `videoPreviewState.src`。 */
  src?: string
  /** 标题。不传时读取全局状态。 */
  title?: string
  /** 封面图。不传时读取全局状态。 */
  poster?: string
  /** 配合 `v-model` 控制显隐。与 `visible` 同时存在时优先。 */
  modelValue?: boolean
  /** 配合 `v-model:visible` 控制显隐。 */
  visible?: boolean
  /** 是否自动播放。 */
  autoplay?: boolean
  /** 是否显示关闭按钮。 */
  showClose?: boolean
}

export interface MqVideoPreviewEmits {
  'update:modelValue': [value: boolean]
  'update:visible': [value: boolean]
  close: []
  play: []
  pause: []
  /** 视频播放结束时发出（对应原生 `ended`）。 */
  end: []
}
