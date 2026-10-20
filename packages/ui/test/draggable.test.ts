import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  draggableOffset,
  reorderList,
  resolveDragTarget,
} from '../src/utils/draggable.ts'

test('draggable resolves the drop target from the drag distance', () => {
  assert.equal(resolveDragTarget(0, 0, 50, 4), 0)
  assert.equal(resolveDragTarget(0, 60, 50, 4), 1)
  assert.equal(resolveDragTarget(1, -120, 50, 4), 0)
  assert.equal(resolveDragTarget(3, 400, 50, 4), 3)
})

test('draggable handles invalid input', () => {
  assert.equal(resolveDragTarget(1, 10, 0, 0), 0)
  assert.equal(resolveDragTarget(1, Number.NaN, 50, 3), 1)
})

test('draggable shifts the items that give way', () => {
  assert.equal(draggableOffset(0, 2, 1, 40), -40)
  assert.equal(draggableOffset(0, 2, 3, 40), 0)
  assert.equal(draggableOffset(2, 0, 1, 40), 40)
  assert.equal(draggableOffset(1, 1, 0, 40), 0)
  assert.equal(draggableOffset(0, 2, 0, 40), 0)
})

test('draggable reorders without mutating the source', () => {
  const source = ['a', 'b', 'c', 'd']
  assert.deepEqual(reorderList(source, 0, 2), ['b', 'c', 'a', 'd'])
  assert.deepEqual(reorderList(source, 3, 1), ['a', 'd', 'b', 'c'])
  assert.deepEqual(source, ['a', 'b', 'c', 'd'])
  assert.deepEqual(reorderList(source, 1, 1), source)
  assert.deepEqual(reorderList(source, -1, 2), source)
})
