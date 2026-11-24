<template>
  <view v-if="isVisible" class="mq-tour" :class="{ 'is-plain': !overlay }" @click="onMask">
    <view v-if="highlight" class="mq-tour__highlight" :style="highlightStyle" @click.stop />
    <view class="mq-tour__card" :style="cardStyle" @click.stop>
      <text v-if="step.title" class="mq-tour__title">{{ step.title }}</text>
      <text v-if="step.content" class="mq-tour__content">{{ step.content }}</text>
      <view class="mq-tour__footer">
        <text class="mq-tour__skip" role="button" @click="onSkip">跳过</text>
        <view class="mq-tour__nav">
          <text v-if="innerCurrent > 0" class="mq-tour__button is-prev" role="button" @click="onPrev">
            {{ prevText }}
          </text>
          <text class="mq-tour__button is-next" role="button" @click="onNextOrDone">
            {{ isLast ? doneText : nextText }}
          </text>
        </view>
      </view>
      <text class="mq-tour__progress">{{ innerCurrent + 1 }}/{{ steps.length }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { MqTourChangePayload, MqTourEmits, MqTourProps, MqTourStep } from './types'

defineOptions({
  name: 'mq-tour',
})

const props = withDefaults(defineProps<MqTourProps>(), {
  steps: () => [],
  visible: false,
  show: false,
  current: 0,
  nextText: '下一步',
  prevText: '上一步',
  doneText: '完成',
  overlay: true,
  maskClosable: false,
})

const emit = defineEmits<MqTourEmits>()

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

function windowSize(): { width: number; height: number } {
  try {
    const api = (globalThis as { uni?: { getSystemInfoSync?: () => Record<string, unknown> } }).uni
    const info = api?.getSystemInfoSync?.()
    return {
      width: Number(info?.windowWidth) || 375,
      height: Number(info?.windowHeight) || 667,
    }
  } catch {
    return { width: 375, height: 667 }
  }
}

function clampIndex(value: number): number {
  const total = props.steps.length
  if (total <= 0) {
    return 0
  }
  const index = Math.floor(Number(value))
  if (!Number.isFinite(index)) {
    return 0
  }
  return Math.min(total - 1, Math.max(0, index))
}

const isVisible = computed(() => props.visible || props.show)
const innerCurrent = ref(clampIndex(props.current))
const rect = ref<Rect | null>(null)
const step = computed<MqTourStep>(() => props.steps[innerCurrent.value] ?? {})
const isLast = computed(() => innerCurrent.value >= Math.max(0, props.steps.length - 1))
const highlight = computed(() => rect.value !== null)

const highlightStyle = computed<Record<string, string>>(() => {
  const current = rect.value
  if (!current) {
    return {}
  }
  const pad = 4
  const style: Record<string, string> = {
    left: `${Math.max(0, current.left - pad)}px`,
    top: `${Math.max(0, current.top - pad)}px`,
    width: `${current.width + pad * 2}px`,
    height: `${current.height + pad * 2}px`,
  }
  return style
})

const cardStyle = computed<Record<string, string>>(() => {
  const current = rect.value
  if (!current) {
    return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
  }
  const size = windowSize()
  const gap = 10
  const clamp = (value: number, max: number) => Math.min(Math.max(0, value), Math.max(0, max))
  const placement = step.value.placement || 'bottom'
  const style: Record<string, string> = {}
  if (placement === 'top') {
    style.left = `${clamp(current.left, size.width - 120)}px`
    style.bottom = `${clamp(size.height - current.top + gap, size.height)}px`
  } else if (placement === 'left') {
    style.right = `${clamp(size.width - current.left + gap, size.width)}px`
    style.top = `${clamp(current.top, size.height - 100)}px`
  } else if (placement === 'right') {
    style.left = `${clamp(current.left + current.width + gap, size.width - 120)}px`
    style.top = `${clamp(current.top, size.height - 100)}px`
  } else {
    style.left = `${clamp(current.left, size.width - 120)}px`
    style.top = `${clamp(current.top + current.height + gap, size.height - 100)}px`
  }
  return style
})

function measure() {
  const target = step.value.target
  if (!target) {
    rect.value = null
    return
  }
  const uniApi = (globalThis as { uni?: { createSelectorQuery?: () => unknown } }).uni
  if (typeof uniApi?.createSelectorQuery !== 'function') {
    rect.value = null
    return
  }
  try {
    interface RectQuery {
      select: (selector: string) => RectQuery | null | undefined
      boundingClientRect: (callback: (result?: unknown) => void) => RectQuery
      exec: () => void
    }
    const query = uniApi.createSelectorQuery() as Partial<RectQuery> | null
    if (
      !query ||
      typeof query.select !== 'function' ||
      typeof query.boundingClientRect !== 'function' ||
      typeof query.exec !== 'function'
    ) {
      rect.value = null
      return
    }
    const selected = query.select(target)
    if (!selected || typeof selected.boundingClientRect !== 'function') {
      rect.value = null
      return
    }
    selected.boundingClientRect((result) => {
      const item = Array.isArray(result) ? result[0] : result
      const value = item as Partial<Rect> | undefined
      if (
        value &&
        Number.isFinite(value.left) &&
        Number.isFinite(value.top) &&
        Number(value.width) > 0 &&
        Number(value.height) > 0
      ) {
        rect.value = {
          left: Number(value.left),
          top: Number(value.top),
          width: Number(value.width),
          height: Number(value.height),
        }
      } else {
        rect.value = null
      }
    })
    query.exec()
  } catch {
    // jsdom 或非 uni 环境下选择查询不可用时，退化为居中气泡。
    rect.value = null
  }
}

watch(
  [isVisible, innerCurrent],
  async ([visible]) => {
    if (!visible) {
      rect.value = null
      return
    }
    await nextTick()
    measure()
  },
  { immediate: true },
)

watch(
  () => props.current,
  (value) => {
    innerCurrent.value = clampIndex(value)
  },
)

watch(
  () => props.steps.length,
  () => {
    innerCurrent.value = clampIndex(innerCurrent.value)
  },
)

function close() {
  emit('update:visible', false)
  emit('update:show', false)
  emit('close')
}

function goTo(index: number) {
  const next = clampIndex(index)
  if (next === innerCurrent.value) {
    return
  }
  innerCurrent.value = next
  const payload: MqTourChangePayload = { index: next, step: props.steps[next] ?? {} }
  emit('update:current', next)
  emit('change', payload)
}

function next() {
  if (isLast.value) {
    finish()
    return
  }
  goTo(innerCurrent.value + 1)
}

function prev() {
  goTo(innerCurrent.value - 1)
}

function finish() {
  emit('finish')
  close()
}

function onNextOrDone() {
  if (isLast.value) {
    finish()
    return
  }
  next()
}

function onPrev() {
  prev()
}

function onSkip() {
  emit('skip')
  close()
}

function onMask() {
  if (!props.maskClosable) {
    return
  }
  close()
}

defineExpose({
  next,
  prev,
  finish,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
