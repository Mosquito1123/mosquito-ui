export type MqTagType = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export type MqTagVariant = 'base' | 'plain' | 'light' | 'text' | 'dashed'

export type MqTagSize = 'small' | 'medium' | 'large'

export interface MqTagProps {
  type?: MqTagType
  variant?: MqTagVariant
  size?: MqTagSize
  round?: boolean
  closable?: boolean
  /** 禁用时不发出 click，输入框也不可编辑。 */
  disabled?: boolean
  /** 渲染为可输入标签，回车确认时发出 confirm。 */
  dynamic?: boolean
  /** 文字颜色。 */
  color?: string
  /** 实心时作背景，镂空时作边框。 */
  bgColor?: string
}

export interface MqTagEmits {
  close: [event: Event]
  click: [event: MouseEvent]
  confirm: [payload: { value: string }]
}
