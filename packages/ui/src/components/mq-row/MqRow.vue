<template>
  <view
    class="mq-row"
    :class="[`is-justify-${justify}`, `is-align-${align}`]"
    :style="rootStyle"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { rowKey } from './context'
import type { MqRowProps } from './types'

defineOptions({
  name: 'mq-row',
})

const props = withDefaults(defineProps<MqRowProps>(), {
  gutter: 0,
  justify: 'start',
  align: 'top',
})

const gutter = toRef(props, 'gutter')

const rootStyle = computed(() => {
  const gap = Number.isFinite(props.gutter) && props.gutter > 0 ? props.gutter : 0
  if (!gap) {
    return undefined
  }
  return {
    marginLeft: `-${gap / 2}px`,
    marginRight: `-${gap / 2}px`,
  }
})

provide(rowKey, { gutter })
</script>

<style lang="scss">
@import './index.scss';
</style>
