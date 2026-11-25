export type MqLayoutDirection = 'row' | 'column'

export type MqLayoutWrap = 'nowrap' | 'wrap' | 'wrap-reverse'

export type MqLayoutJustify =
  'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'

export type MqLayoutAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'

export interface MqLayoutProps {
  /** 主轴方向。默认 `row`。 */
  direction?: MqLayoutDirection
  /** 换行方式。默认 `nowrap`。 */
  wrap?: MqLayoutWrap
  /** 主轴对齐。默认不设置。 */
  justify?: MqLayoutJustify
  /** 交叉轴对齐。默认不设置。 */
  align?: MqLayoutAlign
  /** 子元素间距，数字按 px 转成 `gap`。默认 `0`。 */
  gutter?: number
  /** 高度撑满父级。默认 `false`。 */
  full?: boolean
}
