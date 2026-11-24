<template>
  <view v-if="rendered" class="mq-keyboard" :class="{ 'is-open': opened }" @click="onMask">
    <view class="mq-keyboard__panel" @click.stop>
      <view class="mq-keyboard__tabs">
        <text
          v-for="tab in tabs"
          :key="tab.mode"
          class="mq-keyboard__tab"
          :class="{ 'is-active': innerMode === tab.mode }"
          role="button"
          @touchend.stop.prevent="onTouchKey(`tab:${tab.mode}`)"
          @click.stop="onClickKey(`tab:${tab.mode}`)"
        >
          {{ tab.label }}
        </text>
      </view>
      <view class="mq-keyboard__rows">
        <view v-for="(row, rowIndex) in rows" :key="rowIndex" class="mq-keyboard__row">
          <text
            v-for="(key, keyIndex) in row"
            :key="`${rowIndex}-${keyIndex}`"
            class="mq-keyboard__key"
            :class="keyClass(key)"
            role="button"
            @touchend.stop.prevent="onTouchKey(key)"
            @click.stop="onClickKey(key)"
          >
            {{ keyLabel(key) }}
          </text>
        </view>
      </view>
      <text
        v-if="showConfirm"
        class="mq-keyboard__confirm"
        role="button"
        @touchend.stop.prevent="onTouchKey('confirm')"
        @click.stop="onClickKey('confirm')"
      >
        {{ confirmText }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { shuffleKeys } from '../../utils/model'
import type { MqKeyboardEmits, MqKeyboardMode, MqKeyboardProps } from './types'

defineOptions({
  name: 'mq-keyboard',
})

const props = withDefaults(defineProps<MqKeyboardProps>(), {
  visible: false,
  mode: 'abc',
  confirmText: '完成',
  showConfirm: false,
  randomOrder: false,
  maxlength: -1,
})

const emit = defineEmits<MqKeyboardEmits>()

type Key = string | MqKeyboardMode | 'tab:abc' | 'tab:num' | 'tab:symbol'

const LETTER_ROWS: string[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]
const NUMBER_ROWS: string[][] = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', '@', '.', ',', '?', '!'],
]
const SYMBOL_ROWS: string[][] = [
  ['+', '-', '*', '/', '=', '#', '@', '_'],
  ['(', ')', '[', ']', '{', '}', '<', '>'],
  ['!', '?', ':', ';', ',', '.', '"', "'"],
  ['￥', '%', '&', '^', '~', '|', '·'],
]

const tabs: Array<{ mode: MqKeyboardMode; label: string }> = [
  { mode: 'abc', label: '字母' },
  { mode: 'num', label: '数字' },
  { mode: 'symbol', label: '符号' },
]

const CONTROL_KEYS = new Set(['shift', 'delete', 'space', 'to-abc', 'to-num', 'to-symbol', 'back', 'confirm'])

const rendered = ref(false)
const opened = ref(false)
const innerMode = ref<MqKeyboardMode>(props.mode)
const upper = ref(false)
const lastTextMode = ref<MqKeyboardMode>(props.mode === 'num' ? 'num' : 'abc')
const typedCount = ref(0)
let lastTouchKey = ''
let lastTouchAt = 0

const rows = computed<Key[][]>(() => {
  const randomize = (list: string[]) => (props.randomOrder ? shuffleKeys(list) : [...list])
  if (innerMode.value === 'num') {
    return [...NUMBER_ROWS.map(randomize), ['to-abc', 'to-symbol', 'space', 'delete']]
  }
  if (innerMode.value === 'symbol') {
    return [...SYMBOL_ROWS.map(randomize), ['to-abc', 'to-num', 'back', 'delete']]
  }
  const letters = LETTER_ROWS.map(randomize)
  return [letters[0], letters[1], ['shift', ...letters[2], 'delete'], ['to-num', 'space', 'to-symbol']]
})

function keyLabel(key: Key): string {
  if (key.startsWith('tab:')) {
    const mode = key.slice(4) as MqKeyboardMode
    return tabs.find((tab) => tab.mode === mode)?.label ?? ''
  }
  const labels: Record<string, string> = {
    shift: 'Shift',
    delete: '删除',
    space: '空格',
    'to-abc': 'ABC',
    'to-num': '123',
    'to-symbol': '符号',
    back: '返回',
  }
  const label = labels[key]
  if (label) {
    return label
  }
  return innerMode.value === 'abc' && upper.value ? key.toUpperCase() : key
}

function keyClass(key: Key): Record<string, boolean> {
  return {
    'is-control': key.startsWith('tab:') || CONTROL_KEYS.has(key),
    'is-shift': key === 'shift',
    'is-active': key === 'shift' && upper.value,
  }
}

function setMode(mode: MqKeyboardMode) {
  if (innerMode.value === mode) {
    return
  }
  if (mode !== 'symbol') {
    lastTextMode.value = mode
  }
  innerMode.value = mode
  emit('change', mode)
}

function press(char: string) {
  if (props.maxlength >= 0 && typedCount.value >= props.maxlength) {
    return
  }
  typedCount.value += 1
  emit('input', char)
}

function requestClose() {
  emit('update:visible', false)
  emit('close')
}

function onKey(key: Key) {
  switch (key) {
    case 'shift':
      upper.value = !upper.value
      return
    case 'delete':
      if (typedCount.value > 0) {
        typedCount.value -= 1
      }
      emit('delete')
      return
    case 'space':
      press(' ')
      return
    case 'to-abc':
      setMode('abc')
      return
    case 'to-num':
      setMode('num')
      return
    case 'to-symbol':
      setMode('symbol')
      return
    case 'back':
      setMode(lastTextMode.value)
      return
    case 'confirm':
      emit('confirm')
      requestClose()
      return
    default:
      if (key.startsWith('tab:')) {
        setMode(key.slice(4) as MqKeyboardMode)
        return
      }
      press(keyLabel(key))
  }
}

function onTouchKey(key: Key) {
  lastTouchKey = key
  lastTouchAt = Date.now()
  onKey(key)
}

function onClickKey(key: Key) {
  // H5 上 touchend 之后还会补一次同键的 click，这里做去重，避免输入两次。
  if (key === lastTouchKey && Date.now() - lastTouchAt < 600) {
    return
  }
  onKey(key)
}

function onMask() {
  requestClose()
}

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      rendered.value = true
      typedCount.value = 0
      upper.value = false
      await nextTick()
      opened.value = true
      return
    }
    opened.value = false
    rendered.value = false
  },
  { immediate: true },
)

watch(
  () => props.mode,
  (mode) => {
    innerMode.value = mode
    if (mode !== 'symbol') {
      lastTextMode.value = mode
    }
  },
)
</script>

<style lang="scss">
@import './index.scss';
</style>
