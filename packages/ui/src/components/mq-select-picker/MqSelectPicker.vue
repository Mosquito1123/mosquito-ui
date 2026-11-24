<template>
  <mq-popup
    class="mq-select-picker"
    :model-value="visible"
    position="bottom"
    :title="popupTitle"
    :mask-closable="maskClosable"
    @update:model-value="onVisible"
    @close="onPopupClose"
  >
    <view class="mq-select-picker__panel" @click.stop>
      <view class="mq-select-picker__header">
        <text
          class="mq-select-picker__action"
          role="button"
          tabindex="0"
          @click="onCancel"
          @keydown.enter.prevent="onCancel"
        >
          取消
        </text>
        <text class="mq-select-picker__title">{{ title }}</text>
        <text
          class="mq-select-picker__action is-confirm"
          role="button"
          tabindex="0"
          @click="onConfirm"
          @keydown.enter.prevent="onConfirm"
        >
          确定
        </text>
      </view>
      <scroll-view class="mq-select-picker__options" scroll-y>
        <view
          v-for="(option, index) in normalizedOptions"
          :key="index"
          class="mq-select-picker__option"
          :class="{
            'is-selected': option.value === draft,
            'is-disabled': option.disabled || disabled,
          }"
          :aria-disabled="option.disabled || disabled ? 'true' : undefined"
          @click="onSelect(option)"
        >
          <text class="mq-select-picker__label">{{ option.label }}</text>
          <text v-if="option.value === draft" class="mq-select-picker__check">✓</text>
        </view>
        <view v-if="!normalizedOptions.length" class="mq-select-picker__empty">暂无选项</view>
      </scroll-view>
      <view v-if="safeArea" class="mq-select-picker__safe-bottom" />
    </view>
  </mq-popup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MqPopup from '../mq-popup/MqPopup.vue'
import type {
  MqSelectPickerEmits,
  MqSelectPickerNormalizedOption,
  MqSelectPickerOptionInput,
  MqSelectPickerPayload,
  MqSelectPickerProps,
  MqSelectPickerValue,
} from './types'

defineOptions({
  name: 'mq-select-picker',
})

const props = withDefaults(defineProps<MqSelectPickerProps>(), {
  modelValue: undefined,
  options: () => [],
  visible: false,
  title: '',
  valueKey: 'value',
  labelKey: 'label',
  disabled: false,
  maskClosable: true,
  safeArea: true,
})

const emit = defineEmits<MqSelectPickerEmits>()

const draft = ref<MqSelectPickerValue>(props.modelValue)
let cancelSent = false
let closeSent = false

const popupTitle = computed(() => props.title || '请选择')

const normalizedOptions = computed<MqSelectPickerNormalizedOption[]>(() =>
  props.options.map((raw) => normalizeOption(raw, props.valueKey, props.labelKey)),
)

function normalizeOption(
  raw: MqSelectPickerOptionInput,
  valueKey: string,
  labelKey: string,
): MqSelectPickerNormalizedOption {
  if (raw !== null && typeof raw === 'object') {
    const record = raw as Record<string, unknown>
    const rawValue = record[valueKey] ?? record.value
    const value: MqSelectPickerValue =
      typeof rawValue === 'string' || typeof rawValue === 'number' ? rawValue : undefined
    const rawLabel = record[labelKey] ?? record.label ?? rawValue
    return {
      value,
      label: rawLabel == null || rawLabel === '' ? String(value ?? '') : String(rawLabel),
      disabled: Boolean(record.disabled),
      raw,
    }
  }
  return { value: raw, label: String(raw), disabled: false, raw }
}

function makePayload(option?: MqSelectPickerNormalizedOption): MqSelectPickerPayload {
  return {
    value: draft.value,
    label: option?.label ?? '',
    option: option?.raw,
  }
}

function fireCancel() {
  if (cancelSent) {
    return
  }
  cancelSent = true
  emit('cancel')
}

function fireClose() {
  if (closeSent) {
    return
  }
  closeSent = true
  emit('close')
}

function requestClose() {
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      if (props.disabled) {
        requestClose()
        return
      }
      cancelSent = false
      closeSent = false
      draft.value = props.modelValue
      emit('open')
      return
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (value) => {
    if (props.visible) {
      draft.value = value
    }
  },
)

function onVisible(value: boolean) {
  emit('update:visible', value)
  if (!value) {
    fireCancel()
    fireClose()
  }
}

function onPopupClose() {
  fireClose()
}

function onSelect(option: MqSelectPickerNormalizedOption) {
  if (props.disabled || !props.visible || option.disabled || option.value === draft.value) {
    return
  }
  draft.value = option.value
  emit('change', makePayload(option))
}

function onConfirm() {
  if (props.disabled || !props.visible) {
    return
  }
  cancelSent = true
  const option = normalizedOptions.value.find((item) => item.value === draft.value)
  const payload = makePayload(option)
  emit('update:modelValue', payload.value)
  emit('confirm', payload)
  fireClose()
  requestClose()
}

function onCancel() {
  if (props.disabled || !props.visible) {
    return
  }
  fireCancel()
  fireClose()
  requestClose()
}

function open() {
  if (props.disabled || props.visible) {
    return
  }
  cancelSent = false
  closeSent = false
  emit('update:visible', true)
}

function close() {
  if (!props.visible) {
    return
  }
  cancelSent = true
  fireClose()
  requestClose()
}

defineExpose({
  open,
  close,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
