<template>
  <mq-popup
    class="mq-dialog"
    :model-value="modelValue"
    position="center"
    :title="titleText || '对话框'"
    :mask-closable="maskClosable"
    :duration="duration"
    :z-index="zIndex"
    @update:model-value="onVisible"
    @close="onClose"
  >
    <view class="mq-dialog__panel">
      <text v-if="titleText" class="mq-dialog__title">{{ titleText }}</text>
      <view class="mq-dialog__body">
        <slot>
          <text v-if="message" class="mq-dialog__message">{{ message }}</text>
        </slot>
      </view>
      <view class="mq-dialog__actions">
        <text
          v-if="showCancel"
          class="mq-dialog__btn mq-dialog__btn--cancel"
          role="button"
          tabindex="0"
          @click.stop="onCancel"
          @keydown.enter.prevent="onCancel"
          @keydown.space.prevent="onCancel"
        >
          {{ cancelLabel }}
        </text>
        <text
          class="mq-dialog__btn mq-dialog__btn--confirm"
          :class="{ 'is-pending': pending }"
          role="button"
          tabindex="0"
          @click.stop="onConfirm"
          @keydown.enter.prevent="onConfirm"
          @keydown.space.prevent="onConfirm"
        >
          {{ confirmLabel }}
        </text>
      </view>
    </view>
  </mq-popup>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MqPopup from '../mq-popup/MqPopup.vue'
import type { MqDialogEmits, MqDialogProps } from './types'

defineOptions({
  name: 'mq-dialog',
})

const props = withDefaults(defineProps<MqDialogProps>(), {
  modelValue: false,
  title: '',
  message: '',
  showCancel: true,
  confirmText: '确定',
  cancelText: '取消',
  maskClosable: false,
  duration: 200,
})

const emit = defineEmits<MqDialogEmits>()
const pending = ref(false)

const titleText = computed(() => props.title.trim())
const confirmLabel = computed(() => props.confirmText.trim() || '确定')
const cancelLabel = computed(() => props.cancelText.trim() || '取消')

function onVisible(value: boolean) {
  emit('update:modelValue', value)
}

function onClose() {
  emit('close')
}

function onCancel() {
  if (pending.value) {
    return
  }
  emit('cancel')
  emit('update:modelValue', false)
}

async function onConfirm() {
  if (pending.value) {
    return
  }
  if (props.beforeConfirm) {
    pending.value = true
    try {
      const allowed = await props.beforeConfirm()
      if (allowed === false) {
        return
      }
    } catch {
      return
    } finally {
      pending.value = false
    }
  }
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
