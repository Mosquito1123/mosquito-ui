import type { MqTreeNode } from '../../utils/tree'

export type MqTreeModelValue =
  | string
  | number
  | Array<string | number>
  | null
  | undefined

export interface MqTreeProps {
  data?: MqTreeNode[]
  /** 勾选模式用数组，普通模式用单个值。 */
  modelValue?: MqTreeModelValue
  checkable?: boolean
  defaultExpandAll?: boolean
  /** 受控展开值，配合 `v-model:expanded`。 */
  expanded?: Array<string | number>
  /** 每级缩进（px）。 */
  indent?: number
  emptyText?: string
  disabled?: boolean
}

export interface MqTreeNodeClickPayload {
  node: MqTreeNode
  depth: number
}

export interface MqTreeCheckPayload {
  node: MqTreeNode
  selected: Array<string | number>
}

export interface MqTreeExpandPayload {
  node: MqTreeNode
  expanded: boolean
}

export interface MqTreeEmits {
  (e: 'update:modelValue', value: MqTreeModelValue): void
  (e: 'update:expanded', value: Array<string | number>): void
  (e: 'node-click', payload: MqTreeNodeClickPayload): void
  (e: 'check', payload: MqTreeCheckPayload): void
  (e: 'expand', payload: MqTreeExpandPayload): void
}

export interface MqTreeExpose {
  expandAll: () => void
  collapseAll: () => void
}
