<template>
  <text class="mq-count-to" :class="type !== 'default' ? `is-${type}` : undefined" :style="rootStyle">
    <slot name="prefix">
      <text v-if="prefix" class="mq-count-to__prefix">{{ prefix }}</text>
    </slot>
    <slot>{{ display }}</slot>
    <slot name="suffix">
      <text v-if="suffix" class="mq-count-to__suffix">{{ suffix }}</text>
    </slot>
  </text>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { easeOutCubic, formatCountToValue } from '../../utils/model'
import type { MqCountToEmits, MqCountToProps } from './types'

defineOptions({
  name: 'mq-count-to',
})

const props = withDefaults(defineProps<MqCountToProps>(), {
  color: '',
  type: 'default',
  startVal: 0,
  endVal: 2024,
  duration: 3000,
  autoStart: true,
  decimals: 0,
  decimal: '.',
  separator: ',',
  prefix: '',
  suffix: '',
  useEasing: true,
})

const emit = defineEmits<MqCountToEmits>()

const current = ref(0)
let raf: number | undefined
let running = false
let startedAt = 0
let from = 0
let to = 0

const display = computed(() =>
  formatCountToValue(current.value, {
    decimals: props.decimals,
    decimal: props.decimal,
    separator: props.separator,
  }),
)

const rootStyle = computed(() => (props.color ? { color: props.color } : undefined))

function clearRaf() {
  if (raf !== undefined && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(raf)
    raf = undefined
  }
}

function frame() {
  const duration = Number.isFinite(props.duration) && props.duration > 0 ? props.duration : 3000
  const elapsed = Date.now() - startedAt
  const raw = Math.min(1, elapsed / duration)
  const progress = props.useEasing ? easeOutCubic(raw) : raw
  current.value = from + (to - from) * progress
  if (raw < 1) {
    raf = requestAnimationFrame(frame)
    return
  }
  current.value = to
  running = false
  raf = undefined
  emit('finish')
}

function start() {
  if (running) {
    return
  }
  running = true
  from = current.value
  to = Number.isFinite(props.endVal) ? props.endVal : 0
  startedAt = Date.now()
  clearRaf()
  if (typeof requestAnimationFrame !== 'function') {
    current.value = to
    running = false
    emit('finish')
    return
  }
  raf = requestAnimationFrame(frame)
}

function pause() {
  running = false
  clearRaf()
}

function reset() {
  pause()
  current.value = Number.isFinite(props.startVal) ? props.startVal : 0
  if (props.autoStart) {
    start()
  }
}

watch(
  () => [props.startVal, props.endVal, props.duration] as const,
  () => {
    reset()
  },
)

onMounted(() => {
  current.value = Number.isFinite(props.startVal) ? props.startVal : 0
  emit('mounted')
  if (props.autoStart) {
    start()
  }
})

onBeforeUnmount(() => {
  pause()
})

defineExpose({
  start,
  pause,
  reset,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
