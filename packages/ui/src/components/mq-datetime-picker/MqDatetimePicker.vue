<template>
  <mq-popup
    class="mq-datetime-picker"
    :model-value="visible"
    position="bottom"
    :title="popupTitle"
    :mask-closable="maskClosable"
    :duration="duration"
    :z-index="zIndex"
    @update:model-value="onVisible"
    @close="onPopupClose"
  >
    <view class="mq-datetime-picker__panel" @click.stop>
      <view class="mq-datetime-picker__header">
        <text
          class="mq-datetime-picker__action"
          role="button"
          tabindex="0"
          @click="onCancel"
          @keydown.enter.prevent="onCancel"
        >
          {{ cancelText }}
        </text>
        <text class="mq-datetime-picker__title">{{ title }}</text>
        <text
          class="mq-datetime-picker__action is-confirm"
          :class="{ 'is-pending': pending }"
          role="button"
          tabindex="0"
          @click="onConfirm"
          @keydown.enter.prevent="onConfirm"
        >
          {{ confirmText }}
        </text>
      </view>
      <mq-datetime-picker-view
        ref="viewRef"
        v-model="draft"
        :type="type"
        :item-height="itemHeight"
        :visible-item-count="visibleItemCount"
        :min-date="minDate"
        :max-date="maxDate"
        :min-hour="minHour"
        :max-hour="maxHour"
        :min-minute="minMinute"
        :max-minute="maxMinute"
        :use-second="useSecond"
        :min-second="minSecond"
        :max-second="maxSecond"
        :formatter="formatter"
        :immediate-change="immediateChange"
        @change="onChange"
      />
      <mq-safe-bottom v-if="safeArea" />
    </view>
  </mq-popup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MqPopup from '../mq-popup/MqPopup.vue'
import MqSafeBottom from '../mq-safe-bottom/MqSafeBottom.vue'
import MqDatetimePickerView from '../mq-datetime-picker-view/MqDatetimePickerView.vue'
import type { MqDatetimePickerViewExpose } from '../mq-datetime-picker-view/types'
import type { MqDatetimePickerEmits, MqDatetimePickerProps } from './types'

defineOptions({
  name: 'mq-datetime-picker',
})

const props = withDefaults(defineProps<MqDatetimePickerProps>(), {
  modelValue: undefined,
  visible: false,
  type: 'datetime',
  title: '',
  cancelText: '取消',
  confirmText: '确定',
  maskClosable: true,
  safeArea: true,
  itemHeight: 44,
  visibleItemCount: 6,
  minDate: undefined,
  maxDate: undefined,
  minHour: 0,
  maxHour: 23,
  minMinute: 0,
  maxMinute: 59,
  useSecond: false,
  minSecond: 0,
  maxSecond: 59,
  formatter: undefined,
  beforeConfirm: undefined,
  zIndex: undefined,
  duration: 200,
  immediateChange: false,
})

const emit = defineEmits<MqDatetimePickerEmits>()
const viewRef = ref<MqDatetimePickerViewExpose | null>(null)
const draft = ref<string | number>('')
const pending = ref(false)
let cancelPending = false

const popupTitle = computed(() => props.title || '选择日期')

const currentValue = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue
  }
  return viewRef.value?.correctValue(Date.now()) ?? Date.now()
})

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      cancelPending = false
      draft.value = currentValue.value
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
    if (props.visible && value !== undefined) {
      draft.value = value
    }
  },
)

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

function onChange(payload: { value: string | number }) {
  emit('change', { value: payload.value })
}

async function onConfirm() {
  if (pending.value || !props.visible) {
    return
  }
  const value = draft.value
  pending.value = true
  try {
    if (props.beforeConfirm) {
      const allowed = await props.beforeConfirm(value)
      if (allowed === false) {
        return
      }
    }
    cancelPending = false
    emit('update:modelValue', value)
    emit('confirm', { value })
    requestClose()
  } catch {
    // 校验函数抛错时留在面板里，让用户继续调整。
  } finally {
    pending.value = false
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
