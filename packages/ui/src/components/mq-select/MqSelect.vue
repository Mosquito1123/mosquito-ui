<template>
  <mq-popup
    class="mq-select"
    :model-value="visible"
    position="bottom"
    :title="popupTitle"
    :mask-closable="maskClosable"
    :duration="duration"
    :z-index="zIndex"
    @update:model-value="onVisible"
    @close="onPopupClose"
  >
    <view class="mq-select__panel" @click.stop>
      <view class="mq-select__header">
        <text
          class="mq-select__action"
          role="button"
          tabindex="0"
          @click="onCancel"
          @keydown.enter.prevent="onCancel"
        >
          {{ cancelText }}
        </text>
        <text class="mq-select__title">{{ title }}</text>
        <text
          class="mq-select__action is-confirm"
          role="button"
          tabindex="0"
          @click="onConfirm"
          @keydown.enter.prevent="onConfirm"
        >
          {{ confirmText }}
        </text>
      </view>

      <view v-if="searchable" class="mq-select__search">
        <mq-input
          v-model="query"
          compact
          clearable
          :placeholder="placeholder"
          confirm-type="search"
        />
      </view>

      <scroll-view class="mq-select__options" scroll-y>
        <view
          v-for="option in filteredOptions"
          :key="String(option.value)"
          class="mq-select__option"
          :class="{
            'is-selected': isSelected(option),
            'is-disabled': option.disabled,
          }"
          :aria-disabled="option.disabled ? 'true' : undefined"
          @click="onSelect(option)"
        >
          <text class="mq-select__option-label">{{ option.label }}</text>
          <text v-if="isSelected(option)" class="mq-select__check">✓</text>
        </view>
        <view v-if="!filteredOptions.length" class="mq-select__empty">没有匹配的选项</view>
      </scroll-view>

      <mq-safe-bottom v-if="safeArea" />
    </view>
  </mq-popup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  filterSelectOptions,
  normalizeSelectValue,
  toggleSelectValue,
} from '../../utils/select'
import type { MqSelectOption } from '../../utils/select'
import MqInput from '../mq-input/MqInput.vue'
import MqPopup from '../mq-popup/MqPopup.vue'
import MqSafeBottom from '../mq-safe-bottom/MqSafeBottom.vue'
import type { MqSelectEmits, MqSelectProps } from './types'

defineOptions({
  name: 'mq-select',
})

const props = withDefaults(defineProps<MqSelectProps>(), {
  modelValue: undefined,
  visible: false,
  options: () => [],
  multiple: false,
  title: '',
  placeholder: '搜索',
  searchable: false,
  cancelText: '取消',
  confirmText: '确定',
  maskClosable: true,
  zIndex: undefined,
  duration: 200,
  safeArea: true,
})

const emit = defineEmits<MqSelectEmits>()

const draft = ref<Array<string | number>>([])
const query = ref('')
let cancelPending = false

const popupTitle = computed(() => props.title || '请选择')

const filteredOptions = computed(() =>
  props.searchable ? filterSelectOptions(props.options, query.value) : props.options,
)

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      cancelPending = false
      draft.value = normalizeSelectValue(props.modelValue)
      query.value = ''
      emit('open')
      return
    }
    cancelPending = false
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (value) => {
    if (props.visible) {
      draft.value = normalizeSelectValue(value)
    }
  },
)

function isSelected(option: MqSelectOption): boolean {
  return draft.value.includes(option.value)
}

function requestClose() {
  emit('update:visible', false)
}

function open() {
  if (props.visible) {
    return
  }
  emit('update:visible', true)
}

function close() {
  if (!props.visible) {
    return
  }
  cancelPending = false
  requestClose()
}

function onVisible(value: boolean) {
  emit('update:visible', value)
  if (!value) {
    cancelPending = true
  }
}

function onCancel() {
  cancelPending = true
  requestClose()
}

function onPopupClose() {
  emit('close')
  if (cancelPending) {
    cancelPending = false
    emit('cancel')
  }
}

function commit(value: MqSelectOption['value'] | Array<string | number>) {
  cancelPending = false
  emit('update:modelValue', value)
  emit('change', { value })
  emit('confirm', { value })
  requestClose()
}

function onSelect(option: MqSelectOption) {
  if (option.disabled) {
    return
  }
  if (!props.multiple) {
    commit(option.value)
    return
  }
  draft.value = toggleSelectValue(draft.value, option.value, true)
}

function onConfirm() {
  if (!props.visible) {
    return
  }
  commit(props.multiple ? [...draft.value] : draft.value[0])
}

defineExpose({
  open,
  close,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
