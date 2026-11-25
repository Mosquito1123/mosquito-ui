export interface MqPaginationProps {
  modelValue?: number
  total?: number
  pageSize?: number
  /** 手动指定总页数；提供后不再按 total / pageSize 计算。 */
  totalPage?: number
  showMessage?: boolean
  /** 总页数不超过 1 时不渲染根节点。 */
  hideIfOnePage?: boolean
  prevText?: string
  nextText?: string
}

export interface MqPaginationEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'change', payload: { value: number }): void
}
