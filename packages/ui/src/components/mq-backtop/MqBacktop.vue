<template>
  <view
    v-if="visible"
    class="mq-backtop"
    :class="`is-${shape}`"
    :style="rootStyle"
    role="button"
    aria-label="回到顶部"
    @click.stop="onClick"
  >
    <slot>{{ text || '↑' }}</slot>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqBacktopEmits, MqBacktopProps } from './types'

defineOptions({
  name: 'mq-backtop',
})

const props = withDefaults(defineProps<MqBacktopProps>(), {
  scrollTop: 0,
  text: '',
  top: 300,
  duration: 300,
  zIndex: 10,
  shape: 'circle',
  bottom: 100,
  right: 20,
})

const emit = defineEmits<MqBacktopEmits>()

const visible = computed(() => {
  const scroll = Number.isFinite(props.scrollTop) ? props.scrollTop : 0
  const threshold = Number.isFinite(props.top) ? Math.max(0, props.top) : 300
  return scroll >= threshold
})

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    bottom: `${Number.isFinite(props.bottom) ? Math.max(0, props.bottom) : 100}px`,
    right: `${Number.isFinite(props.right) ? Math.max(0, props.right) : 20}px`,
  }
  if (Number.isFinite(props.zIndex)) {
    style.zIndex = String(props.zIndex)
  }
  return style
})

function onClick(event: Event) {
  emit('click', event)
  const duration = Number.isFinite(props.duration) && props.duration >= 0 ? props.duration : 300
  const uniApi = (globalThis as { uni?: { pageScrollTo?: (opts: Record<string, unknown>) => void } }).uni
  if (uniApi?.pageScrollTo) {
    uniApi.pageScrollTo({ scrollTop: 0, duration })
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: duration > 0 ? 'smooth' : 'auto' })
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
