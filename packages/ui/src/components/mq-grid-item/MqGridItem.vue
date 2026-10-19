<template>
  <view
    class="mq-grid-item"
    :class="rootClass"
    :style="itemStyle"
    role="listitem"
    @click.stop="onClick"
  >
    <view class="mq-grid-item__content">
      <slot>
        <view v-if="slots.icon || mark" class="mq-grid-item__mark">
          <slot name="icon">{{ mark }}</slot>
        </view>
        <text v-if="slots.text || text" class="mq-grid-item__text" :class="{ 'is-ellipsis': ellipsis }">
          <slot name="text">{{ text }}</slot>
        </text>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import { gridKey } from '../mq-grid/context'
import type { MqGridItemEmits, MqGridItemProps } from './types'

defineOptions({
  name: 'mq-grid-item',
})

const props = withDefaults(defineProps<MqGridItemProps>(), {
  text: '',
  mark: '',
  ellipsis: false,
})

const emit = defineEmits<MqGridItemEmits>()
const slots = useSlots()
const grid = inject(gridKey, null)

const column = computed(() => {
  const value = grid?.column.value
  if (!value || !Number.isFinite(value) || value < 1) {
    return 4
  }
  return Math.floor(value)
})

const gutter = computed(() => {
  const value = grid?.gutter.value
  return value && Number.isFinite(value) && value > 0 ? value : 0
})

const rootClass = computed(() => ({
  'is-border': Boolean(grid?.border.value),
  'is-clickable': Boolean(grid?.clickable.value),
  'is-center': grid?.center.value !== false,
  'is-horizontal': grid?.direction.value === 'horizontal',
  'is-square': Boolean(grid?.square.value),
}))

const itemStyle = computed(() => {
  const style: Record<string, string> = {
    flex: `0 0 ${100 / column.value}%`,
    maxWidth: `${100 / column.value}%`,
  }
  if (gutter.value) {
    style.paddingLeft = `${gutter.value / 2}px`
    style.paddingRight = `${gutter.value / 2}px`
    style.marginBottom = `${gutter.value}px`
  }
  return style
})

function onClick(event: Event) {
  emit('click', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
