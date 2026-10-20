<template>
  <view v-if="rendered" class="mq-number-keyboard" :class="{ 'is-open': opened }">
    <view v-if="title || closeText" class="mq-number-keyboard__title">
      <text>{{ title }}</text>
      <text v-if="closeText" class="mq-number-keyboard__close" @click.stop="onClose">{{ closeText }}</text>
    </view>
    <view class="mq-number-keyboard__body">
      <view class="mq-number-keyboard__keys">
        <text
          v-for="key in keys"
          :key="key"
          class="mq-number-keyboard__key"
          :class="{ 'is-muted': key === 'delete' || key === extraKey }"
          @click.stop="onKey(key)"
        >
          {{ key === 'delete' ? '删除' : key }}
        </text>
      </view>
      <view v-if="mode === 'custom'" class="mq-number-keyboard__side">
        <text class="mq-number-keyboard__key is-muted" @click.stop="onKey('delete')">删除</text>
        <text class="mq-number-keyboard__key is-primary" @click.stop="onClose">{{ closeText || '完成' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { shuffleKeys } from '../../utils/model'
import type { MqNumberKeyboardEmits, MqNumberKeyboardProps } from './types'

defineOptions({
  name: 'mq-number-keyboard',
})

const props = withDefaults(defineProps<MqNumberKeyboardProps>(), {
  modelValue: '',
  visible: false,
  mode: 'default',
  extraKey: '',
  closeText: '',
  maxlength: -1,
  randomKeyOrder: false,
  title: '',
})

const emit = defineEmits<MqNumberKeyboardEmits>()

const rendered = ref(false)
const opened = ref(false)
let leaveTimer: ReturnType<typeof setTimeout> | undefined

const keys = computed(() => {
  const digits = props.randomKeyOrder ? shuffleKeys(['1', '2', '3', '4', '5', '6', '7', '8', '9']) : ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  if (props.mode === 'custom') {
    return [...digits, props.extraKey || '.', '0', '']
  }
  return [...digits, props.extraKey || '', '0', 'delete']
})

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      if (leaveTimer) {
        clearTimeout(leaveTimer)
        leaveTimer = undefined
      }
      rendered.value = true
      await nextTick()
      opened.value = true
      return
    }
    opened.value = false
    if (!rendered.value) {
      return
    }
    leaveTimer = setTimeout(() => {
      rendered.value = false
      leaveTimer = undefined
    }, 200)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (leaveTimer) {
    clearTimeout(leaveTimer)
  }
})

function onKey(key: string) {
  if (!key) {
    return
  }
  if (key === 'delete') {
    const next = String(props.modelValue || '').slice(0, -1)
    emit('update:modelValue', next)
    emit('delete')
    return
  }
  const current = String(props.modelValue || '')
  if (props.maxlength >= 0 && current.length >= props.maxlength) {
    return
  }
  const next = `${current}${key}`
  emit('update:modelValue', next)
  emit('input', key)
}

function onClose() {
  emit('update:visible', false)
  emit('close')
}
</script>

<style lang="scss">
@import './index.scss';
</style>
