import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { nextTick } from 'vue'
import { attachToastHost, hideToast, showToast, toastState } from '../src/utils/toast.ts'

interface ToastCall {
  title: string
  icon?: string
  duration?: number
}

const g = globalThis as typeof globalThis & {
  uni?: {
    showToast: (options: ToastCall) => void
    hideToast: () => void
  }
}

afterEach(() => {
  hideToast()
  delete g.uni
})

function installUni() {
  const calls: Array<ToastCall | 'hide'> = []
  g.uni = {
    showToast(options) {
      calls.push(options)
    },
    hideToast() {
      calls.push('hide')
    },
  }
  return calls
}

test('string message stays on the reactive state when uni is absent', async () => {
  showToast('  你好  ')
  await nextTick()
  assert.equal(toastState.visible, true)
  assert.equal(toastState.message, '你好')
})

test('empty message does not replace the current toast', async () => {
  showToast('留下')
  await nextTick()
  const close = showToast('   ')
  await nextTick()
  assert.equal(toastState.visible, true)
  assert.equal(toastState.message, '留下')
  close()
  assert.equal(toastState.visible, true)
})

test('duration 0 does not auto hide', async () => {
  showToast({ message: '停', duration: 0 })
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 40))
  assert.equal(toastState.visible, true)
  hideToast()
  assert.equal(toastState.visible, false)
})

test('finite duration hides the toast', async () => {
  showToast({ message: '闪', duration: 30 })
  await nextTick()
  assert.equal(toastState.visible, true)
  await new Promise((resolve) => setTimeout(resolve, 80))
  assert.equal(toastState.visible, false)
})

test('a newer toast cancels the previous timer and closer', async () => {
  const closeFirst = showToast({ message: '短', duration: 30 })
  await nextTick()
  showToast({ message: '长', duration: 0 })
  await nextTick()
  closeFirst()
  await new Promise((resolve) => setTimeout(resolve, 70))
  assert.equal(toastState.visible, true)
  assert.equal(toastState.message, '长')
})

test('invalid duration falls back to 2000 for the native toast', async () => {
  const calls = installUni()
  showToast({ message: '默认', duration: Number.NaN })
  await nextTick()
  assert.equal(toastState.visible, false)
  assert.equal(calls.length, 1)
  assert.equal(typeof calls[0] === 'object' ? calls[0].duration : 0, 2000)
  assert.equal(typeof calls[0] === 'object' ? calls[0].icon : '', 'none')
})

test('native sticky toast uses a long duration and hideToast dismisses it', async () => {
  const calls = installUni()
  showToast({ message: '停住', duration: 0 })
  await nextTick()
  assert.equal(typeof calls[0] === 'object' ? calls[0].duration : 0, 600_000)
  hideToast()
  assert.equal(calls[1], 'hide')
  assert.equal(toastState.visible, false)
})

test('a mounted host wins over uni, including when it attaches before nextTick', async () => {
  const calls = installUni()
  showToast('同步')
  const detach = attachToastHost()
  try {
    await nextTick()
    assert.deepEqual(calls, [])
    assert.equal(toastState.visible, true)
    assert.equal(toastState.message, '同步')
    hideToast()
    assert.deepEqual(calls, [])
  } finally {
    detach()
  }
})

test('detaching one host twice does not drop another host', async () => {
  const calls = installUni()
  const first = attachToastHost()
  const second = attachToastHost()
  try {
    first()
    first()
    showToast('仍有宿主')
    await nextTick()
    assert.deepEqual(calls, [])
    assert.equal(toastState.visible, true)
  } finally {
    second()
  }
})

test('a later host toast dismisses the native fallback', async () => {
  const calls = installUni()
  showToast('原生')
  await nextTick()
  const detach = attachToastHost()
  try {
    showToast('组件')
    await nextTick()
    assert.equal(toastState.visible, true)
    assert.equal(toastState.message, '组件')
    assert.equal(calls[1], 'hide')
  } finally {
    detach()
  }
})

test('without a host, showToast falls back to uni.showToast', async () => {
  const calls = installUni()
  showToast('原生')
  await nextTick()
  assert.equal(toastState.visible, false)
  assert.equal(calls.length, 1)
  assert.equal(typeof calls[0] === 'object' ? calls[0].title : '', '原生')
})
