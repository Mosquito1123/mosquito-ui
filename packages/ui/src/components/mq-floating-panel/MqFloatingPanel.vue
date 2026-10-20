<template>
  <view class="mq-floating-panel" :class="{ 'is-dragging': dragging, 'has-safe-area': safeArea }" :style="rootStyle">
    <view
      class="mq-floating-panel__header"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <view class="mq-floating-panel__bar" />
      <slot name="header" />
    </view>
    <scroll-view
      class="mq-floating-panel__content"
      scroll-y
      :show-scrollbar="showScrollbar"
      :scroll-top="scrollTop"
      @scroll="onScroll"
      @touchstart="onContentTouchStart"
      @touchmove="onContentTouchMove"
      @touchend="onContentTouchEnd"
      @touchcancel="onContentTouchEnd"
    >
      <slot />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { getUni } from '../../utils/platform'
import type { MqFloatingPanelEmits, MqFloatingPanelProps } from './types'

defineOptions({
  name: 'mq-floating-panel',
})

const props = withDefaults(defineProps<MqFloatingPanelProps>(), {
  height: undefined,
  anchors: () => [],
  duration: 300,
  contentDraggable: true,
  safeArea: false,
  showScrollbar: true,
})

const emit = defineEmits<MqFloatingPanelEmits>()

const windowHeight = (() => {
  try {
    const info = getUni()?.getSystemInfoSync?.()
    return Number(info?.windowHeight) || 667
  } catch {
    return 667
  }
})()

const anchors = computed(() => {
  const list = (props.anchors?.length ? props.anchors : [100, windowHeight * 0.6])
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0)
    .sort((a, b) => a - b)
  return list.length ? list : [100, windowHeight * 0.6]
})

const minAnchor = computed(() => anchors.value[0])
const maxAnchor = computed(() => anchors.value[anchors.value.length - 1])

function clampHeight(value: number): number {
  const min = minAnchor.value
  const max = maxAnchor.value
  const number = Number(value)
  if (!Number.isFinite(number)) {
    return min
  }
  return Math.min(max, Math.max(min, number))
}

const current = ref(clampHeight(props.height ?? anchors.value[0]))
const dragging = ref(false)
const scrollTop = ref(0)

let startY = 0
let startHeight = 0
let contentStartY = 0
let contentDragging = false
let snapTimer: ReturnType<typeof setTimeout> | undefined

const rootStyle = computed(() => ({
  height: `${current.value}px`,
  transitionDuration: dragging.value ? '0ms' : `${props.duration}ms`,
}))

watch(
  () => props.height,
  (value) => {
    if (value === undefined || dragging.value) {
      return
    }
    const next = clampHeight(value)
    if (next !== current.value) {
      current.value = next
    }
  },
)

function nearestAnchor(value: number): number {
  return anchors.value.reduce((best, item) =>
    Math.abs(item - value) < Math.abs(best - value) ? item : best,
  anchors.value[0])
}

function touchY(event: Event): number {
  const detail = event as Event & { touches?: Array<{ clientY?: number }>; changedTouches?: Array<{ clientY?: number }> }
  const touch = detail.touches?.[0] ?? detail.changedTouches?.[0]
  return Number(touch?.clientY) || 0
}

function beginDrag(event: Event) {
  startY = touchY(event)
  startHeight = current.value
  dragging.value = true
}

function moveDrag(event: Event) {
  if (!dragging.value) {
    return
  }
  const delta = startY - touchY(event)
  current.value = clampHeight(startHeight + delta)
}

function endDrag() {
  if (!dragging.value) {
    return
  }
  dragging.value = false
  const next = nearestAnchor(current.value)
  current.value = next
  emit('update:height', next)
  emit('heightChange', { height: next })
  if (snapTimer !== undefined) {
    clearTimeout(snapTimer)
  }
  snapTimer = setTimeout(() => {
    snapTimer = undefined
  }, props.duration)
}

function onTouchStart(event: Event) {
  beginDrag(event)
}

function onTouchMove(event: Event) {
  moveDrag(event)
}

function onTouchEnd() {
  endDrag()
}

function onScroll(event: Event) {
  const detail = (event as Event & { detail?: { scrollTop?: number } }).detail
  scrollTop.value = Number(detail?.scrollTop) || 0
}

function onContentTouchStart(event: Event) {
  if (!props.contentDraggable || scrollTop.value > 0) {
    return
  }
  contentDragging = true
  contentStartY = touchY(event)
  beginDrag(event)
}

function onContentTouchMove(event: Event) {
  if (!contentDragging) {
    return
  }
  const delta = contentStartY - touchY(event)
  if (delta < 0) {
    dragging.value = false
    contentDragging = false
    return
  }
  moveDrag(event)
}

function onContentTouchEnd() {
  contentDragging = false
  endDrag()
}

function moveTo(height: number) {
  current.value = nearestAnchor(clampHeight(height))
  emit('update:height', current.value)
}

onBeforeUnmount(() => {
  if (snapTimer !== undefined) {
    clearTimeout(snapTimer)
  }
})

defineExpose({
  moveTo,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
