export type MqFabType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type MqFabPosition =
  | 'left-top'
  | 'right-top'
  | 'left-bottom'
  | 'right-bottom'
  | 'left-center'
  | 'right-center'
  | 'top-center'
  | 'bottom-center'
export type MqFabDirection = 'top' | 'right' | 'bottom' | 'left'

export interface MqFabProps {
  active?: boolean
  type?: MqFabType
  position?: MqFabPosition
  direction?: MqFabDirection
  disabled?: boolean
  expandable?: boolean
  /** 收起时的文字标记，默认 +。 */
  inactiveMark?: string
  /** 展开时的文字标记，默认 ×。 */
  activeMark?: string
  zIndex?: number
  gap?: number
}

export interface MqFabEmits {
  (e: 'update:active', value: boolean): void
  (e: 'click', event: Event): void
  (e: 'change', value: boolean): void
}
