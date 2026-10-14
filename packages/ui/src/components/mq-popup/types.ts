export type MqPopupPosition = 'bottom' | 'center'

export interface MqPopupProps {
  /** 受控显隐，配合 `v-model`。 */
  modelValue?: boolean
  position?: MqPopupPosition
  /** 点击遮罩是否关闭。为 `false` 时 Esc 同样不关闭。 */
  maskClosable?: boolean
  /** 过渡时长，毫秒。非法或负数时按 200。 */
  duration?: number
  /** 覆盖根节点 `z-index`，默认走 `--mq-z-popup`。 */
  zIndex?: number
  /** 对话框的无障碍名称，不额外渲染节点。 */
  title?: string
}

export interface MqPopupEmits {
  'update:modelValue': [value: boolean]
  /** `modelValue` 变为 `true` 时发出。 */
  open: []
  /** `modelValue` 从打开变为关闭时发出，包含遮罩、Esc 和外部改值。 */
  close: []
}
