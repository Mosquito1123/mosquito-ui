<template>
  <picker-view
    class="mq-datetime-picker-view"
    :style="rootStyle"
    :value="state.indexes"
    :indicator-style="indicatorStyle"
    :immediate-change="immediateChange"
    @change="onChange"
    @pickstart="onPickStart"
    @pickend="onPickEnd"
  >
    <picker-view-column
      v-for="(column, columnIndex) in state.columns"
      :key="columnIndex"
    >
      <view
        v-for="(option, optionIndex) in column"
        :key="`${String(option.value)}-${optionIndex}`"
        class="mq-datetime-picker-view__item"
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
  buildDatetimeColumns,
  correctDatetime,
  datetimeFromIndexes,
  datetimeIndexes,
  parseDatetime,
} from '../../utils/datetime'
import type { MqDatetimeOptions } from '../../utils/datetime'
import type { MqPickerOption } from '../../utils/picker'
import type {
  MqDatetimeChangePayload,
  MqDatetimePickerViewEmits,
  MqDatetimePickerViewProps,
} from './types'

defineOptions({
  name: 'mq-datetime-picker-view',
})

const props = withDefaults(defineProps<MqDatetimePickerViewProps>(), {
  modelValue: undefined,
  type: 'datetime',
  itemHeight: 44,
  visibleItemCount: 6,
  formatter: undefined,
  minDate: undefined,
  maxDate: undefined,
  minHour: 0,
  maxHour: 23,
  minMinute: 0,
  maxMinute: 59,
  useSecond: false,
  minSecond: 0,
  maxSecond: 59,
  immediateChange: false,
})

const emit = defineEmits<MqDatetimePickerViewEmits>()

const state = ref<{ columns: MqPickerOption[][]; indexes: number[]; value: string | number }>({
  columns: [],
  indexes: [],
  value: 0,
})

const options = computed<MqDatetimeOptions>(() => ({
  type: props.type,
  minDate: props.minDate,
  maxDate: props.maxDate,
  minHour: props.minHour,
  maxHour: props.maxHour,
  minMinute: props.minMinute,
  maxMinute: props.maxMinute,
  useSecond: props.useSecond,
  minSecond: props.minSecond,
  maxSecond: props.maxSecond,
  formatter: props.formatter,
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

function rebuild(value: string | number | undefined) {
  const corrected = correctDatetime(value, options.value)
  const parts = parseDatetime(corrected, options.value)
  const columns = buildDatetimeColumns(parts, options.value)
  const indexes = datetimeIndexes(parts, columns, options.value)
  state.value = { columns, indexes, value: corrected }
}

rebuild(props.modelValue)

watch(
  () => [props.type, props.minDate, props.maxDate, props.useSecond, props.minHour, props.maxHour, props.minMinute, props.maxMinute, props.minSecond, props.maxSecond],
  () => {
    rebuild(props.modelValue ?? state.value.value)
  },
)

watch(
  () => props.modelValue,
  (value) => {
    const next = correctDatetime(value, options.value)
    if (next !== state.value.value) {
      rebuild(value)
    }
  },
)

function onChange(event: Event) {
  const detail = (event as Event & { detail?: { value?: number[] } }).detail
  const raw = Array.isArray(detail?.value) ? detail.value : state.value.indexes
  const requested = raw.map((item, index) => {
    const column = state.value.columns[index]
    const value = Number(item)
    if (!column || !Number.isFinite(value)) {
      return 0
    }
    return Math.min(column.length - 1, Math.max(0, Math.floor(value)))
  })
  const value = datetimeFromIndexes(requested, state.value.columns, options.value)
  rebuild(value)
  emit('update:modelValue', state.value.value)
  const payload: MqDatetimeChangePayload = {
    value: state.value.value,
    columns: state.value.columns,
  }
  emit('change', payload)
}

function onPickStart() {
  emit('pickstart')
}

function onPickEnd() {
  emit('pickend')
}

function getSelectedOptions(): MqPickerOption[] {
  return state.value.columns.map((column, index) => column[state.value.indexes[index]] ?? column[0])
}

function getOriginColumns(): MqPickerOption[][] {
  return state.value.columns.map((column) => [...column])
}

function correctValue(value: string | number): string | number {
  return correctDatetime(value, options.value)
}

defineExpose({
  getSelectedOptions,
  getOriginColumns,
  correctValue,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
