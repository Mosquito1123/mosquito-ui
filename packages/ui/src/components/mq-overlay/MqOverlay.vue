<template>
  <view
    v-if="rendered"
    class="mq-overlay"
    :class="{ 'is-open': opened }"
    :style="rootStyle"
    @click="onClick"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { MqOverlayEmits, MqOverlayProps } from './types'

defineOptions({
  name: 'mq-overlay',
})

const props = withDefaults(defineProps<MqOverlayProps>(), {
  show: false,
  duration: 200,
})

const emit = defineEmits<MqOverlayEmits>()

const rendered = ref(false)
const opened = ref(false)
let leaveTimer: ReturnType<typeof setTimeout> | undefined

const durationMs = computed(() => {
  if (!Number.isFinite(props.duration) || props.duration < 0) {
    return 200
  }
  return props.duration
})

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    '--mq-overlay-duration': `${durationMs.value}ms`,
  }
  if (props.zIndex !== undefined && Number.isFinite(props.zIndex)) {
    style.zIndex = String(props.zIndex)
  }
  return style
})

function clearLeave() {
  if (leaveTimer !== undefined) {
    clearTimeout(leaveTimer)
    leaveTimer = undefined
  }
}

watch(
  () => props.show,
  async (visible) => {
    if (visible) {
      clearLeave()
      rendered.value = true
      await nextTick()
      if (!props.show) {
        return
      }
      opened.value = true
      return
    }
    opened.value = false
    if (!rendered.value) {
      return
    }
    clearLeave()
    leaveTimer = setTimeout(() => {
      rendered.value = false
      leaveTimer = undefined
    }, durationMs.value)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearLeave()
})

function onClick(event: Event) {
  emit('click', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
