import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  addMonths,
  buildCalendarDays,
  compareDate,
  daysInMonth,
  formatDateSummary,
  isDateBetween,
  nextDateSelection,
  normalizeDate,
  normalizeDateList,
  parseDate,
} from '../src/utils/date.ts'

test('parseDate accepts common separators and rejects bad dates', () => {
  assert.deepEqual(parseDate('2026-10-20'), { year: 2026, month: 10, day: 20 })
  assert.deepEqual(parseDate('2026/1/2'), { year: 2026, month: 1, day: 2 })
  assert.deepEqual(parseDate('2024.02.29'), { year: 2024, month: 2, day: 29 })
  assert.equal(parseDate('2026-02-29'), null)
  assert.equal(parseDate('2026-13-01'), null)
  assert.equal(parseDate('not a date'), null)
  assert.equal(parseDate(''), null)
})

test('normalizeDate pads and drops invalid values', () => {
  assert.equal(normalizeDate('2026-1-2'), '2026-01-02')
  assert.equal(normalizeDate('2026/12/31'), '2026-12-31')
  assert.equal(normalizeDate('2026-02-30'), '')
})

test('daysInMonth handles leap years', () => {
  assert.equal(daysInMonth(2024, 2), 29)
  assert.equal(daysInMonth(2025, 2), 28)
  assert.equal(daysInMonth(2026, 4), 30)
  assert.equal(daysInMonth(2026, 12), 31)
})

test('addMonths crosses year boundaries in both directions', () => {
  assert.deepEqual(addMonths(2026, 10, 3), { year: 2027, month: 1 })
  assert.deepEqual(addMonths(2026, 1, -1), { year: 2025, month: 12 })
  assert.deepEqual(addMonths(2026, 6, 0), { year: 2026, month: 6 })
  assert.deepEqual(addMonths(2026, 12, 12), { year: 2027, month: 12 })
})

test('compareDate uses date order and treats invalid values as empty', () => {
  assert.equal(compareDate('2026-10-01', '2026-10-02'), -1)
  assert.equal(compareDate('2026-10-02', '2026-10-02'), 0)
  assert.equal(compareDate('2026-10-03', '2026-10-02'), 1)
  assert.equal(compareDate('bad', '2026-10-02'), -1)
})

test('isDateBetween respects both bounds', () => {
  assert.equal(isDateBetween('2026-10-10', '2026-10-01', '2026-10-20'), true)
  assert.equal(isDateBetween('2026-10-01', '2026-10-01', '2026-10-20'), true)
  assert.equal(isDateBetween('2026-09-30', '2026-10-01', '2026-10-20'), false)
  assert.equal(isDateBetween('2026-10-21', '2026-10-01', '2026-10-20'), false)
  assert.equal(isDateBetween('2026-10-21'), true)
})

test('buildCalendarDays pads to six rows and marks the current month', () => {
  const sundayFirst = buildCalendarDays(2026, 10, 0)
  assert.equal(sundayFirst.length, 42)
  assert.equal(sundayFirst[0].date, '2026-09-27')
  assert.equal(sundayFirst[0].currentMonth, false)
  assert.equal(sundayFirst[4].date, '2026-10-01')
  assert.equal(sundayFirst[4].currentMonth, true)
  assert.equal(sundayFirst[34].date, '2026-10-31')
  assert.equal(sundayFirst[35].date, '2026-11-01')
  assert.equal(sundayFirst[41].date, '2026-11-07')

  const mondayFirst = buildCalendarDays(2026, 10, 1)
  assert.equal(mondayFirst[0].date, '2026-09-28')
  assert.equal(mondayFirst[3].date, '2026-10-01')
})

test('normalizeDateList dedupes and drops invalid entries', () => {
  assert.deepEqual(normalizeDateList('2026-10-01'), ['2026-10-01'])
  assert.deepEqual(normalizeDateList(['2026-10-01', '2026-10-01', 'bad']), ['2026-10-01'])
  assert.deepEqual(normalizeDateList(undefined), [])
})

test('single and multiple selection replace or toggle', () => {
  assert.deepEqual(nextDateSelection(['2026-10-01'], '2026-10-05', 'single'), ['2026-10-05'])
  assert.deepEqual(nextDateSelection(['2026-10-01'], '2026-10-05', 'multiple'), [
    '2026-10-01',
    '2026-10-05',
  ])
  assert.deepEqual(nextDateSelection(['2026-10-01', '2026-10-05'], '2026-10-01', 'multiple'), [
    '2026-10-05',
  ])
})

test('range selection needs two clicks and restarts after a full range', () => {
  assert.deepEqual(nextDateSelection([], '2026-10-10', 'range'), ['2026-10-10'])
  assert.deepEqual(nextDateSelection(['2026-10-10'], '2026-10-15', 'range'), [
    '2026-10-10',
    '2026-10-15',
  ])
  assert.deepEqual(nextDateSelection(['2026-10-10'], '2026-10-05', 'range'), [
    '2026-10-05',
    '2026-10-10',
  ])
  assert.deepEqual(nextDateSelection(['2026-10-05', '2026-10-10'], '2026-10-20', 'range'), [
    '2026-10-20',
  ])
})

test('summary text covers single, range and multiple', () => {
  assert.equal(formatDateSummary([], 'single'), '请选择日期')
  assert.equal(formatDateSummary(['2026-10-01'], 'single'), '2026-10-01')
  assert.equal(formatDateSummary(['2026-10-01'], 'range'), '2026-10-01 ~ 结束')
  assert.equal(formatDateSummary(['2026-10-01', '2026-10-03'], 'range'), '2026-10-01 ~ 2026-10-03')
  assert.equal(formatDateSummary(['a', 'b'], 'multiple'), '已选 2 天')
})
