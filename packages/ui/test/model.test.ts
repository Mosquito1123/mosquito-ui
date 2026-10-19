import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  clampPercent,
  formatBadge,
  nextRadioValue,
  nextSwitchValue,
  resolvePx,
  toggleCheckedValues,
} from '../src/utils/model.ts'

test('checkbox toggle respects min and max', () => {
  assert.deepEqual(toggleCheckedValues(['a'], 'b', 0, 2), ['a', 'b'])
  assert.equal(toggleCheckedValues(['a', 'b'], 'c', 0, 2), undefined)
  assert.equal(toggleCheckedValues(['a'], 'a', 1, 0), undefined)
  assert.deepEqual(toggleCheckedValues(['a', 'b'], 'a', 1, 0), ['b'])
  assert.deepEqual(toggleCheckedValues([], false, 0, 0), [false])
  assert.deepEqual(toggleCheckedValues([0], 0, 0, 0), [])
})

test('radio can stay selected or clear', () => {
  assert.deepEqual(nextRadioValue('air', 'land', false), { value: 'land', changed: true })
  assert.deepEqual(nextRadioValue('air', 'air', false), { value: 'air', changed: false })
  assert.deepEqual(nextRadioValue('air', 'air', true), { value: undefined, changed: true })
})

test('switch maps active and inactive values', () => {
  assert.equal(nextSwitchValue(false, true, false), true)
  assert.equal(nextSwitchValue('开', '开', '关'), '关')
  assert.equal(nextSwitchValue(0, 1, 0), 1)
})

test('size and percent fall back on bad numbers', () => {
  assert.equal(resolvePx(undefined, 26), 26)
  assert.equal(resolvePx(0, 26), 26)
  assert.equal(resolvePx('24px', 26), 24)
  assert.equal(clampPercent(140.2), 100)
  assert.equal(clampPercent(Number.NaN), 0)
  assert.equal(clampPercent(-4), 0)
})

test('badge hides zero unless asked and caps numbers', () => {
  assert.equal(formatBadge(0), null)
  assert.equal(formatBadge(0, { showZero: true }), '0')
  assert.equal(formatBadge(120, { max: 99 }), '99+')
  assert.equal(formatBadge(' hot '), 'hot')
  assert.equal(formatBadge('   '), null)
  assert.equal(formatBadge(null, { dot: true }), '')
})
