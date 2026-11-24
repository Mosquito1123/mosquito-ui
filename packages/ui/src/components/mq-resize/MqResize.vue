<template>
  <view ref="root" class="mq-resize" :id="id || undefined">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { MqResizeEmits, MqResizeProps, MqResizeSize } from './types'

defineOptions({
  name: 'mq-resize',
})

const props = withDefaults(defineProps<MqResizeProps>(), {
  disabled: false,
  throttle: 100,
  id: undefined,
})

const emit = defineEmits<MqResizeEmits>()

const root = ref<HTMLElement | null>(null)

let observer: { observe: (target: Element) => void; disconnect: () => void } | null = null
let timer: ReturnType<typeof setTimeout> | null = null
let lastAt = 0
let lastSize: MqResizeSize | null = null

function toSize(rect: unknown): MqResizeSize | null {
  if (!rect) {
    return null
  }
  const value = rect as { width?: number; height?: number }
  return {
    width: Number(value.width) || 0,
    height: Number(value.height) || 0,
  }
}

function readDomSize(): MqResizeSize | null {
  const el = root.value as HTMLElement | null
  if (!el || typeof el.getBoundingClientRect !== 'function') {
    return null
  }
  return toSize(el.getBoundingClientRect())
}

function publish(size: MqResizeSize) {
  lastSize = size
  if (!props.disabled) {
    emit('resize', size)
  }
}

function measureFromQuery() {
  const uniObj = (globalThis as any).uni
  if (!uniObj || typeof uniObj.createSelectorQuery !== 'function') {
    return
  }
  try {
    const selector = props.id ? `#${props.id}` : '.mq-resize'
    const query = uniObj.createSelectorQuery()
    query
      .select(selector)
      .boundingClientRect((rect: unknown) => {
        const size = toSize(rect)
        if (size) {
          publish(size)
        }
      })
      .exec()
  } catch {
    // 小程序环境或选择器不可用时静默降级，不抛出异常。
  }
}

/** 立即测量一次。能读到 DOM 时读 DOM，否则回退到 uni 选择器查询。 */
function measure(): MqResizeSize | null {
  const size = readDomSize()
  if (size) {
    if (props.disabled) {
      lastSize = size
    } else {
      publish(size)
    }
    return size
  }
  if (!props.disabled) {
    measureFromQuery()
  }
  return lastSize
}

function onResize() {
  if (props.disabled) {
    return
  }
  const now = Date.now()
  const wait = props.throttle - (now - lastAt)
  if (wait <= 0) {
    lastAt = now
    measure()
    return
  }
  if (!timer) {
    timer = setTimeout(() => {
      timer = null
      lastAt = Date.now()
      measure()
    }, wait)
  }
}

onMounted(() => {
  if (props.disabled) {
    return
  }
  const ResizeObserverCtor = (globalThis as any).ResizeObserver
  if (typeof ResizeObserverCtor === 'function') {
    try {
      const nextObserver = new ResizeObserverCtor(() => onResize()) as NonNullable<typeof observer>
      observer = nextObserver
      if (root.value) {
        nextObserver.observe(root.value)
      }
      return
    } catch {
      observer = null
    }
  }
  // 无 ResizeObserver 时回退：挂载后先测一次。
  measure()
})

onBeforeUnmount(() => {
  if (observer) {
    try {
      observer.disconnect()
    } catch {
      // 忽略清理异常。
    }
    observer = null
  }
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})

defineExpose({ measure })
</script>

<style lang="scss">
@import './index.scss';
</style>
