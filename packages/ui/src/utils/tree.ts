/** 树形选择的纯计算：展开后的行、勾选值与父节点状态。 */

export interface MqTreeNode {
  label: string
  value: string | number
  children?: MqTreeNode[]
  disabled?: boolean
}

export interface MqTreeRow {
  node: MqTreeNode
  depth: number
  parent?: MqTreeNode
}

export function hasTreeChildren(node: MqTreeNode): boolean {
  return Array.isArray(node.children) && node.children.length > 0
}

/** 按展开值把树拍平成可见行。 */
export function flattenTree(
  nodes: readonly MqTreeNode[],
  expanded: readonly (string | number)[] = [],
  depth = 0,
  parent?: MqTreeNode,
): MqTreeRow[] {
  const rows: MqTreeRow[] = []
  for (const node of nodes) {
    rows.push({ node, depth, parent })
    if (hasTreeChildren(node) && expanded.includes(node.value)) {
      rows.push(...flattenTree(node.children!, expanded, depth + 1, node))
    }
  }
  return rows
}

/** 节点及所有可勾选后代的值，跳过 disabled 节点。 */
export function collectTreeValues(node: MqTreeNode): Array<string | number> {
  if (node.disabled) {
    return []
  }
  const values: Array<string | number> = [node.value]
  for (const child of node.children ?? []) {
    values.push(...collectTreeValues(child))
  }
  return values
}

/** 所有含子节点的值，用于默认全部展开。 */
export function collectExpandableValues(
  nodes: readonly MqTreeNode[],
): Array<string | number> {
  const values: Array<string | number> = []
  for (const node of nodes) {
    if (hasTreeChildren(node)) {
      values.push(node.value)
      values.push(...collectExpandableValues(node.children!))
    }
  }
  return values
}

export function treeSelectionState(
  node: MqTreeNode,
  selected: readonly (string | number)[],
): 'none' | 'partial' | 'all' {
  const values = collectTreeValues(node)
  if (!values.length) {
    return 'none'
  }
  const count = values.filter((value) => selected.includes(value)).length
  if (count === 0) {
    return 'none'
  }
  return count === values.length ? 'all' : 'partial'
}

/** 点击节点后的勾选结果。多选会连带所有后代；单选只选当前节点。 */
export function toggleTreeSelection(
  selected: readonly (string | number)[],
  node: MqTreeNode,
  multiple = true,
): Array<string | number> {
  if (node.disabled) {
    return [...selected]
  }
  if (!multiple) {
    return [node.value]
  }
  const values = collectTreeValues(node)
  const checked = values.every((value) => selected.includes(value))
  if (checked) {
    return selected.filter((value) => !values.includes(value))
  }
  const next = [...selected]
  for (const value of values) {
    if (!next.includes(value)) {
      next.push(value)
    }
  }
  return next
}
