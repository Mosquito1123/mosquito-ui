import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  cascaderLabel,
  cascaderLevels,
  cascaderValue,
  findCascaderPath,
  findCascaderPathByValues,
  isCascaderComplete,
  selectCascaderOption,
} from '../src/utils/cascader.ts'
import type { MqCascaderOption } from '../src/utils/cascader.ts'

const options: MqCascaderOption[] = [
  {
    value: 'zj',
    text: '浙江',
    children: [
      { value: 'hz', text: '杭州' },
      { value: 'nb', text: '宁波', disabled: true },
    ],
  },
  {
    value: 'js',
    text: '江苏',
    children: [
      {
        value: 'nj',
        text: '南京',
        children: [{ value: 'xuanwu', text: '玄武' }],
      },
    ],
  },
]

test('cascader finds a leaf path by value', () => {
  const path = findCascaderPath(options, 'hz')
  assert.deepEqual(path.map((item) => item.value), ['zj', 'hz'])
  assert.equal(findCascaderPath(options, 'missing').length, 0)
})

test('cascader finds a path by value list', () => {
  const path = findCascaderPathByValues(options, ['js', 'nj', 'xuanwu'])
  assert.equal(path.length, 3)
  assert.equal(cascaderLabel(path), '江苏 / 南京 / 玄武')
  assert.equal(cascaderValue(path), 'xuanwu')
})

test('cascader levels follow the selected path', () => {
  const path = findCascaderPath(options, 'hz')
  const levels = cascaderLevels(options, path)
  assert.equal(levels.length, 2)
  assert.deepEqual(levels[1].map((item) => item.value), ['hz', 'nb'])
})

test('selecting a parent expands the next level', () => {
  const result = selectCascaderOption([], 0, options[0])
  assert.deepEqual(result.path.map((item) => item.value), ['zj'])
  assert.equal(result.activeIndex, 1)
})

test('selecting a leaf keeps the current level', () => {
  const path = findCascaderPath(options, 'zj').slice(0, 1)
  const result = selectCascaderOption(path, 1, options[0].children![0])
  assert.deepEqual(result.path.map((item) => item.value), ['zj', 'hz'])
  assert.equal(result.activeIndex, 1)
  assert.equal(isCascaderComplete(result.path), true)
  assert.equal(isCascaderComplete(path), false)
})

test('check strictly allows confirming a parent node', () => {
  const path = findCascaderPath(options, 'zj').slice(0, 1)
  assert.equal(isCascaderComplete(path, true), true)
  assert.equal(isCascaderComplete(path, false), false)
})
