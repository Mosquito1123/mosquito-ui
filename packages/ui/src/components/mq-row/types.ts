export type MqRowJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
export type MqRowAlign = 'top' | 'middle' | 'bottom'

export interface MqRowProps {
  gutter?: number
  justify?: MqRowJustify
  align?: MqRowAlign
}
