/** 内置图标名。未列出的名称会回退为文字首字符。 */
export type MqIconName =
  | 'add'
  | 'close'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-down'
  | 'arrow-up'
  | 'check'
  | 'search'
  | 'star'
  | 'heart'
  | 'refresh'
  | 'more'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'camera'
  | 'image'
  | 'location'
  | 'phone'
  | 'shop'
  | 'user'
  | 'delete'
  | 'edit'
  | 'chat'
  | 'clock'
  | 'gift'

export interface MqIconProps {
  /** 图标名。内置名映射到 unicode 字形；未知名回退为 `name` 首字符，空名渲染空。 */
  name?: MqIconName | string
  /** 字号。数字按 px，字符串原样使用。默认 `16`。 */
  size?: string | number
  /** 颜色。默认继承主题色。 */
  color?: string
  /** 字形加粗。 */
  bold?: boolean
  /** 块级显示并撑满父级宽度。 */
  block?: boolean
}

export interface MqIconEmits {
  click: [event: Event]
}
