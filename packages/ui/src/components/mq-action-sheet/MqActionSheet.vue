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
        :class="{ 'is-disabled': item.disabled }"
        role="button"
        :aria-disabled="item.disabled ? 'true' : undefined"
        :tabindex="item.disabled ? undefined : 0"
        :hover-class="item.disabled ? 'none' : 'mq-action-sheet__row--pressed'"
        @click.stop="onSelect(item, index)"
        @keydown.enter.prevent="onSelect(item, index)"
        @keydown.space.prevent="onSelect(item, index)"
      >
        <text class="mq-action-sheet__name" :style="item.color ? { color: item.color } : undefined">{{ item.name }}</text>
        <text v-if="item.description" class="mq-action-sheet__desc">{{ item.description }}</text>
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
  cancelText: '取消',
  maskClosable: true,
  duration: 200,
})

const emit = defineEmits<MqActionSheetEmits>()

const titleText = computed(() => props.title.trim())
const cancelLabel = computed(() => props.cancelText.trim())
const dialogLabel = computed(() => titleText.value || '操作')

function onVisible(value: boolean) {
  emit('update:modelValue', value)
}

function onClose() {
  emit('close')
}

function onCancel() {
  emit('update:modelValue', false)
}

function onSelect(item: MqActionSheetItem, index: number) {
  if (item.disabled) {
    return
  }
  emit('select', { item, index })
  emit('update:modelValue', false)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
