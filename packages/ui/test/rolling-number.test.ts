import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatRollingNumber,
  toRollingChars,
} from '../src/utils/rolling-number.ts'

test('rolling number formats thousands and decimals', () => {
  assert.equal(formatRollingNumber(1234567), '1,234,567')
  assert.equal(formatRollingNumber(1234.5, 2), '1,234.50')
  assert.equal(formatRollingNumber(-1234.5, 1), '-1,234.5')
  assert.equal(formatRollingNumber(1234, 0, ''), '1234')
  assert.equal(formatRollingNumber(Number.NaN), '0')
})

test('rolling number splits digits from separators', () => {
  const chars = toRollingChars('1,234.5')
  assert.deepEqual(
    chars.map((item) => item.char),
    ['1', ',', '2', '3', '4', '.', '5'],
  )
  assert.deepEqual(
    chars.map((item) => item.digit),
    [true, false, true, true, true, false, true],
  )
  assert.deepEqual(toRollingChars('-12').map((item) => item.digit), [false, true, true])
})
