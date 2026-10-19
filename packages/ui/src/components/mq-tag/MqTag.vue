<template>
  <view class="mq-tag" :class="rootClass" :style="rootStyle">
    <text class="mq-tag__text"><slot /></text>
    <text v-if="closable" class="mq-tag__close" aria-hidden="true" @click.stop="onClose">×</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
  color: '',
  bgColor: '',
})

const emit = defineEmits<MqTagEmits>()

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

function onClose(event: Event) {
  emit('close', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
