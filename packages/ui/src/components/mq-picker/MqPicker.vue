<template>
  <mq-popup
    class="mq-picker"
    :model-value="visible"
    position="bottom"
    :title="popupTitle"
    :mask-closable="maskClosable"
    :duration="duration"
    :z-index="zIndex"
    @update:model-value="onVisible"
    @close="onPopupClose"
  >
    <view class="mq-picker__panel" @click.stop>
      <view class="mq-picker__header">
        <text
          class="mq-picker__action"
          role="button"
          tabindex="0"
          @click="onCancel"
          @keydown.enter.prevent="onCancel"
        >
          {{ cancelText }}
        </text>
        <text class="mq-picker__title">{{ title }}</text>
        <text
          class="mq-picker__action is-confirm"
          :class="{ 'is-pending': pending }"
          role="button"
          tabindex="0"
          @click="onConfirm"
          @keydown.enter.prevent="onConfirm"
        >
          {{ confirmText }}
        </text>
      </view>
      <mq-picker-view
        ref="viewRef"
        v-model="draft"
        :columns="columns"
        :cascade="cascade"
        :value-key="valueKey"
        :label-key="labelKey"
        :children-key="childrenKey"
        :item-height="itemHeight"
        :visible-item-count="visibleItemCount"
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
import MqPickerView from '../mq-picker-view/MqPickerView.vue'
import type { MqPickerChangePayload, MqPickerViewExpose } from '../mq-picker-view/types'
import type { MqPickerEmits, MqPickerProps } from './types'

defineOptions({
  name: 'mq-picker',
})

const props = withDefaults(defineProps<MqPickerProps>(), {
  modelValue: () => [],
  visible: false,
  columns: () => [],
  cascade: false,
  title: '',
  cancelText: '取消',
  confirmText: '确定',
  valueKey: 'value',
  labelKey: 'label',
  childrenKey: 'children',
  itemHeight: 44,
  visibleItemCount: 6,
  beforeConfirm: undefined,
  maskClosable: true,
  zIndex: undefined,
  duration: 200,
  safeArea: true,
  immediateChange: false,
})

const emit = defineEmits<MqPickerEmits>()
const viewRef = ref<MqPickerViewExpose | null>(null)
const draft = ref<Array<string | number>>([])
const pending = ref(false)
let cancelPending = false

const popupTitle = computed(() => props.title || '选择器')

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      cancelPending = false
      draft.value = [...props.modelValue]
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
      draft.value = [...value]
    }
  },
  { deep: true },
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

function onChange(payload: MqPickerChangePayload) {
  emit('change', payload)
}

async function onConfirm() {
  if (pending.value || !props.visible) {
    return
  }
  const payload = viewRef.value?.getChangePayload()
  if (!payload) {
    return
  }
  pending.value = true
  try {
    if (props.beforeConfirm) {
      const allowed = await props.beforeConfirm(payload.selectedValues, payload)
      if (allowed === false) {
        return
      }
    }
    cancelPending = false
    emit('update:modelValue', payload.selectedValues)
    emit('confirm', {
      value: payload.selectedValues,
      selectedItems: payload.selectedOptions,
      selectedLabels: payload.selectedLabels,
      selectedIndexes: payload.selectedIndexes,
    })
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
