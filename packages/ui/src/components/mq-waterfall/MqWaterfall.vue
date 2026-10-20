<template>
  <view class="mq-waterfall">
    <view
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      class="mq-waterfall__column"
      :style="{ marginRight: columnIndex < columns.length - 1 ? gapValue : '0' }"
    >
      <view
        v-for="cell in column"
        :key="cell.index"
        class="mq-waterfall__item"
        :style="{ marginBottom: gapValue }"
        @click="onClick(cell, columnIndex)"
      >
        <slot :item="cell.item" :index="cell.index" :column="columnIndex" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { splitWaterfall } from '../../utils/waterfall'
import type { MqWaterfallCell } from '../../utils/waterfall'
import type { MqWaterfallEmits, MqWaterfallProps } from './types'

defineOptions({
  name: 'mq-waterfall',
})

const props = withDefaults(defineProps<MqWaterfallProps<unknown>>(), {
  data: () => [],
  column: 2,
  gap: 12,
  estimateHeight: undefined,
})

const emit = defineEmits<MqWaterfallEmits<unknown>>()

const columns = computed(() =>
  splitWaterfall(props.data, props.column, props.estimateHeight),
)

const gapValue = computed(() => {
  if (typeof props.gap === 'number') {
    return `${Math.max(0, props.gap)}px`
  }
  return props.gap || '12px'
})

function onClick(cell: MqWaterfallCell<unknown>, column: number) {
  emit('click', { item: cell.item, index: cell.index, column })
}
</script>

<style lang="scss">
@import './index.scss';
</style>
