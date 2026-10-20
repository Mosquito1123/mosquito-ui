import type { MqAvatarShape, MqAvatarSize } from '../mq-avatar/types'

export type MqAvatarGroupCascading = 'left-up' | 'right-up'

export interface MqAvatarGroupProps {
  /** 最多显示几个头像，超出部分收成 `+N`。为 0 时全部显示。 */
  maxCount?: number
  /** 外部总数，用于只拿到数量、不渲染完整列表的场景。 */
  total?: number
  /** 叠层方向。`right-up` 把顺序反过来，从右侧开始叠。 */
  cascading?: MqAvatarGroupCascading
  /** 统一头像形状，子头像没写 `shape` 时生效。 */
  shape?: MqAvatarShape
  /** 统一头像尺寸，子头像没写 `size` 时生效。 */
  size?: MqAvatarSize
  vertical?: boolean
  /** 折叠头像上的文字，不写时为 `+N`。 */
  collapseText?: string
  collapseBg?: string
  collapseColor?: string
}
