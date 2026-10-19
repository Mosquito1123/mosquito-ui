<template>
  <view class="mq-badge">
    <slot />
    <text v-if="dotVisible" class="mq-badge__dot" :class="markClass" :style="markStyle" />
    <text v-else-if="label" class="mq-badge__value" :class="markClass" :style="markStyle">{{ label }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatBadge } from '../../utils/model'
import type { MqBadgeProps } from './types'

defineOptions({
  name: 'mq-badge',
})

const props = withDefaults(defineProps<MqBadgeProps>(), {
  isDot: false,
  showZero: false,
  hidden: false,
  type: 'danger',
  bgColor: '',
  shape: 'circle',
  border: false,
})

const label = computed(() => {
  if (props.hidden || props.isDot) {
    return null
  }
  return formatBadge(props.value, { max: props.max, showZero: props.showZero })
})

const dotVisible = computed(() => props.isDot && !props.hidden)

const markClass = computed(() => [
  `mq-badge--${props.type}`,
  `mq-badge--${props.shape}`,
  { 'has-border': props.border },
])

const markStyle = computed(() => {
  if (!props.bgColor) {
    return undefined
  }
  return { backgroundColor: props.bgColor }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
