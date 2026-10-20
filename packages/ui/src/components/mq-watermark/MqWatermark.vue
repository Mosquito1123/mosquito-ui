<template>
  <view class="mq-watermark" :class="{ 'is-full': fullScreen }" :style="rootStyle">
    <text
      v-for="tile in tiles"
      :key="tile.key"
      class="mq-watermark__tile"
      :style="tile.style"
    >
      {{ content }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqWatermarkProps } from './types'

defineOptions({
  name: 'mq-watermark',
})

const props = withDefaults(defineProps<MqWatermarkProps>(), {
  content: '',
  width: 120,
  height: 120,
  fullScreen: true,
  color: '#C9CBD4',
  size: 14,
  rotate: -25,
  zIndex: 1100,
  opacity: 0.35,
  layout: 'grid',
  gutterX: 0,
  gutterY: 0,
})

const rootStyle = computed(() => ({
  zIndex: String(Number.isFinite(props.zIndex) ? props.zIndex : 1100),
  opacity: String(Number.isFinite(props.opacity) ? props.opacity : 0.35),
}))

const tiles = computed(() => {
  const width = Number.isFinite(props.width) && props.width > 0 ? props.width : 120
  const height = Number.isFinite(props.height) && props.height > 0 ? props.height : 120
  const gutterX = Number.isFinite(props.gutterX) ? Math.max(0, props.gutterX) : 0
  const gutterY = Number.isFinite(props.gutterY) ? Math.max(0, props.gutterY) : 0
  const stepX = width + gutterX
  const stepY = height + gutterY
  const cols = 6
  const rows = 8
  const list: Array<{ key: string; style: Record<string, string> }> = []
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const stagger = props.layout === 'staggered' && row % 2 === 1 ? stepX / 2 : 0
      list.push({
        key: `${row}-${col}`,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          left: `${col * stepX + stagger}px`,
          top: `${row * stepY}px`,
          color: props.color || '#C9CBD4',
          fontSize: `${Number.isFinite(props.size) ? props.size : 14}px`,
          transform: `rotate(${Number.isFinite(props.rotate) ? props.rotate : -25}deg)`,
        },
      })
    }
  }
  return list
})
</script>

<style lang="scss">
@import './index.scss';
</style>
