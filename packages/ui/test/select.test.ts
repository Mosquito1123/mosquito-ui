import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  filterSelectOptions,
  isSelectValueEqual,
  normalizeSelectValue,
  selectLabels,
  toggleSelectValue,
} from '../src/utils/select.ts'
import type { MqSelectOption } from '../src/utils/select.ts'

const options: MqSelectOption[] = [
  { label: '杭州', value: 'hz' },
  { label: '宁波', value: 'nb' },
  { label: '南京', value: 'nj' },
  { label: '苏州', value: 'sz', disabled: true },
]

test('select normalizes single and array values', () => {
  assert.deepEqual(normalizeSelectValue(undefined), [])
  assert.deepEqual(normalizeSelectValue('hz'), ['hz'])
  assert.deepEqual(normalizeSelectValue(['hz', 'hz', 'nb']), ['hz', 'nb'])
  assert.deepEqual(normalizeSelectValue(['', 0]), [0])
})

test('select toggles values in multiple mode', () => {
  assert.deepEqual(toggleSelectValue(['hz'], 'nb', true), ['hz', 'nb'])
  assert.deepEqual(toggleSelectValue(['hz', 'nb'], 'hz', true), ['nb'])
  assert.deepEqual(toggleSelectValue(['hz', 'nb'], 'nj'), ['nj'])
})

test('select filters options by label', () => {
  assert.equal(filterSelectOptions(options, '').length, 4)
  assert.deepEqual(filterSelectOptions(options, '南').map((item) => item.value), ['nj'])
  assert.deepEqual(filterSelectOptions(options, '  ').length, 4)
})

test('select maps values to labels and compares lists', () => {
  assert.deepEqual(selectLabels(options, ['hz', 'sz', 'missing']), ['杭州', '苏州'])
  assert.equal(isSelectValueEqual(['hz', 'nb'], ['nb', 'hz']), true)
  assert.equal(isSelectValueEqual(['hz'], ['hz', 'nb']), false)
})
