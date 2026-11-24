export type MqKeyboardMode = 'abc' | 'num' | 'symbol'

export interface MqKeyboardProps {
  /** 显隐，配合 `v-model:visible`。 */
  visible?: boolean
  /** 初始键盘页，内部切换后通过 `change` 通知。 */
  mode?: MqKeyboardMode
  /** 确认按钮文案。 */
  confirmText?: string
  /** 是否显示确认按钮。 */
  showConfirm?: boolean
  /** 是否打乱字母与数字键顺序。 */
  randomOrder?: boolean
  /** 最多接收多少个字符，负数表示不限制。 */
  maxlength?: number
}

export interface MqKeyboardEmits {
  (e: 'update:visible', value: boolean): void
  /** 输入一个字符（含空格）。 */
  (e: 'input', value: string): void
  /** 删除一个字符。 */
  (e: 'delete'): void
  /** 点击确认按钮，随后会关闭键盘。 */
  (e: 'confirm'): void
  /** 点击遮罩或关闭时发出。 */
  (e: 'close'): void
  /** 键盘页切换时发出。 */
  (e: 'change', mode: MqKeyboardMode): void
}
