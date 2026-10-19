export interface MqPaginationProps {
  modelValue?: number
  total?: number
  pageSize?: number
  showMessage?: boolean
  prevText?: string
  nextText?: string
}

export interface MqPaginationEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'change', payload: { value: number }): void
}
