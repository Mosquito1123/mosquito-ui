<template>
  <view ref="panelRef" class="mq-calendar-view" :style="panelStyle">
    <view v-for="month in months" :key="month.key" class="mq-calendar-view__month" :data-month="month.key">
      <text v-if="showPanelTitle" class="mq-calendar-view__title">
        {{ t('calendar.monthTitle', { year: month.year, month: month.month }) }}
      </text>

      <view class="mq-calendar-view__weekdays">
        <text v-for="(weekday, index) in weekdays" :key="index" class="mq-calendar-view__weekday">
          {{ weekday }}
        </text>
      </view>

      <view class="mq-calendar-view__grid">
        <view
          v-for="cell in month.cells"
          :key="cell.date"
          class="mq-calendar-view__cell"
          :class="{ 'is-selected': isSelected(cell.date), 'is-disabled': isDisabled(cell.date) }"
          role="button"
          :tabindex="isDisabled(cell.date) ? -1 : 0"
          :aria-disabled="isDisabled(cell.date) ? 'true' : 'false'"
          @click="onPick(cell.date)"
          @keydown.enter.prevent="onPick(cell.date)"
        >
          <text class="mq-calendar-view__day">{{ cell.day }}</text>
        </view>
      </view>
    </view>

    <text v-if="rangeError" class="mq-calendar-view__error" role="alert">{{ rangeError }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { t } from '../../locale'
import {
  addMonths,
  buildCalendarDays,
  isDateBetween,
  normalizeDateList,
  nextDateSelection,
  normalizeDate,
  todayString,
} from '../../utils/date'
import type { MqCalendarViewEmits, MqCalendarViewProps } from './types'

defineOptions({
  name: 'mq-calendar-view',
})

const props = withDefaults(defineProps<MqCalendarViewProps>(), {
  modelValue: '',
  month: '',
  type: 'date',
  minDate: '',
  maxDate: '',
  disabledDate: undefined,
  maxRange: undefined,
  allowSameDay: false,
  showPanelTitle: true,
  defaultTime: '00:00:00',
  panelHeight: undefined,
  firstDayOfWeek: 0,
})

const emit = defineEmits<MqCalendarViewEmits>()
const panelRef = ref<{ scrollTop?: number; querySelector?: (selector: string) => unknown } | null>(null)
const draft = ref<string[]>([])
const rangeError = ref('')

const isRange = computed(() => props.type === 'daterange' || props.type === 'datetimerange')
const hasTime = computed(() => props.type === 'datetime' || props.type === 'datetimerange')
const weekdayKeys = [
  'calendar.weekdays.sunday',
  'calendar.weekdays.monday',
  'calendar.weekdays.tuesday',
  'calendar.weekdays.wednesday',
  'calendar.weekdays.thursday',
  'calendar.weekdays.friday',
  'calendar.weekdays.saturday',
] as const

const weekdays = computed(() =>
  Array.from({ length: 7 }, (_, index) => t(weekdayKeys[(index + props.firstDayOfWeek) % 7])),
)

function stripTime(value: string | number | null | undefined): string {
  return String(value ?? '').slice(0, 10)
}

function initialValue() {
  const list = normalizeDateList(props.modelValue).map((item) => stripTime(item))
  return list.length ? list : [todayString()]
}

const months = computed(() => {
  const first = normalizeDate(props.month) || initialValue()[0]
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(first)
  const year = parts ? Number(parts[1]) : new Date().getFullYear()
  const month = parts ? Number(parts[2]) : new Date().getMonth() + 1
  const base = addMonths(year, month, -1)

  return Array.from({ length: 3 }, (_, index) => {
    const current = addMonths(base.year, base.month, index)
    return {
      key: `${current.year}-${String(current.month).padStart(2, '0')}`,
      year: current.year,
      month: current.month,
      cells: buildCalendarDays(current.year, current.month, props.firstDayOfWeek).filter(
        (cell) => cell.currentMonth,
      ),
    }
  })
})

const panelStyle = computed(() =>
  props.panelHeight === undefined ? undefined : { maxHeight: `${props.panelHeight}px` },
)

watch(
  () => props.modelValue,
  (value) => {
    draft.value = normalizeDateList(value).map((item) => stripTime(item))
  },
  { immediate: true, deep: true },
)

function isDisabled(date: string): boolean {
  if (!isDateBetween(date, props.minDate, props.maxDate)) {
    return true
  }
  return props.disabledDate?.(date) === true
}

function isSelected(date: string): boolean {
  return draft.value.includes(date)
}

function timeAt(index: number): string {
  const value = Array.isArray(props.defaultTime) ? props.defaultTime[index] : props.defaultTime
  return /^\d{2}:\d{2}:\d{2}$/.test(String(value)) ? String(value) : '00:00:00'
}

function publish(value: string[]) {
  const result = hasTime.value
    ? value.map((date, index) => `${date} ${timeAt(isRange.value ? index : 0)}`)
    : value
  const output = isRange.value ? result : (result[0] ?? '')
  emit('update:modelValue', output)
  emit('change', { value: output })
}

function dayDiff(start: string, end: string): number {
  const toTime = (date: string) => {
    const [year, month, day] = date.split('-').map(Number)
    return Date.UTC(year, month - 1, day)
  }
  return Math.round(Math.abs(toTime(end) - toTime(start)) / 86_400_000) + 1
}

function onPick(date: string) {
  if (isDisabled(date)) {
    return
  }
  rangeError.value = ''
  const next = nextDateSelection(draft.value, date, isRange.value ? 'range' : 'single')

  if (isRange.value && next.length === 2) {
    if (!props.allowSameDay && next[0] === next[1]) {
      draft.value = [next[0]]
      rangeError.value = t('calendar.sameDay')
      return
    }
    if (props.maxRange !== undefined && props.maxRange > 0 && dayDiff(next[0], next[1]) > props.maxRange) {
      draft.value = [next[0]]
      rangeError.value = t('calendar.maxRange', { count: props.maxRange })
      return
    }
  }

  draft.value = next
  publish(next)
}

function scrollIntoView() {
  try {
    const root = panelRef.value
    const target = root?.querySelector?.(`[data-month="${draft.value[0]?.slice(0, 7)}"]`)
    if (root && target && typeof root.scrollTop === 'number') {
      root.scrollTop = 0
    }
  } catch {
    // jsdom / 原生端没有布局信息时静默跳过。
  }
}

defineExpose({
  scrollIntoView,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
