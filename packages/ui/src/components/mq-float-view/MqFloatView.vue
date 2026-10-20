<template>
  <view
    class="mq-float-view"
    :class="{ 'is-dragging': dragging }"
    :style="rootStyle"
    @touchstart="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @click="onClick"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getUni } from '../../utils/platform'
import type { MqFloatViewEmits, MqFloatViewProps } from './types'

defineOptions({
  name: 'mq-float-view',
})

const props = withDefaults(defineProps<MqFloatViewProps>(), {
  x: 0,
  y: 0,
  width: 56,
  height: 56,
  draggable: true,
  zIndex: 60,
})

const emit = defineEmits<MqFloatViewEmits>()

const windowSize = (() => {
  try {
    const info = getUni()?.getSystemInfoSync?.()
    return {
      width: Number(info?.windowWidth) || 375,
      height: Number(info?.windowHeight) || 667,
    }
  } catch {
    return { width: 375, height: 667 }
  }
})()

const size = computed(() => ({
  width: Math.max(0, Number(props.width) || 0),
  height: Math.max(0, Number(props.height) || 0),
}))

function clamp(value: number, max: number): number {
  const number = Number.isFinite(value) ? value : 0
  return Math.min(Math.max(0, max), Math.max(0, number))
}

const posX = ref(clamp(props.x, windowSize.width - size.value.width))
const posY = ref(clamp(props.y, windowSize.height - size.value.height))
const dragging = ref(false)

const rootStyle = computed(() => ({
  width: `${size.value.width}px`,
  height: `${size.value.height}px`,
  zIndex: String(props.zIndex),
  transform: `translate3d(${posX.value}px, ${posY.value}px, 0)`,
}))

watch(
  () => props.x,
  (value) => {
    if (!dragging.value) {
      posX.value = clamp(value, windowSize.width - size.value.width)
    }
  },
)

watch(
  () => props.y,
  (value) => {
    if (!dragging.value) {
      posY.value = clamp(value, windowSize.height - size.value.height)
    }
  },
)

let startX = 0
let startY = 0
let originX = 0
let originY = 0
let moved = false

function touchPoint(event: Event): { x: number; y: number } {
  const detail = event as Event & {
    touches?: Array<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>
    changedTouches?: Array<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>
  }
  const touch = detail.touches?.[0] ?? detail.changedTouches?.[0]
  return {
    x: Number(touch?.clientX ?? touch?.pageX) || 0,
    y: Number(touch?.clientY ?? touch?.pageY) || 0,
  }
}

function onTouchStart(event: Event) {
  if (!props.draggable) {
    return
  }
  const point = touchPoint(event)
  startX = point.x
  startY = point.y
  originX = posX.value
  originY = posY.value
  moved = false
  dragging.value = true
}

function onTouchMove(event: Event) {
  if (!dragging.value) {
    return
  }
  const point = touchPoint(event)
  const deltaX = point.x - startX
  const deltaY = point.y - startY
  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
    moved = true
  }
  posX.value = clamp(originX + deltaX, windowSize.width - size.value.width)
  posY.value = clamp(originY + deltaY, windowSize.height - size.value.height)
}

function onTouchEnd() {
  if (!dragging.value) {
    return
  }
  dragging.value = false
  if (!moved) {
    return
  }
  emit('update:x', posX.value)
  emit('update:y', posY.value)
  emit('move-end', { x: posX.value, y: posY.value })
}

function onClick() {
  if (!moved) {
    emit('click')
  }
  moved = false
}

function reset() {
  posX.value = clamp(props.x, windowSize.width - size.value.width)
  posY.value = clamp(props.y, windowSize.height - size.value.height)
  emit('update:x', posX.value)
  emit('update:y', posY.value)
}

defineExpose({
  reset,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
