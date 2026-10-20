<template>
  <picker-view
    class="mq-picker-view"
    :style="rootStyle"
    :value="columnsState.indexes"
    :indicator-style="indicatorStyle"
    :immediate-change="immediateChange"
    @change="onChange"
    @pickstart="onPickStart"
    @pickend="onPickEnd"
  >
    <picker-view-column
      v-for="(column, columnIndex) in columnsState.columns"
      :key="columnIndex"
    >
      <view
        v-for="(option, optionIndex) in column"
        :key="`${String(option.value)}-${optionIndex}`"
        class="mq-picker-view__item"
        :class="{ 'is-disabled': option.disabled }"
        :style="itemStyle"
      >
        {{ option.label }}
      </view>
    </picker-view-column>
  </picker-view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  buildCascadeSelection,
  cascadeColumnsFromIndexes,
  normalizePickerColumn,
  normalizePickerColumns,
  pickerSelection,
  resolvePickerIndexes,
  samePickerValues,
} from '../../utils/picker'
import type { MqPickerColumn, MqPickerColumns, MqPickerKeys, MqPickerOption } from '../../utils/picker'
import type {
  MqPickerChangePayload,
  MqPickerViewEmits,
  MqPickerViewProps,
} from './types'

defineOptions({
  name: 'mq-picker-view',
})

const props = withDefaults(defineProps<MqPickerViewProps>(), {
  modelValue: () => [],
  columns: () => [],
  cascade: false,
  itemHeight: 44,
  visibleItemCount: 6,
  valueKey: 'value',
  labelKey: 'label',
  childrenKey: 'children',
  immediateChange: false,
})

const emit = defineEmits<MqPickerViewEmits>()

const columnsState = ref<{ columns: MqPickerOption[][]; indexes: number[] }>({
  columns: [],
  indexes: [],
})

const keys = computed<MqPickerKeys>(() => ({
  valueKey: props.valueKey,
  labelKey: props.labelKey,
  childrenKey: props.childrenKey,
}))

const itemHeight = computed(() => {
  const value = Number(props.itemHeight)
  return Number.isFinite(value) && value > 0 ? Math.min(96, Math.max(24, value)) : 44
})

const visibleItemCount = computed(() => {
  const value = Number(props.visibleItemCount)
  return Number.isFinite(value) && value > 0 ? Math.min(12, Math.max(3, Math.floor(value))) : 6
})

const rootStyle = computed(() => ({
  height: `${itemHeight.value * visibleItemCount.value}px`,
}))

const indicatorStyle = computed(() => `height: ${itemHeight.value}px;`)

const itemStyle = computed(() => ({
  height: `${itemHeight.value}px`,
  lineHeight: `${itemHeight.value}px`,
}))

function treeData(): MqPickerOption[] {
  return normalizePickerColumn(props.columns as MqPickerColumn, keys.value)
}

function rebuild(values: readonly (string | number)[] = []) {
  if (props.cascade) {
    const built = buildCascadeSelection(
      props.columns as MqPickerColumn,
      values,
      keys.value,
    )
    columnsState.value = built
    return
  }
  const columns = normalizePickerColumns(props.columns, keys.value)
  columnsState.value = {
    columns,
    indexes: resolvePickerIndexes(columns, values),
  }
}

rebuild(props.modelValue)

watch(
  () => props.columns,
  () => {
    rebuild(props.modelValue)
  },
  { deep: true },
)

watch(
  () => props.modelValue,
  (values) => {
    const current = pickerSelection(columnsState.value.columns, columnsState.value.indexes)
    if (samePickerValues(values ?? [], current.selectedValues)) {
      return
    }
    rebuild(values ?? [])
  },
  { deep: true },
)

function onChange(event: Event) {
  const detail = (event as Event & { detail?: { value?: number[] } }).detail
  const raw = Array.isArray(detail?.value) ? detail.value : columnsState.value.indexes
  const requested = raw.map((item) => Number(item)).filter((item) => Number.isFinite(item))
  const before = columnsState.value.indexes.slice()
  const changedIndex = requested.findIndex((value, index) => value !== before[index])
  const columnIndex = changedIndex >= 0 ? changedIndex : 0

  if (props.cascade) {
    const trimmed = changedIndex >= 0 ? requested.slice(0, changedIndex + 1) : requested
    columnsState.value = cascadeColumnsFromIndexes(treeData(), trimmed, keys.value)
  } else {
    columnsState.value = {
      columns: columnsState.value.columns,
      indexes: requested.slice(0, columnsState.value.columns.length),
    }
  }

  emitChange(columnIndex)
}

function emitChange(columnIndex: number) {
  const selection = pickerSelection(columnsState.value.columns, columnsState.value.indexes)
  emit('update:modelValue', selection.selectedValues)
  emit('change', { ...selection, columnIndex })
}

function onPickStart() {
  emit('pickstart')
}

function onPickEnd() {
  emit('pickend')
}

function getPayload(columnIndex = 0): MqPickerChangePayload {
  const selection = pickerSelection(columnsState.value.columns, columnsState.value.indexes)
  return { ...selection, columnIndex }
}

function getSelectedOptions(): MqPickerOption[] {
  return getPayload().selectedOptions
}

function getSelectedValues(): Array<string | number> {
  return getPayload().selectedValues
}

function getSelectedLabels(): string[] {
  return getPayload().selectedLabels
}

function getSelectedIndexes(): number[] {
  return getPayload().selectedIndexes
}

function getSelectedIndex(): number[] {
  return getSelectedIndexes()
}

function getColumnsData(): MqPickerOption[][] {
  return columnsState.value.columns.map((column) => [...column])
}

function getColumnData(columnIndex: number): MqPickerOption[] {
  const column = columnsState.value.columns[columnIndex]
  return column ? [...column] : []
}

function getColumnIndex(columnIndex: number): number {
  return columnsState.value.indexes[columnIndex] ?? 0
}

function getChangePayload(): MqPickerChangePayload {
  return getPayload()
}

function resetColumns(columns: MqPickerColumns) {
  if (props.cascade) {
    const built = buildCascadeSelection(columns as MqPickerColumn, [], keys.value)
    columnsState.value = built
    return
  }
  const normalized = normalizePickerColumns(columns, keys.value)
  columnsState.value = {
    columns: normalized,
    indexes: resolvePickerIndexes(normalized, []),
  }
}

defineExpose({
  getSelectedOptions,
  getSelectedValues,
  getSelectedLabels,
  getSelectedIndexes,
  getSelectedIndex,
  getColumnsData,
  getColumnData,
  getColumnIndex,
  getChangePayload,
  resetColumns,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
