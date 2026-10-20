<template>
  <view
    class="mq-table"
    :class="[`mq-table--${size}`, { 'is-border': border, 'is-stripe': stripe }]"
    :style="rootStyle"
    role="table"
  >
    <view v-if="columns.length" class="mq-table__head" role="row">
      <view
        v-for="column in columns"
        :key="column.prop"
        class="mq-table__cell"
        :class="`is-${columnAlign(column)}`"
        :style="cellStyle(column)"
        role="columnheader"
      >
        <slot :name="`header-${column.prop}`" :column="column">
          <slot name="header" :column="column">{{ column.label ?? column.prop }}</slot>
        </slot>
      </view>
    </view>

    <view v-if="loading" class="mq-table__state" role="status">
      <slot name="loading">
        <mq-loading :size="20" label="加载中" />
      </slot>
    </view>
    <view v-else-if="!data.length" class="mq-table__state">
      <slot name="empty">{{ emptyText }}</slot>
    </view>
    <view v-else class="mq-table__body">
      <view
        v-for="(row, rowIndex) in data"
        :key="rowIdentity(row, rowIndex)"
        class="mq-table__row"
        role="row"
        @click="onRowClick(row, rowIndex)"
      >
        <view
          v-for="column in columns"
          :key="column.prop"
          class="mq-table__cell"
          :class="`is-${columnAlign(column)}`"
          :style="cellStyle(column)"
          role="cell"
          @click="onCellClick(row, column, rowIndex)"
        >
          <slot
            :name="`cell-${column.prop}`"
            :row="row"
            :column="column"
            :value="row[column.prop]"
            :index="rowIndex"
          >
            <slot
              name="cell"
              :row="row"
              :column="column"
              :value="row[column.prop]"
              :index="rowIndex"
            >
              <text class="mq-table__text" :class="{ 'is-ellipsis': column.ellipsis }">
                {{ displayCell(row, column, rowIndex) }}
              </text>
            </slot>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MqLoading from '../mq-loading/MqLoading.vue'
import type { MqTableColumn, MqTableEmits, MqTableProps } from './types'

defineOptions({
  name: 'mq-table',
})

const props = withDefaults(defineProps<MqTableProps>(), {
  data: () => [],
  columns: () => [],
  border: false,
  stripe: false,
  size: 'medium',
  rowKey: '',
  emptyText: '暂无数据',
  loading: false,
  align: 'left',
  headerBg: '',
})

const emit = defineEmits<MqTableEmits>()

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.headerBg) {
    style['--mq-table-head-bg'] = props.headerBg
  }
  return style
})

function dimension(value: string | number | undefined): string | undefined {
  if (value === undefined || value === '') {
    return undefined
  }
  return typeof value === 'number' ? `${value}px` : value
}

function cellStyle(column: MqTableColumn) {
  const style: Record<string, string> = {}
  const width = dimension(column.width)
  const minWidth = dimension(column.minWidth)
  if (width) {
    style.width = width
    style.flex = `0 0 ${width}`
  } else {
    style.flex = '1 1 0'
  }
  if (minWidth) {
    style.minWidth = minWidth
  }
  return style
}

function columnAlign(column: MqTableColumn) {
  return column.align ?? props.align
}

function rowIdentity(row: Record<string, unknown>, index: number): string {
  if (props.rowKey) {
    const value = row[props.rowKey]
    if (value !== undefined && value !== null) {
      return String(value)
    }
  }
  return String(index)
}

function displayCell(
  row: Record<string, unknown>,
  column: MqTableColumn,
  index: number,
): string {
  const value = row[column.prop]
  if (column.formatter) {
    return column.formatter(row, value, index)
  }
  return value === undefined || value === null ? '' : String(value)
}

function onRowClick(row: Record<string, unknown>, index: number) {
  emit('rowClick', row, index)
}

function onCellClick(
  row: Record<string, unknown>,
  column: MqTableColumn,
  index: number,
) {
  emit('cellClick', row, column, index)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
