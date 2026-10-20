<template>
  <mq-popup
    class="mq-cascader"
    :model-value="visible"
    position="bottom"
    :title="popupTitle"
    :mask-closable="maskClosable"
    :duration="duration"
    :z-index="zIndex"
    @update:model-value="onVisible"
    @close="onPopupClose"
  >
    <view class="mq-cascader__panel" @click.stop>
      <view class="mq-cascader__header">
        <text
          class="mq-cascader__action"
          role="button"
          tabindex="0"
          @click="onCancel"
          @keydown.enter.prevent="onCancel"
        >
          {{ cancelText }}
        </text>
        <text class="mq-cascader__title">{{ title }}</text>
        <text
          class="mq-cascader__action is-confirm"
          :class="{ 'is-disabled': !complete || pending }"
          role="button"
          tabindex="0"
          @click="onConfirm"
          @keydown.enter.prevent="onConfirm"
        >
          {{ confirmText }}
        </text>
      </view>

      <scroll-view class="mq-cascader__tabs" scroll-x :show-scrollbar="false">
        <view class="mq-cascader__tabs-inner">
          <text
            v-for="(option, index) in path"
            :key="`${String(option.value)}-${index}`"
            class="mq-cascader__tab"
            :class="{ 'is-active': index === activeIndex }"
            @click="activeIndex = index"
          >
            {{ option.text }}
          </text>
        </view>
      </scroll-view>

      <scroll-view class="mq-cascader__options" scroll-y>
        <view
          v-for="option in activeOptions"
          :key="String(option.value)"
          class="mq-cascader__option"
          :class="{
            'is-active': isActive(option),
            'is-disabled': option.disabled,
          }"
          :aria-disabled="option.disabled ? 'true' : undefined"
          @click="onSelect(option)"
        >
          <view class="mq-cascader__option-main">
            <text class="mq-cascader__option-text">{{ option.text }}</text>
            <text v-if="option.tip" class="mq-cascader__option-tip">{{ option.tip }}</text>
          </view>
          <text v-if="isActive(option)" class="mq-cascader__check">✓</text>
          <text
            v-else-if="option.children?.length && option.isLeaf !== true"
            class="mq-cascader__more"
          >
            ›
          </text>
        </view>
        <view v-if="!activeOptions.length" class="mq-cascader__empty">暂无可选项</view>
      </scroll-view>

      <mq-safe-bottom v-if="safeArea" />
    </view>
  </mq-popup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  cascaderLevels,
  cascaderValue,
  findCascaderPath,
  isCascaderComplete,
  selectCascaderOption,
} from '../../utils/cascader'
import type { MqCascaderOption } from '../../utils/cascader'
import MqPopup from '../mq-popup/MqPopup.vue'
import MqSafeBottom from '../mq-safe-bottom/MqSafeBottom.vue'
import type { MqCascaderEmits, MqCascaderProps } from './types'

defineOptions({
  name: 'mq-cascader',
})

const props = withDefaults(defineProps<MqCascaderProps>(), {
  modelValue: undefined,
  visible: false,
  options: () => [],
  title: '',
  cancelText: '取消',
  confirmText: '确定',
  checkStrictly: false,
  beforeConfirm: undefined,
  maskClosable: true,
  zIndex: undefined,
  duration: 200,
  safeArea: true,
})

const emit = defineEmits<MqCascaderEmits>()

const path = ref<MqCascaderOption[]>([])
const activeIndex = ref(0)
const pending = ref(false)
let cancelPending = false

const popupTitle = computed(() => props.title || '请选择')

const levels = computed(() => cascaderLevels(props.options, path.value))

const activeOptions = computed(() => {
  const index = Math.min(Math.max(activeIndex.value, 0), levels.value.length - 1)
  return levels.value[index] ?? []
})

const complete = computed(() => isCascaderComplete(path.value, props.checkStrictly))

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      cancelPending = false
      path.value = findCascaderPath(props.options, props.modelValue)
      activeIndex.value = Math.max(0, path.value.length - 1)
      emit('open')
      return
    }
    cancelPending = false
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  () => {
    if (props.visible) {
      path.value = findCascaderPath(props.options, props.modelValue)
      activeIndex.value = Math.max(0, path.value.length - 1)
    }
  },
)

function isActive(option: MqCascaderOption): boolean {
  return path.value.some((item) => String(item.value) === String(option.value) && item === option)
}

function onSelect(option: MqCascaderOption) {
  if (option.disabled) {
    return
  }
  const next = selectCascaderOption(path.value, activeIndex.value, option, props.checkStrictly)
  path.value = next.path
  activeIndex.value = next.activeIndex
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

async function onConfirm() {
  if (pending.value || !props.visible || !complete.value) {
    return
  }
  const value = cascaderValue(path.value)
  pending.value = true
  try {
    if (props.beforeConfirm) {
      const allowed = await props.beforeConfirm(value, [...path.value])
      if (allowed === false) {
        return
      }
    }
    cancelPending = false
    emit('update:modelValue', value)
    emit('confirm', { value, selectedOptions: [...path.value] })
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
