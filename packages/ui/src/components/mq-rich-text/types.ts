export type MqRichTextTag =
  | 'text'
  | 'p'
  | 'div'
  | 'span'
  | 'a'
  | 'img'
  | 'br'
  | 'strong'
  | 'em'
  | 'b'
  | 'i'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'ul'
  | 'ol'
  | 'li'

export interface MqRichTextNode {
  /** 节点类型，如 `p`、`span`、`img`、`text`。与 `node` 同时存在时以 `type` 为准。 */
  type?: MqRichTextTag | string
  /** `type` 的别名。 */
  node?: MqRichTextTag | string
  /** 文本内容，供文本节点使用。 */
  text?: string
  /** 节点属性，会写到渲染元素上。 */
  attrs?: Record<string, string | number | boolean | undefined>
  /** 子节点；字符串会转成文本节点。 */
  children?: Array<MqRichTextNode | string> | string
}

export interface MqRichTextClickPayload {
  node: MqRichTextNode
  event: Event
}

export interface MqRichTextProps {
  /** 文本字符串，或递归节点数组。 */
  nodes?: string | MqRichTextNode[]
  /** 允许用户选中文本（CSS `user-select`）。默认 `false`。 */
  userSelect?: boolean
  /** 允许选中，语义同 `user-select`。默认 `false`。 */
  selectable?: boolean
}

export interface MqRichTextEmits {
  click: [payload: MqRichTextClickPayload]
}
