import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildCascadeSelection,
  cascadeColumnsFromIndexes,
  findPickerIndex,
  normalizePickerColumns,
  pickerSelection,
  resolvePickerIndexes,
  samePickerValues,
} from '../src/utils/picker.ts'

const tree = [
  {
    value: 'zj',
    label: '浙江',
    children: [
      { value: 'hz', label: '杭州' },
      { value: 'nb', label: '宁波' },
    ],
  },
  {
    value: 'js',
    label: '江苏',
    children: [{ value: 'nj', label: '南京' }],
  },
]

test('flat columns become a single column', () => {
  const columns = normalizePickerColumns(['苹果', '梨'])
  assert.equal(columns.length, 1)
  assert.deepEqual(columns[0].map((item) => item.value), ['苹果', '梨'])
  assert.deepEqual(columns[0].map((item) => item.label), ['苹果', '梨'])
})

test('two-dimensional input becomes multiple columns', () => {
  const columns = normalizePickerColumns([
    [{ value: 1, label: '一' }, { value: 2, label: '二' }],
    ['甲', '乙'],
  ])
  assert.equal(columns.length, 2)
  assert.deepEqual(columns[0].map((item) => item.label), ['一', '二'])
  assert.deepEqual(columns[1].map((item) => item.value), ['甲', '乙'])
})

test('custom value and label keys are respected', () => {
  const columns = normalizePickerColumns(
    [
      [
        { id: 'a', name: '选项 A' },
        { id: 'b', name: '选项 B' },
      ],
    ],
    { valueKey: 'id', labelKey: 'name' },
  )
  assert.deepEqual(columns[0].map((item) => item.value), ['a', 'b'])
  assert.deepEqual(columns[0].map((item) => item.label), ['选项 A', '选项 B'])
})

test('empty input yields no columns', () => {
  assert.deepEqual(normalizePickerColumns(undefined), [])
  assert.deepEqual(normalizePickerColumns([]), [])
})

test('resolvePickerIndexes falls back to the first enabled item', () => {
  const columns = normalizePickerColumns([
    [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
    ],
    ['x', 'y', 'z'],
  ])
  assert.deepEqual(resolvePickerIndexes(columns, ['b', 'z']), [1, 2])
  assert.deepEqual(resolvePickerIndexes(columns, ['missing', 'missing']), [1, 0])
  assert.deepEqual(resolvePickerIndexes(columns, []), [1, 0])
  assert.equal(findPickerIndex(columns[1], 'y'), 1)
  assert.equal(findPickerIndex(columns[1], 'no'), -1)
})

test('pickerSelection returns values, labels and indexes', () => {
  const columns = normalizePickerColumns([
    ['a', 'b'],
    ['x', 'y'],
  ])
  const selection = pickerSelection(columns, [1, 0])
  assert.deepEqual(selection.selectedValues, ['b', 'x'])
  assert.deepEqual(selection.selectedLabels, ['b', 'x'])
  assert.deepEqual(selection.selectedIndexes, [1, 0])
  assert.equal(selection.selectedOptions.length, 2)
})

test('cascade selection expands every level with defaults', () => {
  const empty = buildCascadeSelection(tree, [])
  assert.equal(empty.columns.length, 2)
  assert.deepEqual(empty.indexes, [0, 0])

  const jiangsu = buildCascadeSelection(tree, ['js', 'nj'])
  assert.deepEqual(jiangsu.indexes, [1, 0])

  const unknown = buildCascadeSelection(tree, ['missing'])
  assert.deepEqual(unknown.indexes, [0, 0])
})

test('cascade columns rebuild from an index chain', () => {
  const full = cascadeColumnsFromIndexes(tree, [1, 0])
  assert.equal(full.columns.length, 2)
  assert.deepEqual(full.indexes, [1, 0])

  const parentOnly = cascadeColumnsFromIndexes(tree, [0])
  assert.equal(parentOnly.columns.length, 2)
  assert.deepEqual(parentOnly.indexes, [0, 0])

  const switched = cascadeColumnsFromIndexes(tree, [1])
  assert.equal(switched.columns.length, 2)
  assert.deepEqual(switched.indexes, [1, 0])
  assert.deepEqual(switched.columns[1].map((item) => item.value), ['nj'])
})

test('samePickerValues compares by value and order', () => {
  assert.equal(samePickerValues([], []), true)
  assert.equal(samePickerValues(['a'], ['a']), true)
  assert.equal(samePickerValues(['a'], ['b']), false)
  assert.equal(samePickerValues(['a', 'b'], ['b', 'a']), false)
})
