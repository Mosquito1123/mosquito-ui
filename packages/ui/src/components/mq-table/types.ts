export type MqTableAlign = 'left' | 'center' | 'right'
export type MqTableSize = 'small' | 'medium' | 'large'

export interface MqTableColumn {
  /** 对应 `data` 行里的字段名，也用于插槽名 `cell-字段名`。 */
  prop: string
  label?: string
  /** 数字按 px，字符串原样使用。不写时均分剩余宽度。 */
  width?: string | number
  minWidth?: string | number
  align?: MqTableAlign
  ellipsis?: boolean
  formatter?: (
    row: Record<string, unknown>,
    value: unknown,
    index: number,
  ) => string
}

export interface MqTableProps {
  data?: Array<Record<string, unknown>>
  columns?: MqTableColumn[]
  border?: boolean
  stripe?: boolean
  size?: MqTableSize
  /** 行主键字段，不写时用下标。 */
  rowKey?: string
  emptyText?: string
  loading?: boolean
  /** 列没有写 `align` 时的默认对齐。 */
  align?: MqTableAlign
  headerBg?: string
}

export interface MqTableEmits {
  rowClick: [row: Record<string, unknown>, index: number]
  cellClick: [row: Record<string, unknown>, column: MqTableColumn, index: number]
}
