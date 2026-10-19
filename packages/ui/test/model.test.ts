import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  clampPercent,
  formatBadge,
  nextCollapseValue,
  nextRadioValue,
  nextRateValue,
  nextSwitchValue,
  resolvePx,
  snapSlider,
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

test('slider snaps to step and stays inside min and max', () => {
  assert.equal(snapSlider(23, 0, 100, 10), 20)
  assert.equal(snapSlider(26, 0, 100, 10), 30)
  assert.equal(snapSlider(-5, 0, 100, 1), 0)
  assert.equal(snapSlider(140, 0, 100, 5), 100)
  assert.equal(snapSlider(1.26, 0, 2, 0.5), 1.5)
  assert.equal(snapSlider(Number.NaN, 10, 20, 1), 10)
  assert.equal(snapSlider(3, 0, 5, 10), 0)
  assert.equal(snapSlider(5, 0, 5, 10), 5)
})

test('rate uses half stars and can clear the current value', () => {
  assert.equal(nextRateValue(0, 3, false, false, 5), 3)
  assert.equal(nextRateValue(0, 3, true, false, 5), 2.5)
  assert.equal(nextRateValue(2.5, 3, true, true, 5), 0)
  assert.equal(nextRateValue(4, 4, false, false, 5), 4)
  assert.equal(nextRateValue(1, 8, false, false, 5), 5)
  assert.equal(nextRateValue(Number.NaN, 1, true, false, 0), 0.5)
})

test('collapse toggles accordion and multiple names', () => {
  assert.equal(nextCollapseValue('ship', 'ship', true), '')
  assert.equal(nextCollapseValue('ship', 'pay', true), 'pay')
  assert.deepEqual(nextCollapseValue(['ship'], 'pay', false), ['ship', 'pay'])
  assert.deepEqual(nextCollapseValue(['ship', 'pay'], 'ship', false), ['pay'])
  assert.deepEqual(nextCollapseValue(undefined, 'ship', false), ['ship'])
})

test('badge hides zero unless asked and caps numbers', () => {
  assert.equal(formatBadge(0), null)
  assert.equal(formatBadge(0, { showZero: true }), '0')
  assert.equal(formatBadge(120, { max: 99 }), '99+')
  assert.equal(formatBadge(' hot '), 'hot')
  assert.equal(formatBadge('   '), null)
  assert.equal(formatBadge(null, { dot: true }), '')
})
