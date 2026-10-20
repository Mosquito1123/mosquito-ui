export type MqSortButtonValue = -1 | 0 | 1

export interface MqSortButtonProps {
  modelValue?: MqSortButtonValue
  title?: string
  allowReset?: boolean
  descFirst?: boolean
  line?: boolean
}

export interface MqSortButtonEmits {
  (e: 'update:modelValue', value: MqSortButtonValue): void
  (e: 'change', payload: { value: MqSortButtonValue }): void
}
