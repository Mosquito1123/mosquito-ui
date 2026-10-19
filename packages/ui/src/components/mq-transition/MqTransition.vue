<template>
  <view v-if="rendered" class="mq-transition" :class="phaseClass" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { MqTransitionEmits, MqTransitionProps } from './types'

defineOptions({
  name: 'mq-transition',
})

const props = withDefaults(defineProps<MqTransitionProps>(), {
  show: false,
  name: 'fade',
  duration: 200,
})

const emit = defineEmits<MqTransitionEmits>()

const rendered = ref(false)
const leaving = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const durationMs = computed(() => {
  if (!Number.isFinite(props.duration) || props.duration < 0) {
    return 200
  }
  return props.duration
})

const phaseClass = computed(() => {
  if (!rendered.value) {
    return undefined
  }
  return leaving.value ? `is-${props.name}-leave` : undefined
})

const rootStyle = computed(() => ({
  '--mq-transition-duration': `${durationMs.value}ms`,
}))

function clearTimer() {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

watch(
  () => props.show,
  async (visible) => {
    if (visible) {
      clearTimer()
      leaving.value = true
      rendered.value = true
      await nextTick()
      if (!props.show) {
        return
      }
      leaving.value = false
      timer = setTimeout(() => {
        emit('after-enter')
        timer = undefined
      }, durationMs.value)
      return
    }
    if (!rendered.value) {
      return
    }
    leaving.value = true
    clearTimer()
    timer = setTimeout(() => {
      rendered.value = false
      leaving.value = false
      timer = undefined
      emit('after-leave')
    }, durationMs.value)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearTimer()
})
</script>

<style lang="scss">
@import './index.scss';
</style>
