import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildDatetimeColumns,
  clampTimestamp,
  correctDatetime,
  datetimeFromIndexes,
  datetimeIndexes,
  formatDatetime,
  parseDatetime,
} from '../src/utils/datetime.ts'

const options = { type: 'datetime' as const }

test('datetime builds year month day hour minute columns', () => {
  const parts = parseDatetime(new Date(2026, 9, 20, 13, 45).getTime(), options)
  const columns = buildDatetimeColumns(parts, options)
  assert.equal(columns.length, 5)
  assert.equal(columns[0].length, 21)
  assert.equal(columns[1].length, 12)
  assert.equal(columns[2].length, 31)
  assert.equal(columns[3].length, 24)
  assert.equal(columns[4].length, 60)

  const indexes = datetimeIndexes(parts, columns, options)
  assert.deepEqual(indexes, [10, 9, 19, 13, 45])

  const value = datetimeFromIndexes(indexes, columns, options)
  assert.equal(value, new Date(2026, 9, 20, 13, 45).getTime())
})

test('datetime day column follows leap years', () => {
  const leap = parseDatetime(new Date(2024, 1, 10).getTime(), options)
  assert.equal(buildDatetimeColumns(leap, options)[2].length, 29)

  const common = parseDatetime(new Date(2023, 1, 10).getTime(), options)
  assert.equal(buildDatetimeColumns(common, options)[2].length, 28)
})

test('year-month and year types drop lower columns', () => {
  const value = new Date(2026, 9, 20).getTime()
  assert.equal(buildDatetimeColumns(parseDatetime(value, { type: 'year-month' }), { type: 'year-month' }).length, 2)
  assert.equal(buildDatetimeColumns(parseDatetime(value, { type: 'year' }), { type: 'year' }).length, 1)
  assert.equal(buildDatetimeColumns(parseDatetime(value, { type: 'date' }), { type: 'date' }).length, 3)
})

test('time type round trips strings and honours seconds', () => {
  const timeOptions = { type: 'time' as const, useSecond: true }
  const parts = parseDatetime('09:05:30', timeOptions)
  const columns = buildDatetimeColumns(parts, timeOptions)
  assert.equal(columns.length, 3)
  const indexes = datetimeIndexes(parts, columns, timeOptions)
  assert.deepEqual(indexes, [9, 5, 30])
  assert.equal(datetimeFromIndexes(indexes, columns, timeOptions), '09:05:30')

  const short = { type: 'time' as const }
  const shortParts = parseDatetime('09:05', short)
  const shortColumns = buildDatetimeColumns(shortParts, short)
  assert.equal(datetimeFromIndexes(datetimeIndexes(shortParts, shortColumns, short), shortColumns, short), '09:05')
})

test('datetime value is clamped to min and max', () => {
  const min = new Date(2020, 0, 1).getTime()
  const max = new Date(2020, 11, 31, 23, 59, 59).getTime()
  assert.equal(clampTimestamp(new Date(2010, 0, 1).getTime(), min, max), min)
  assert.equal(clampTimestamp(new Date(2030, 0, 1).getTime(), min, max), max)
  assert.equal(correctDatetime(new Date(2010, 0, 1).getTime(), { minDate: min, maxDate: max }), min)
})

test('datetime formatting covers each type', () => {
  const value = new Date(2026, 9, 20, 8, 6, 5).getTime()
  assert.equal(formatDatetime(value, options), '2026-10-20 08:06')
  assert.equal(formatDatetime(value, { type: 'date' }), '2026-10-20')
  assert.equal(formatDatetime(value, { type: 'year-month' }), '2026年10月')
  assert.equal(formatDatetime(value, { type: 'year' }), '2026年')
  assert.equal(formatDatetime('08:06:05', { type: 'time', useSecond: true }), '08:06:05')
})
