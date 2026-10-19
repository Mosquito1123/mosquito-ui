<template>
  <view
    class="mq-input"
    :class="{
      'is-disabled': disabled,
      'is-error': error,
      'is-align-right': alignRight,
      'is-compact': compact,
    }"
  >
    <input
      class="mq-input__control"
      :type="controlType"
      :value="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength >= 0 ? maxlength : -1"
      :confirm-type="confirmType"
      :password="passwordHidden"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    />
    <text v-if="showClear" class="mq-input__clear" @click.stop="onClear">×</text>
    <text v-if="showPassword" class="mq-input__toggle" @click.stop="onTogglePassword">
      {{ revealed ? '隐藏' : '显示' }}
    </text>
    <text v-if="showCount" class="mq-input__count">{{ text.length }}/{{ maxlength }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MqInputEmits, MqInputProps } from './types'

defineOptions({
  name: 'mq-input',
})

const props = withDefaults(defineProps<MqInputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  maxlength: -1,
  disabled: false,
  readonly: false,
  clearable: false,
  showPassword: false,
  showWordLimit: false,
  error: false,
  alignRight: false,
  compact: false,
  confirmType: 'done',
})

const emit = defineEmits<MqInputEmits>()
const revealed = ref(false)

const text = computed(() => (props.modelValue == null ? '' : String(props.modelValue)))
const passwordHidden = computed(() => props.showPassword && !revealed.value)
const controlType = computed(() => (passwordHidden.value ? 'password' : props.type))
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

function onTogglePassword() {
  revealed.value = !revealed.value
}
</script>

<style lang="scss">
@import './index.scss';
</style>
