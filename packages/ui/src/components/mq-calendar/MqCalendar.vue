<template>
  <view class="mq-calendar" :class="`is-${mode}`">
    <view class="mq-calendar__header">
      <text
        class="mq-calendar__nav"
        role="button"
        tabindex="0"
        aria-label="上个月"
        @click="prevMonth"
        @keydown.enter.prevent="prevMonth"
      >
        ‹
      </text>
      <text class="mq-calendar__month">{{ monthLabel }}</text>
      <text
        class="mq-calendar__nav"
        role="button"
        tabindex="0"
        aria-label="下个月"
        @click="nextMonth"
        @keydown.enter.prevent="nextMonth"
      >
        ›
      </text>
    </view>

    <view class="mq-calendar__weekdays">
      <text
        v-for="day in weekdays"
        :key="day"
        class="mq-calendar__weekday"
      >
        {{ day }}
      </text>
    </view>

    <view class="mq-calendar__grid">
      <view
        v-for="cell in cells"
        :key="cell.date"
        class="mq-calendar__cell"
        :class="cellClass(cell)"
        :role="cell.currentMonth ? 'button' : undefined"
        :aria-disabled="cell.currentMonth && isDisabled(cell.date) ? 'true' : undefined"
        @click="onPick(cell)"
      >
        <view class="mq-calendar__day" :class="dayClass(cell)">
          {{ cell.day }}
        </view>
      </view>
    </view>

    <view class="mq-calendar__footer">
      <text class="mq-calendar__summary">{{ summary }}</text>
      <view class="mq-calendar__actions">
        <text
          v-if="showClear"
          class="mq-calendar__action"
          role="button"
          tabindex="0"
          @click="onClear"
          @keydown.enter.prevent="onClear"
        >
          {{ clearText }}
        </text>
        <text
          v-if="showConfirm"
          class="mq-calendar__action is-confirm"
          role="button"
          tabindex="0"
          @click="onConfirm"
          @keydown.enter.prevent="onConfirm"
        >
          {{ confirmText }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  addMonths,
  buildCalendarDays,
  formatDateSummary,
  isDateBetween,
  normalizeDate,
  normalizeDateList,
  nextDateSelection,
  parseDate,
  todayString,
} from '../../utils/date'
import type { MqCalendarCell } from '../../utils/date'
import type {
  MqCalendarEmits,
  MqCalendarProps,
  MqCalendarValuePayload,
} from './types'

defineOptions({
  name: 'mq-calendar',
})

const props = withDefaults(defineProps<MqCalendarProps>(), {
  modelValue: '',
  mode: 'single',
  minDate: '',
  maxDate: '',
  firstDayOfWeek: 0,
  showConfirm: true,
  showClear: true,
  confirmText: '确定',
  clearText: '清除',
  disabledDate: undefined,
  month: '',
})

const emit = defineEmits<MqCalendarEmits>()

const today = todayString()
const initial =
  parseDate(props.month) ||
  parseDate(Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue) ||
  parseDate(today)

const viewYear = ref(initial?.year ?? new Date().getFullYear())
const viewMonth = ref(initial?.month ?? new Date().getMonth() + 1)
const draft = ref<string[]>(normalizeDateList(props.modelValue))
let lastPublished: string[] = []

const monthLabel = computed(() => `${viewYear.value}年${viewMonth.value}月`)
const weekdays = computed(() => {
  const base = ['日', '一', '二', '三', '四', '五', '六']
  return props.firstDayOfWeek === 1 ? [...base.slice(1), base[0]] : base
})
const cells = computed(() =>
  buildCalendarDays(viewYear.value, viewMonth.value, props.firstDayOfWeek),
)
const summary = computed(() => formatDateSummary(draft.value, props.mode))

watch(
  () => props.modelValue,
  (value) => {
    const normalized = normalizeDateList(value)
    const fromSelf =
      normalized.length === lastPublished.length &&
      normalized.every((date, index) => date === lastPublished[index])
    draft.value = normalized
    if (fromSelf) {
      return
    }
    const parts = parseDate(normalized[0])
    if (parts && (parts.year !== viewYear.value || parts.month !== viewMonth.value)) {
      viewYear.value = parts.year
      viewMonth.value = parts.month
    }
  },
  { deep: true },
)

watch(
  () => props.month,
  (value) => {
    const parts = parseDate(value)
    if (!parts) {
      return
    }
    viewYear.value = parts.year
    viewMonth.value = parts.month
  },
)

function isDisabled(date: string): boolean {
  if (!isDateBetween(date, props.minDate, props.maxDate)) {
    return true
  }
  return Boolean(props.disabledDate?.(date))
}

function isSelected(date: string): boolean {
  return draft.value.includes(date)
}

function isInRange(date: string): boolean {
  return (
    props.mode === 'range' &&
    draft.value.length > 1 &&
    date > draft.value[0] &&
    date < draft.value[1]
  )
}

function cellClass(cell: MqCalendarCell) {
  return {
    'is-out': !cell.currentMonth,
    'is-disabled': cell.currentMonth && isDisabled(cell.date),
    'is-selected': cell.currentMonth && isSelected(cell.date),
    'is-range': cell.currentMonth && isInRange(cell.date),
    'is-start': props.mode === 'range' && draft.value[0] === cell.date,
    'is-end': props.mode === 'range' && draft.value[1] === cell.date,
  }
}

function dayClass(cell: MqCalendarCell) {
  return {
    'is-today': cell.date === today,
    'is-selected': cell.currentMonth && isSelected(cell.date),
  }
}

function publish(next: string[], kind: 'change' | 'confirm') {
  const value = props.mode === 'single' ? next[0] ?? '' : [...next]
  const payload: MqCalendarValuePayload = { value, mode: props.mode }
  lastPublished = [...next]
  if (kind === 'confirm') {
    emit('confirm', payload)
    return
  }
  emit('update:modelValue', value)
  emit('change', payload)
}

function onPick(cell: MqCalendarCell) {
  if (!cell.currentMonth || isDisabled(cell.date)) {
    return
  }
  draft.value = nextDateSelection(draft.value, cell.date, props.mode)
  publish(draft.value, 'change')
}

function onConfirm() {
  publish(draft.value, 'confirm')
}

function onClear() {
  draft.value = []
  publish([], 'change')
}

function shiftMonth(delta: number) {
  const next = addMonths(viewYear.value, viewMonth.value, delta)
  viewYear.value = next.year
  viewMonth.value = next.month
  emit('monthChange', { year: next.year, month: next.month })
}

function prevMonth() {
  shiftMonth(-1)
}

function nextMonth() {
  shiftMonth(1)
}

function goToday() {
  const parts = parseDate(today)
  if (!parts) {
    return
  }
  viewYear.value = parts.year
  viewMonth.value = parts.month
  emit('monthChange', { year: parts.year, month: parts.month })
}

/** 把外部值收成选中的日期数组，便于父级判断。 */
function getSelectedDates(): string[] {
  return [...draft.value]
}

function reset(value: string | string[] = '') {
  draft.value = normalizeDateList(value)
}

defineExpose({
  prevMonth,
  nextMonth,
  goToday,
  getSelectedDates,
  reset,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
