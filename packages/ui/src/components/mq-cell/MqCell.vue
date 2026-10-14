<template>
  <view
    class="mq-cell"
    :class="{ 'is-link': isLink, 'is-disabled': disabled }"
    :hover-class="interactive ? 'mq-cell--pressed' : 'none'"
    :role="isLink ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="onClick"
    @keydown.enter.prevent="onKeyActivate"
    @keydown.space.prevent="onKeyActivate"
  >
    <text class="mq-cell__title">{{ title }}</text>
    <text v-if="showValue" class="mq-cell__value">{{ value }}</text>
    <text v-if="isLink" class="mq-cell__arrow" aria-hidden="true">›</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqCellEmits, MqCellProps } from './types'

defineOptions({
  name: 'mq-cell',
})

const props = withDefaults(defineProps<MqCellProps>(), {
  title: '',
  isLink: false,
  disabled: false,
})

const emit = defineEmits<MqCellEmits>()

const interactive = computed(() => props.isLink && !props.disabled)

const showValue = computed(() => {
  const value = props.value
  if (value == null) {
    return false
  }
  if (typeof value === 'number') {
    return Number.isFinite(value)
  }
  return value !== ''
})

function onClick(event: Event) {
  if (props.disabled) {
    return
  }
  emit('click', event)
}

function onKeyActivate(event: Event) {
  if (!interactive.value) {
    return
  }
  onClick(event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
