<template>
  <view class="mq-grid" :style="rootStyle" role="list">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { gridKey } from './context'
import type { MqGridProps } from './types'

defineOptions({
  name: 'mq-grid',
})

const props = withDefaults(defineProps<MqGridProps>(), {
  column: 4,
  border: false,
  gutter: 0,
  square: false,
  clickable: false,
  bgColor: '',
  center: true,
  direction: 'vertical',
})

provide(gridKey, {
  column: toRef(props, 'column'),
  border: toRef(props, 'border'),
  gutter: toRef(props, 'gutter'),
  square: toRef(props, 'square'),
  clickable: toRef(props, 'clickable'),
  center: toRef(props, 'center'),
  direction: toRef(props, 'direction'),
})

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgColor) {
    style.backgroundColor = props.bgColor
  }
  const gutter = Number.isFinite(props.gutter) && props.gutter > 0 ? props.gutter : 0
  if (gutter) {
    style.marginLeft = `-${gutter / 2}px`
    style.marginRight = `-${gutter / 2}px`
  }
  return style
})
</script>

<style lang="scss">
@import './index.scss';
</style>
