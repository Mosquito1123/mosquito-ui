<template>
  <view class="mq-col-picker" :class="{ 'is-error': error, 'is-large': size === 'large' }">
    <view
      class="mq-col-picker__trigger"
      role="button"
      tabindex="0"
      :aria-disabled="disabled ? 'true' : 'false'"
      @click="open"
      @keydown.enter.prevent="open"
    >
      <text v-if="label" class="mq-col-picker__label" :style="labelStyle">
        <text v-if="required" class="mq-col-picker__required">*</text>{{ label }}
      </text>
      <text class="mq-col-picker__value" :class="{ 'is-placeholder': !displayText, 'is-right': alignRight }">
        {{ displayText || placeholder }}
      </text>
      <text class="mq-col-picker__arrow" aria-hidden="true">›</text>
    </view>

    <mq-popup
      :model-value="visible"
      position="bottom"
      :title="title || t('common.picker')"
      :mask-closable="maskClosable"
      :z-index="zIndex"
      @update:model-value="onVisible"
    >
      <view class="mq-col-picker__header">
        <text
          class="mq-col-picker__action"
          role="button"
          tabindex="0"
          @click="cancel"
          @keydown.enter.prevent="cancel"
        >
          {{ t('common.cancel') }}
        </text>
        <text
          class="mq-col-picker__action is-confirm"
          :class="{ 'is-pending': loading }"
          role="button"
          tabindex="0"
          @click="onConfirm"
          @keydown.enter.prevent="onConfirm"
        >
          {{ t('common.confirm') }}
        </text>
      </view>

      <view v-if="loading" class="mq-col-picker__loading">{{ t('common.loading') }}</view>

      <view class="mq-col-picker__columns">
        <scroll-view
          v-for="(column, columnIndex) in columnsState"
          :key="columnIndex"
          class="mq-col-picker__column"
        >
          <view
            v-for="(option, rowIndex) in column"
            :key="String(option.value)"
            class="mq-col-picker__item"
            :class="{
              'is-active': isActive(columnIndex, option),
              'is-disabled': option.disabled,
              'is-ellipsis': ellipsis,
            }"
            role="button"
            :tabindex="option.disabled ? -1 : 0"
            :aria-disabled="option.disabled ? 'true' : 'false'"
            @click="onSelect(columnIndex, rowIndex)"
            @keydown.enter.prevent="onSelect(columnIndex, rowIndex)"
          >
            <text class="mq-col-picker__item-label">{{ option.label }}</text>
            <text v-if="option.tip" class="mq-col-picker__item-tip">{{ option.tip }}</text>
          </view>
        </scroll-view>
      </view>
    </mq-popup>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { t } from '../../locale'
import MqPopup from '../mq-popup/MqPopup.vue'
import type {
  MqColPickerColumnChangePayload,
  MqColPickerEmits,
  MqColPickerOption,
  MqColPickerProps,
} from './types'

defineOptions({
  name: 'mq-col-picker',
})

const props = withDefaults(defineProps<MqColPickerProps>(), {
  modelValue: () => [],
  columns: () => [],
  columnChange: undefined,
  label: '',
  title: '',
  placeholder: '',
  disabled: false,
  readonly: false,
  displayFormat: undefined,
  size: 'normal',
  labelWidth: '',
  error: false,
  required: false,
  alignRight: false,
  beforeConfirm: undefined,
  maskClosable: true,
  zIndex: undefined,
  autoComplete: false,
  ellipsis: false,
})

const emit = defineEmits<MqColPickerEmits>()

const visible = ref(false)
const loading = ref(false)
const columnsState = ref<MqColPickerOption[][]>([])
const values = ref<Array<string | number>>([])

const placeholder = computed(() => props.placeholder || t('common.select'))
const labelStyle = computed(() => (props.labelWidth ? { width: props.labelWidth } : undefined))

const selectedItems = computed(() =>
  columnsState.value
    .map(
      (column, index) => column.find((item) => !item.disabled && item.value === values.value[index]) ?? null,
    )
    .filter((item): item is MqColPickerOption => item !== null),
)

const displayText = computed(() => {
  if (props.displayFormat && selectedItems.value.length) {
    return props.displayFormat(selectedItems.value)
  }
  return selectedItems.value
    .map((item) => item.label)
    .filter(Boolean)
    .join(' ')
})

function cloneColumns(columns: readonly MqColPickerOption[][]): MqColPickerOption[][] {
  return columns.map((column) => column.map((item) => ({ ...item })))
}

watch(
  () => props.columns,
  (columns) => {
    columnsState.value = cloneColumns(columns)
  },
  { immediate: true, deep: true },
)

watch(
  () => props.modelValue,
  (value) => {
    values.value = [...value]
  },
  { immediate: true, deep: true },
)

function isActive(columnIndex: number, option: MqColPickerOption): boolean {
  return values.value[columnIndex] === option.value
}

function onVisible(next: boolean) {
  if (!next && visible.value) {
    visible.value = false
    emit('close')
  }
}

function open() {
  if (props.disabled || visible.value) {
    return
  }
  columnsState.value = cloneColumns(props.columns)
  values.value = [...props.modelValue]
  visible.value = true

  if (
    props.autoComplete &&
    props.columnChange &&
    columnsState.value.length === 0 &&
    values.value.length > 0
  ) {
    runColumnChange(0, 0, { value: values.value[0], label: '' })
  }
}

function close() {
  if (!visible.value) {
    return
  }
  visible.value = false
  emit('close')
}

function cancel() {
  close()
}

function commit() {
  const value = [...values.value]
  const items = selectedItems.value.map((item) => ({ ...item }))
  emit('update:modelValue', value)
  close()
  emit('confirm', { value, selectedItems: items })
}

function runColumnChange(index: number, rowIndex: number, selectedItem: MqColPickerOption) {
  const change = props.columnChange
  if (!change) {
    return false
  }
  loading.value = true
  let settled = false
  const payload: MqColPickerColumnChangePayload = {
    selectedItem,
    index,
    rowIndex,
    resolve: (options) => {
      if (settled) {
        return
      }
      settled = true
      loading.value = false
      const next = (options ?? []).map((item) => ({ ...item }))
      if (!next.length) {
        return
      }
      columnsState.value = [...columnsState.value.slice(0, index + 1), next]
      values.value = [
        ...values.value.slice(0, index + 1),
        next.find((item) => !item.disabled)?.value ?? next[0].value,
      ]
    },
    finish: (ok = true) => {
      if (settled) {
        return
      }
      settled = true
      loading.value = false
      if (ok) {
        commit()
      } else {
        close()
      }
    },
  }

  try {
    Promise.resolve(change(payload)).catch(() => {
      loading.value = false
    })
  } catch {
    loading.value = false
  }
  return true
}

function onSelect(columnIndex: number, rowIndex: number) {
  if (props.disabled || props.readonly || loading.value) {
    return
  }
  const option = columnsState.value[columnIndex]?.[rowIndex]
  if (!option || option.disabled) {
    return
  }

  values.value = [...values.value.slice(0, columnIndex), option.value]
  const changed = runColumnChange(columnIndex, rowIndex, option)
  if (!changed && columnIndex === columnsState.value.length - 1) {
    commit()
  }
}

async function onConfirm() {
  if (props.disabled || props.readonly || loading.value || !visible.value) {
    return
  }
  loading.value = true
  try {
    if (props.beforeConfirm) {
      const allowed = await props.beforeConfirm(
        [...values.value],
        selectedItems.value.map((item) => ({ ...item })),
      )
      if (allowed === false) {
        return
      }
    }
    commit()
  } catch {
    // 校验异常时留在面板里。
  } finally {
    loading.value = false
  }
}

defineExpose({
  open,
  close,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
