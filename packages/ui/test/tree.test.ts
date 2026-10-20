import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  collectExpandableValues,
  collectTreeValues,
  flattenTree,
  toggleTreeSelection,
  treeSelectionState,
} from '../src/utils/tree.ts'
import type { MqTreeNode } from '../src/utils/tree.ts'

const tree: MqTreeNode[] = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb', disabled: true },
    ],
  },
  {
    label: '江苏',
    value: 'js',
    children: [{ label: '南京', value: 'nj' }],
  },
]

test('tree flattens only expanded branches', () => {
  assert.deepEqual(flattenTree(tree).map((row) => row.node.value), ['zj', 'js'])
  assert.deepEqual(
    flattenTree(tree, ['zj']).map((row) => `${row.depth}-${row.node.value}`),
    ['0-zj', '1-hz', '1-nb', '0-js'],
  )
  assert.deepEqual(collectExpandableValues(tree), ['zj', 'js'])
})

test('tree collects enabled descendants', () => {
  assert.deepEqual(collectTreeValues(tree[0]), ['zj', 'hz'])
  assert.deepEqual(collectTreeValues(tree[0].children![1]), [])
})

test('tree selection toggles descendants and skips disabled nodes', () => {
  assert.deepEqual(toggleTreeSelection([], tree[0]), ['zj', 'hz'])
  assert.deepEqual(toggleTreeSelection(['zj', 'hz'], tree[0]), [])
  assert.deepEqual(toggleTreeSelection(['nj'], tree[0]), ['nj', 'zj', 'hz'])
  assert.deepEqual(toggleTreeSelection(['nj'], tree[0], false), ['zj'])
})

test('tree parent state reports none, partial and all', () => {
  assert.equal(treeSelectionState(tree[0], []), 'none')
  assert.equal(treeSelectionState(tree[0], ['hz']), 'partial')
  assert.equal(treeSelectionState(tree[0], ['zj', 'hz']), 'all')
})
