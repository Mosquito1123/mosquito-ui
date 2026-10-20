<template>
  <view
    class="mq-slide-verify"
    :class="{ 'is-verified': innerVerified, 'is-disabled': disabled }"
    :style="rootStyle"
  >
    <view class="mq-slide-verify__track">
      <view class="mq-slide-verify__fill" :style="fillStyle" />
      <text class="mq-slide-verify__text">{{ innerVerified ? successText : text }}</text>
      <view
        class="mq-slide-verify__handle"
        :style="handleStyle"
        role="slider"
        :aria-valuenow="Math.round(progress * 100)"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-disabled="disabled ? 'true' : 'false'"
        @touchstart="onTouchStart"
        @touchmove.stop.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <text class="mq-slide-verify__handle-mark">{{ innerVerified ? '✓' : '→' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import { getUni } from '../../utils/platform'
import { clampSlideDistance, settleSlideDistance, slideProgress } from '../../utils/slide-verify'
import type { MqSlideVerifyEmits, MqSlideVerifyProps } from './types'

defineOptions({
  name: 'mq-slide-verify',
})

const props = withDefaults(defineProps<MqSlideVerifyProps>(), {
  modelValue: false,
  text: '按住滑块，拖动到最右侧',
  successText: '验证通过',
  disabled: false,
  threshold: 0.9,
  height: 44,
})

const emit = defineEmits<MqSlideVerifyEmits>()
const instance = getCurrentInstance()

const height = computed(() => {
  const value = Number(props.height)
  return Number.isFinite(value) && value >= 32 ? Math.min(72, value) : 44
})

const trackWidth = ref(0)
const innerVerified = ref(Boolean(props.modelValue))
const distance = ref(0)
const dragging = ref(false)

const maxDistance = computed(() => Math.max(0, trackWidth.value - height.value))

const progress = computed(() => slideProgress(distance.value, maxDistance.value))

const rootStyle = computed(() => ({
  height: `${height.value}px`,
}))

const fillStyle = computed(() => ({
  width: `${Math.min(trackWidth.value, distance.value + height.value)}px`,
}))

const handleStyle = computed(() => ({
  width: `${height.value}px`,
  height: `${height.value}px`,
  transform: `translateX(${distance.value}px)`,
}))

let startX = 0
let startDistance = 0

function measure() {
  const api = getUni()
  if (!api?.createSelectorQuery) {
    return
  }
  api
    .createSelectorQuery()
    .in(instance?.proxy)
    .select('.mq-slide-verify__track')
    .boundingClientRect((rect) => {
      trackWidth.value = Number(rect?.width) || 0
    })
    .exec()
}

onMounted(() => {
  void nextTick(measure)
})

watch(
  () => props.modelValue,
  (value) => {
    innerVerified.value = Boolean(value)
    if (innerVerified.value) {
      distance.value = maxDistance.value
    } else if (!dragging.value) {
      distance.value = 0
    }
  },
)

watch(maxDistance, (value) => {
  if (innerVerified.value) {
    distance.value = value
  }
})

function touchX(event: Event): number {
  const detail = event as Event & {
    touches?: Array<{ clientX?: number; pageX?: number }>
    changedTouches?: Array<{ clientX?: number; pageX?: number }>
  }
  const touch = detail.touches?.[0] ?? detail.changedTouches?.[0]
  return Number(touch?.clientX ?? touch?.pageX) || 0
}

function onTouchStart(event: Event) {
  if (props.disabled || innerVerified.value) {
    return
  }
  startX = touchX(event)
  startDistance = distance.value
  dragging.value = true
}

function onTouchMove(event: Event) {
  if (!dragging.value) {
    return
  }
  distance.value = clampSlideDistance(startDistance + touchX(event) - startX, maxDistance.value)
}

function onTouchEnd() {
  if (!dragging.value) {
    return
  }
  dragging.value = false
  const settled = settleSlideDistance(distance.value, maxDistance.value, props.threshold)
  distance.value = settled.distance
  if (settled.passed) {
    innerVerified.value = true
    emit('update:modelValue', true)
    emit('change', { verified: true })
    emit('success')
    return
  }
  emit('fail')
}

function reset() {
  dragging.value = false
  distance.value = 0
  innerVerified.value = false
  emit('update:modelValue', false)
  emit('change', { verified: false })
}

defineExpose({
  reset,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
