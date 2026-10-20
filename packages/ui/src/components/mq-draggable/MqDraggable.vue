<template>
  <view class="mq-draggable" :class="{ 'is-disabled': disabled }">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="mq-draggable__item"
      :class="{ 'is-active': index === activeIndex }"
      :style="itemStyle(index)"
      @touchstart="onTouchStart($event, index)"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot :item="item" :index="index" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import { getUni } from '../../utils/platform'
import { draggableOffset, reorderList, resolveDragTarget } from '../../utils/draggable'
import type { MqDraggableEmits, MqDraggableProps } from './types'

defineOptions({
  name: 'mq-draggable',
})

const props = withDefaults(defineProps<MqDraggableProps<unknown>>(), {
  modelValue: () => [],
  disabled: false,
  longPress: false,
  duration: 200,
  threshold: 5,
})

const emit = defineEmits<MqDraggableEmits<unknown>>()
const instance = getCurrentInstance()

const list = computed(() => props.modelValue)
const activeIndex = ref<number | null>(null)
const targetIndex = ref(0)
const offset = ref(0)
const itemSize = ref(0)
const dragging = ref(false)

let startY = 0
let timer: ReturnType<typeof setTimeout> | undefined

const duration = computed(() => Math.max(0, Number(props.duration) || 0))

function clearTimer() {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

function reset() {
  clearTimer()
  dragging.value = false
  activeIndex.value = null
  targetIndex.value = 0
  offset.value = 0
}

function measure() {
  const api = getUni()
  if (!api?.createSelectorQuery) {
    return
  }
  api
    .createSelectorQuery()
    .in(instance?.proxy)
    .selectAll('.mq-draggable__item')
    .boundingClientRect((rects) => {
      if (!Array.isArray(rects) || !rects.length) {
        return
      }
      const tops = rects.map((rect) => Number(rect?.top) || 0)
      const gap = tops.length > 1 ? tops[1] - tops[0] : 0
      const size = gap > 0 ? gap : Number(rects[0]?.height) || 0
      if (size > 0) {
        itemSize.value = size
      }
    })
    .exec()
}

onMounted(() => {
  void nextTick(measure)
})

watch(
  () => props.modelValue.length,
  () => {
    void nextTick(measure)
  },
)

watch(
  () => props.disabled,
  (value) => {
    if (value) {
      reset()
    }
  },
)

function touchY(event: Event): number {
  const detail = event as Event & {
    touches?: Array<{ clientY?: number; pageY?: number }>
    changedTouches?: Array<{ clientY?: number; pageY?: number }>
  }
  const touch = detail.touches?.[0] ?? detail.changedTouches?.[0]
  return Number(touch?.clientY ?? touch?.pageY) || 0
}

function begin(index: number, y: number) {
  startY = y
  dragging.value = true
  activeIndex.value = index
  targetIndex.value = index
  offset.value = 0
  measure()
  emit('drag-start', { index })
}

function onTouchStart(event: Event, index: number) {
  if (props.disabled || props.modelValue.length < 2) {
    return
  }
  const y = touchY(event)
  clearTimer()
  if (props.longPress) {
    timer = setTimeout(() => {
      timer = undefined
      begin(index, y)
    }, 300)
    return
  }
  begin(index, y)
}

function onTouchMove(event: Event) {
  if (!dragging.value || activeIndex.value === null) {
    clearTimer()
    return
  }
  const distance = touchY(event) - startY
  const threshold = Math.max(0, Number(props.threshold) || 0)
  if (offset.value === 0 && Math.abs(distance) < threshold) {
    return
  }
  offset.value = distance
  targetIndex.value = resolveDragTarget(
    activeIndex.value,
    distance,
    itemSize.value,
    props.modelValue.length,
  )
}

function onTouchEnd() {
  if (!dragging.value || activeIndex.value === null) {
    reset()
    return
  }
  const from = activeIndex.value
  const to = targetIndex.value
  reset()
  if (from === to) {
    emit('drag-end', { index: from, to })
    return
  }
  const value = reorderList(props.modelValue, from, to)
  emit('update:modelValue', value)
  emit('change', { from, to, value })
  emit('drag-end', { index: from, to })
}

function itemStyle(index: number): Record<string, string> | undefined {
  if (activeIndex.value === null) {
    return undefined
  }
  const style: Record<string, string> = {}
  if (index === activeIndex.value) {
    style.transform = `translateY(${offset.value}px)`
    style.transition = 'none'
    style.zIndex = '2'
    return style
  }
  const shift = draggableOffset(
    activeIndex.value,
    targetIndex.value,
    index,
    itemSize.value,
  )
  if (!shift) {
    return undefined
  }
  style.transform = `translateY(${shift}px)`
  style.transitionDuration = `${duration.value}ms`
  return style
}

defineExpose({
  measure,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
