<template>
  <view
    class="mq-textarea"
    :class="{
      'is-disabled': disabled,
      'is-error': error,
      'is-compact': compact,
    }"
  >
    <textarea
      class="mq-textarea__control"
      :value="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength >= 0 ? maxlength : -1"
      :auto-height="autoHeight"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    />
    <view v-if="showClear || showCount" class="mq-textarea__bar">
      <text v-if="showClear" class="mq-textarea__clear" @click.stop="onClear">×</text>
      <text v-if="showCount" class="mq-textarea__count">{{ text.length }}/{{ maxlength }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqTextareaEmits, MqTextareaProps } from './types'

defineOptions({
  name: 'mq-textarea',
})

const props = withDefaults(defineProps<MqTextareaProps>(), {
  modelValue: '',
  placeholder: '',
  maxlength: -1,
  disabled: false,
  readonly: false,
  clearable: false,
  showWordLimit: false,
  error: false,
  compact: false,
  autoHeight: false,
})

const emit = defineEmits<MqTextareaEmits>()

const text = computed(() => (props.modelValue == null ? '' : String(props.modelValue)))
const showClear = computed(() => props.clearable && !props.disabled && !props.readonly && text.value !== '')
const showCount = computed(() => props.showWordLimit && props.maxlength >= 0)

function readValue(event: Event): string {
  const detail = (event as Event & { detail?: { value?: string | number } }).detail
  if (detail && detail.value != null) {
    return String(detail.value)
  }
  const target = event.target as { value?: string } | null
  return target?.value ?? ''
}

function publish(value: string, kind: 'input' | 'focus' | 'blur' | 'confirm') {
  if (kind === 'input') {
    emit('update:modelValue', value)
    emit('input', { value })
    return
  }
  if (kind === 'focus') {
    emit('focus', { value })
    return
  }
  if (kind === 'blur') {
    emit('blur', { value })
  } else {
    emit('confirm', { value })
  }
}

function onInput(event: Event) {
  if (props.disabled || props.readonly) {
    return
  }
  publish(readValue(event), 'input')
}

function onFocus(event: Event) {
  publish(readValue(event) || text.value, 'focus')
}

function onBlur(event: Event) {
  publish(readValue(event) || text.value, 'blur')
}

function onConfirm(event: Event) {
  publish(readValue(event) || text.value, 'confirm')
}

function onClear() {
  if (!showClear.value) {
    return
  }
  emit('update:modelValue', '')
  emit('clear')
  emit('input', { value: '' })
}
</script>

<style lang="scss">
@import './index.scss';
</style>
