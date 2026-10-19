<template>
  <view class="mq-swipe" :class="{ 'is-disabled': disabled }">
    <view
      class="mq-swipe__track"
      :class="{ 'is-dragging': dragging }"
      :style="trackStyle"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @click.stop="onContentClick"
    >
      <view v-if="slots.left" class="mq-swipe__left" @click.stop="onSideClick('left')">
        <slot name="left" />
      </view>
      <view class="mq-swipe__content">
        <slot />
      </view>
      <view v-if="slots.right" class="mq-swipe__right" @click.stop="onSideClick('right')">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { registerSwipeAction } from '../../utils/swipe'
import type {
  MqSwipeActionEmits,
  MqSwipeActionPosition,
  MqSwipeActionProps,
  MqSwipeActionReason,
  MqSwipeActionStatus,
} from './types'

defineOptions({
  name: 'mq-swipe-action',
})

const props = withDefaults(defineProps<MqSwipeActionProps>(), {
  modelValue: 'close',
  disabled: false,
  leftWidth: 0,
  rightWidth: 0,
})

const emit = defineEmits<MqSwipeActionEmits>()
const slots = useSlots()

const offset = ref(0)
const dragging = ref(false)
const startX = ref(0)
const startOffset = ref(0)

const leftSize = computed(() => {
  if (Number.isFinite(props.leftWidth) && props.leftWidth > 0) {
    return props.leftWidth
  }
  return slots.left ? 76 : 0
})

const rightSize = computed(() => {
  if (Number.isFinite(props.rightWidth) && props.rightWidth > 0) {
    return props.rightWidth
  }
  return slots.right ? 76 : 0
})

const trackStyle = computed(() => ({
  transform: `translate3d(${offset.value}px, 0, 0)`,
}))

function statusFromOffset(value: number): MqSwipeActionStatus {
  if (value > leftSize.value / 2) {
    return 'left'
  }
  if (value < -rightSize.value / 2) {
    return 'right'
  }
  return 'close'
}

function offsetFromStatus(status: MqSwipeActionStatus): number {
  if (status === 'left') {
    return leftSize.value
  }
  if (status === 'right') {
    return -rightSize.value
  }
  return 0
}

async function canClose(reason: MqSwipeActionReason, position: MqSwipeActionPosition) {
  if (!props.beforeClose) {
    return true
  }
  try {
    const ok = await props.beforeClose(reason, position)
    return ok !== false
  } catch {
    return false
  }
}

async function setStatus(
  status: MqSwipeActionStatus,
  reason: MqSwipeActionReason,
  position: MqSwipeActionPosition = 'inside',
) {
  if (props.disabled) {
    return false
  }
  if (status === 'close' && props.modelValue !== 'close') {
    const ok = await canClose(reason, position)
    if (!ok) {
      offset.value = offsetFromStatus(props.modelValue)
      return false
    }
  }
  offset.value = offsetFromStatus(status)
  if (status !== props.modelValue) {
    emit('update:modelValue', status)
  }
  return true
}

function onTouchStart(event: TouchEvent) {
  if (props.disabled) {
    return
  }
  const touch = event.touches?.[0]
  if (!touch) {
    return
  }
  dragging.value = true
  startX.value = touch.clientX
  startOffset.value = offset.value
}

function onTouchMove(event: TouchEvent) {
  if (!dragging.value || props.disabled) {
    return
  }
  const touch = event.touches?.[0]
  if (!touch) {
    return
  }
  const delta = touch.clientX - startX.value
  const next = startOffset.value + delta
  const min = -rightSize.value
  const max = leftSize.value
  offset.value = Math.min(max, Math.max(min, next))
}

async function onTouchEnd() {
  if (!dragging.value) {
    return
  }
  dragging.value = false
  const next = statusFromOffset(offset.value)
  await setStatus(next, 'swipe', next === 'close' ? 'inside' : next)
}

async function onContentClick() {
  if (props.disabled || props.modelValue === 'close') {
    return
  }
  const closed = await setStatus('close', 'click', 'inside')
  if (closed) {
    emit('click', 'inside')
  }
}

async function onSideClick(position: 'left' | 'right') {
  if (props.disabled) {
    return
  }
  const closed = await setStatus('close', 'click', position)
  if (closed) {
    emit('click', position)
  }
}

async function close(reason: MqSwipeActionReason = 'value', position: MqSwipeActionPosition = 'inside') {
  await setStatus('close', reason, position)
}

watch(
  () => props.modelValue,
  (status) => {
    if (dragging.value) {
      return
    }
    offset.value = offsetFromStatus(status)
  },
  { immediate: true },
)

let unregister: (() => void) | undefined

onMounted(() => {
  unregister = registerSwipeAction(() => {
    if (props.modelValue === 'close') {
      return
    }
    void setStatus('close', 'value', 'inside')
  })
})

onBeforeUnmount(() => {
  unregister?.()
})

defineExpose({
  close,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
