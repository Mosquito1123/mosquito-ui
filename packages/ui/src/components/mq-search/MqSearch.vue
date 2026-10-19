<template>
  <view class="mq-search" :class="{ 'is-disabled': disabled }" role="search">
    <input
      class="mq-search__control"
      type="text"
      confirm-type="search"
      :value="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength >= 0 ? maxlength : -1"
      @input="onInput"
      @confirm="onSearch"
    />
    <text v-if="showClear" class="mq-search__clear" @click.stop="onClear">×</text>
    <text v-if="label" class="mq-search__action" @click.stop="onSearch">{{ label }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqSearchEmits, MqSearchProps } from './types'

defineOptions({
  name: 'mq-search',
})

const props = withDefaults(defineProps<MqSearchProps>(), {
  modelValue: '',
  placeholder: '搜索',
  disabled: false,
  maxlength: -1,
  clearable: false,
  actionText: '搜索',
})

const emit = defineEmits<MqSearchEmits>()

const text = computed(() => (props.modelValue == null ? '' : String(props.modelValue)))
const label = computed(() => props.actionText.trim())
const showClear = computed(() => props.clearable && !props.disabled && text.value !== '')

function readValue(event: Event): string {
  const detail = (event as Event & { detail?: { value?: string | number } }).detail
  if (detail && detail.value != null) {
    return String(detail.value)
  }
  const target = event.target as { value?: string } | null
  return target?.value ?? text.value
}

function onInput(event: Event) {
  if (props.disabled) {
    return
  }
  const value = readValue(event)
  emit('update:modelValue', value)
  emit('input', { value })
}

function onSearch() {
  if (props.disabled) {
    return
  }
  emit('search', { value: text.value })
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
