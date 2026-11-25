<template>
  <view class="mq-tag" :class="rootClass" :style="rootStyle" @click="onClick">
    <input
      v-if="dynamic"
      class="mq-tag__input"
      :value="inputValue"
      :disabled="disabled"
      @input="onInput"
      @confirm="onConfirm"
      @keydown.enter="onConfirm"
    />
    <text v-else class="mq-tag__text"><slot /></text>
    <text v-if="closable" class="mq-tag__close" aria-hidden="true" @click.stop="onClose">×</text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MqTagEmits, MqTagProps } from './types'

defineOptions({
  name: 'mq-tag',
})

const props = withDefaults(defineProps<MqTagProps>(), {
  type: 'default',
  variant: 'base',
  size: 'medium',
  round: false,
  closable: false,
  disabled: false,
  dynamic: false,
  color: '',
  bgColor: '',
})

const emit = defineEmits<MqTagEmits>()

const inputValue = ref('')

const rootClass = computed(() => [
  `mq-tag--${props.type}`,
  `mq-tag--${props.variant}`,
  `mq-tag--${props.size}`,
  { 'mq-tag--round': props.round },
])

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color) {
    style.color = props.color
  }
  if (props.bgColor) {
    style.borderColor = props.bgColor
    if (props.variant === 'base') {
      style.backgroundColor = props.bgColor
    }
  }
  return style
})

function onClick(event: MouseEvent) {
  if (props.disabled) {
    return
  }
  emit('click', event)
}

function onInput(event?: Event) {
  const target = event?.target as HTMLInputElement | null
  inputValue.value = typeof target?.value === 'string' ? target.value : ''
}

function onConfirm(event?: Event) {
  const detail = (event as CustomEvent<{ value?: string }> | undefined)?.detail?.value
  const target = event?.target as HTMLInputElement | null
  const value =
    typeof detail === 'string' ? detail : typeof target?.value === 'string' ? target.value : inputValue.value
  emit('confirm', { value })
}

function onClose(event: Event) {
  emit('close', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
