import assert from 'node:assert/strict'
import { test } from 'node:test'
import { splitWaterfall } from '../src/utils/waterfall.ts'

test('waterfall distributes items by index without estimates', () => {
  const columns = splitWaterfall([1, 2, 3, 4, 5], 2)
  assert.deepEqual(columns[0].map((cell) => cell.item), [1, 3, 5])
  assert.deepEqual(columns[1].map((cell) => cell.item), [2, 4])
  assert.deepEqual(columns[0][0], { item: 1, index: 0 })
})

test('waterfall clamps the column count', () => {
  assert.equal(splitWaterfall([1, 2], 0).length, 1)
  assert.equal(splitWaterfall([1, 2], 20).length, 6)
})

test('waterfall balances columns with height estimates', () => {
  const columns = splitWaterfall([1, 2, 3], 2, (item) => item * 10)
  assert.deepEqual(columns[0].map((cell) => cell.item), [1, 3])
  assert.deepEqual(columns[1].map((cell) => cell.item), [2])
})
