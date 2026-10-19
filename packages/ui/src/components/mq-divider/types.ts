export type MqDividerPosition = 'left' | 'center' | 'right'

export interface MqDividerProps {
  color?: string
  contentPosition?: MqDividerPosition
  dashed?: boolean
  vertical?: boolean
  /** 把线压成半像素。垂直分割线仍用 1px。 */
  hairline?: boolean
}
