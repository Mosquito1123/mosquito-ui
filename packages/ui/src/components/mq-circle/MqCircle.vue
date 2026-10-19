<template>
  <view class="mq-circle" :style="rootStyle" role="progressbar" :aria-valuenow="display" aria-valuemin="0" aria-valuemax="100">
    <svg class="mq-circle__svg" :class="{ 'is-reverse': !clockwise }" :viewBox="`0 0 ${size} ${size}`">
      <circle
        class="mq-circle__layer"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="layerColor"
        :stroke-width="strokeWidth"
        :fill="fill || 'none'"
      />
      <circle
        class="mq-circle__hover"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        :stroke-linecap="strokeLinecap"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        fill="none"
      />
    </svg>
    <view class="mq-circle__text">
      <slot v-if="!text">{{ Math.round(display) }}%</slot>
      <text v-else>{{ text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { clampPercent } from '../../utils/model'
import type { MqCircleProps } from './types'

defineOptions({
  name: 'mq-circle',
})

const props = withDefaults(defineProps<MqCircleProps>(), {
  modelValue: 0,
  size: 120,
  color: '',
  layerColor: '',
  fill: '',
  speed: 50,
  text: '',
  strokeWidth: 10,
  strokeLinecap: 'round',
  clockwise: true,
})

const display = ref(0)
let raf: number | undefined

const size = computed(() => (Number.isFinite(props.size) && props.size > 0 ? props.size : 120))
const strokeWidth = computed(() =>
  Number.isFinite(props.strokeWidth) && props.strokeWidth > 0 ? props.strokeWidth : 10,
)
const center = computed(() => size.value / 2)
const radius = computed(() => Math.max(0, (size.value - strokeWidth.value) / 2))
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value * (1 - display.value / 100))

const strokeColor = computed(() => {
  if (typeof props.color === 'string' && props.color.trim()) {
    return props.color.trim()
  }
  if (props.color && typeof props.color === 'object') {
    const values = Object.values(props.color)
    return values[values.length - 1] || 'var(--mq-color-primary, #0f3d32)'
  }
  return 'var(--mq-color-primary, #0f3d32)'
})

const layerColor = computed(() =>
  props.layerColor.trim() ? props.layerColor.trim() : 'var(--mq-bg-active, #ebe4d8)',
)

const rootStyle = computed(() => ({
  width: `${size.value}px`,
  height: `${size.value}px`,
}))

function clearRaf() {
  if (raf !== undefined && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(raf)
    raf = undefined
  }
}

function animateTo(target: number) {
  const next = clampPercent(target)
  const speed = Number.isFinite(props.speed) ? Math.max(0, props.speed) : 50
  if (speed <= 0 || typeof requestAnimationFrame !== 'function') {
    display.value = next
    return
  }
  clearRaf()
  const start = display.value
  const delta = next - start
  if (Math.abs(delta) < 0.01) {
    display.value = next
    return
  }
  const duration = (Math.abs(delta) / speed) * 1000
  const began = Date.now()
  const step = () => {
    const progress = Math.min(1, (Date.now() - began) / duration)
    display.value = start + delta * progress
    if (progress < 1) {
      raf = requestAnimationFrame(step)
      return
    }
    display.value = next
    raf = undefined
  }
  raf = requestAnimationFrame(step)
}

watch(
  () => props.modelValue,
  (value) => {
    animateTo(value)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearRaf()
})
</script>

<style lang="scss">
@import './index.scss';
</style>
