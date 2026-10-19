<template>
  <view class="mq-countdown" role="timer">
    <slot :current="current">
      <text class="mq-countdown__text">{{ text }}</text>
    </slot>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatCountDown, parseTimeData } from '../../utils/model'
import type { MqCountdownEmits, MqCountdownProps } from './types'

defineOptions({
  name: 'mq-countdown',
})

const props = withDefaults(defineProps<MqCountdownProps>(), {
  time: 0,
  format: 'HH:mm:ss',
  autoStart: true,
  millisecond: false,
})

const emit = defineEmits<MqCountdownEmits>()

const remain = ref(0)
const current = computed(() => parseTimeData(remain.value))
const text = computed(() => formatCountDown(remain.value, props.format))

let timer: ReturnType<typeof setInterval> | undefined
let endAt = 0
let running = false

function tick() {
  const next = Math.max(0, endAt - Date.now())
  remain.value = next
  emit('change', parseTimeData(next))
  if (next <= 0) {
    pause()
    emit('finish')
  }
}

function clearTimer() {
  if (timer !== undefined) {
    clearInterval(timer)
    timer = undefined
  }
}

function start() {
  if (running || remain.value <= 0) {
    return
  }
  running = true
  endAt = Date.now() + remain.value
  clearTimer()
  timer = setInterval(tick, props.millisecond ? 30 : 250)
}

function pause() {
  running = false
  clearTimer()
}

function reset() {
  pause()
  const total = typeof props.time === 'number' && Number.isFinite(props.time) ? Math.max(0, props.time) : 0
  remain.value = total
  emit('change', parseTimeData(total))
  if (props.autoStart && total > 0) {
    start()
  }
}

watch(
  () => props.time,
  () => {
    reset()
  },
)

onMounted(() => {
  reset()
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
