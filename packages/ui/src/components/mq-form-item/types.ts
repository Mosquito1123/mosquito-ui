import type {
  MqFormAsteriskPosition,
  MqFormLayout,
  MqFormValueAlign,
} from '../mq-form/types'

export interface MqFormItemProps {
  prop?: string
  title?: string
  label?: string
  value?: string | number
  placeholder?: string
  required?: boolean
  disabled?: boolean
  border?: boolean
  center?: boolean
  titleWidth?: string | number
  layout?: MqFormLayout
  valueAlign?: MqFormValueAlign
  asteriskPosition?: MqFormAsteriskPosition
  hideAsterisk?: boolean
  clickable?: boolean
  isLink?: boolean
}

export interface MqFormItemEmits {
  (e: 'click', event: Event): void
}
