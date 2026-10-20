import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  clampSlideDistance,
  isSlidePassed,
  settleSlideDistance,
  slideProgress,
} from '../src/utils/slide-verify.ts'

test('slide distance is clamped to the track', () => {
  assert.equal(clampSlideDistance(-20, 200), 0)
  assert.equal(clampSlideDistance(120, 200), 120)
  assert.equal(clampSlideDistance(320, 200), 200)
  assert.equal(clampSlideDistance(20, 0), 0)
})

test('slide progress maps to 0..1', () => {
  assert.equal(slideProgress(100, 200), 0.5)
  assert.equal(slideProgress(0, 200), 0)
  assert.equal(slideProgress(300, 200), 1)
  assert.equal(slideProgress(20, 0), 0)
})

test('slide passes once the threshold is reached', () => {
  assert.equal(isSlidePassed(0.5), false)
  assert.equal(isSlidePassed(0.9), true)
  assert.equal(isSlidePassed(0.9, 0.95), false)
  assert.equal(isSlidePassed(0.95, 0.95), true)
})

test('settled distance snaps to start or end', () => {
  assert.deepEqual(settleSlideDistance(40, 200), { distance: 0, passed: false })
  assert.deepEqual(settleSlideDistance(190, 200), { distance: 200, passed: true })
  assert.deepEqual(settleSlideDistance(200, 200, 0.95), { distance: 200, passed: true })
})
