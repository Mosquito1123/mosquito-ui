<template>
  <view class="mq-rolling-number" :class="{ 'is-playing': playing }">
    <text v-if="prefix" class="mq-rolling-number__affix">{{ prefix }}</text>
    <template v-for="(item, index) in chars" :key="index">
      <view v-if="item.digit" class="mq-rolling-number__digit" :style="digitStyle">
        <view class="mq-rolling-number__column" :style="columnStyle(item.char)">
          <text
            v-for="line in 10"
            :key="line"
            class="mq-rolling-number__value"
            :style="digitStyle"
          >
            {{ line - 1 }}
          </text>
        </view>
      </view>
      <text v-else class="mq-rolling-number__char" :style="charStyle">{{ item.char }}</text>
    </template>
    <text v-if="suffix" class="mq-rolling-number__affix">{{ suffix }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatRollingNumber, toRollingChars } from '../../utils/rolling-number'
import type { MqRollingNumberEmits, MqRollingNumberProps } from './types'

defineOptions({
  name: 'mq-rolling-number',
})

const props = withDefaults(defineProps<MqRollingNumberProps>(), {
  value: 0,
  decimals: 0,
  separator: ',',
  prefix: '',
  suffix: '',
  height: 28,
  duration: 600,
  color: '',
  autoplay: false,
})

const emit = defineEmits<MqRollingNumberEmits>()

function normalize(value: unknown): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

const displayValue = ref(props.autoplay ? 0 : normalize(props.value))
const playing = ref(props.autoplay)
let timer: ReturnType<typeof setTimeout> | undefined

const size = computed(() => Math.max(0, Number(props.height) || 0))
const speed = computed(() => Math.max(0, Number(props.duration) || 0))

const chars = computed(() =>
  toRollingChars(formatRollingNumber(displayValue.value, props.decimals, props.separator)),
)

const digitStyle = computed(() => ({
  height: `${size.value}px`,
  lineHeight: `${size.value}px`,
  fontSize: `${Math.round(size.value * 0.72)}px`,
  color: props.color || undefined,
}))

const charStyle = computed(() => ({
  lineHeight: `${size.value}px`,
  fontSize: `${Math.round(size.value * 0.72)}px`,
  color: props.color || undefined,
}))

function columnStyle(char: string) {
  return {
    transform: `translateY(-${(Number(char) || 0) * size.value}px)`,
    transitionDuration: `${speed.value}ms`,
  }
}

function clearTimer() {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

function play(value: number) {
  clearTimer()
  displayValue.value = value
  if (!speed.value) {
    playing.value = false
    emit('finish')
    return
  }
  playing.value = true
  timer = setTimeout(() => {
    timer = undefined
    playing.value = false
    emit('finish')
  }, speed.value)
}

function finish() {
  clearTimer()
  displayValue.value = normalize(props.value)
  playing.value = false
  emit('finish')
}

watch(
  () => props.value,
  (value) => {
    play(normalize(value))
  },
)

onMounted(() => {
  if (!props.autoplay) {
    return
  }
  void nextTick(() => {
    play(normalize(props.value))
  })
})

onBeforeUnmount(clearTimer)

defineExpose({
  finish,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
