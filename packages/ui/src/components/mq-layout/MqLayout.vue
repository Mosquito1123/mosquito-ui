<template>
  <view class="mq-layout" :class="rootClass" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqLayoutProps } from './types'

defineOptions({
  name: 'mq-layout',
})

const props = withDefaults(defineProps<MqLayoutProps>(), {
  direction: 'row',
  wrap: 'nowrap',
  justify: undefined,
  align: undefined,
  gutter: 0,
  full: false,
})

const rootClass = computed(() => [
  `mq-layout--${props.direction}`,
  `mq-layout--${props.wrap}`,
  props.justify ? `mq-layout--justify-${props.justify}` : '',
  props.align ? `mq-layout--align-${props.align}` : '',
])

const rootStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.gutter) {
    style.gap = `${props.gutter}px`
  }
  if (props.full) {
    style.height = '100%'
  }
  return style
})
</script>

<style lang="scss">
@import './index.scss';
</style>
