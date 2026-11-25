export type MqPopupPosition = 'center' | 'top' | 'right' | 'bottom' | 'left'

export interface MqPopupProps {
  /** 受控显隐，配合 `v-model`。 */
  modelValue?: boolean
  position?: MqPopupPosition
  /** 是否渲染遮罩。为 `false` 时不渲染遮罩节点。 */
  modal?: boolean
  /** 是否在面板内显示文字关闭按钮。 */
  closable?: boolean
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
  /** 点击遮罩时发出，先于请求关闭。 */
  'click-modal': []
  /** `modelValue` 变为 `true` 时发出。 */
  open: []
  /** `modelValue` 从打开变为关闭时发出，包含遮罩、Esc 和外部改值。 */
  close: []
  /** 进场动画各阶段。 */
  'before-enter': []
  enter: []
  'after-enter': []
  /** 离场动画各阶段。 */
  'before-leave': []
  leave: []
  'after-leave': []
}
