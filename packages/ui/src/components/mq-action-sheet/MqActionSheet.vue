<template>
  <mq-popup
    class="mq-action-sheet"
    :model-value="modelValue"
    position="bottom"
    :title="dialogLabel"
    :mask-closable="maskClosable"
    :duration="duration"
    :z-index="zIndex"
    @update:model-value="onVisible"
    @close="onClose"
  >
    <view class="mq-action-sheet__panel">
      <text v-if="titleText" class="mq-action-sheet__title">{{ titleText }}</text>
      <view
        v-for="(item, index) in actions"
        :key="index"
        class="mq-action-sheet__row"
        :class="{ 'is-disabled': item.disabled, 'is-loading': item.loading }"
        role="button"
        :aria-disabled="item.disabled || item.loading ? 'true' : undefined"
        :tabindex="item.disabled || item.loading ? undefined : 0"
        :hover-class="item.disabled || item.loading ? 'none' : 'mq-action-sheet__row--pressed'"
        @click.stop="onSelect(item, index)"
        @keydown.enter.prevent="onSelect(item, index)"
        @keydown.space.prevent="onSelect(item, index)"
      >
        <text class="mq-action-sheet__name" :style="item.color ? { color: item.color } : undefined">{{
          item.name
        }}</text>
        <text v-if="item.description" class="mq-action-sheet__desc">{{ item.description }}</text>
        <text v-if="item.loading" class="mq-action-sheet__loading" aria-hidden="true">…</text>
      </view>
      <view
        v-if="cancelLabel"
        class="mq-action-sheet__cancel"
        role="button"
        tabindex="0"
        hover-class="mq-action-sheet__row--pressed"
        @click.stop="onCancel"
        @keydown.enter.prevent="onCancel"
        @keydown.space.prevent="onCancel"
      >
        <text class="mq-action-sheet__name">{{ cancelLabel }}</text>
      </view>
      <mq-safe-bottom />
    </view>
  </mq-popup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t } from '../../locale'
import MqPopup from '../mq-popup/MqPopup.vue'
import MqSafeBottom from '../mq-safe-bottom/MqSafeBottom.vue'
import type { MqActionSheetEmits, MqActionSheetItem, MqActionSheetProps } from './types'

defineOptions({
  name: 'mq-action-sheet',
})

const props = withDefaults(defineProps<MqActionSheetProps>(), {
  modelValue: false,
  actions: () => [],
  title: '',
  maskClosable: true,
  closeOnClickAction: true,
  duration: 200,
})

const emit = defineEmits<MqActionSheetEmits>()

const titleText = computed(() => props.title.trim())
const cancelLabel = computed(() => props.cancelText?.trim() || t('common.cancel'))
const dialogLabel = computed(() => titleText.value || t('common.operation'))

function onVisible(value: boolean) {
  emit('update:modelValue', value)
}

function onClose() {
  emit('close')
}

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function onSelect(item: MqActionSheetItem, index: number) {
  if (item.disabled || item.loading) {
    return
  }
  emit('select', { item, index })
  if (props.closeOnClickAction) {
    emit('update:modelValue', false)
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
