<template>
  <view class="mq-tooltip">
    <view class="mq-tooltip__reference" @click.stop="onToggle">
      <slot />
    </view>
    <view v-if="modelValue" class="mq-tooltip__pop" :class="`is-${placement}`" @click.stop>
      <slot name="content">{{ content }}</slot>
      <text v-if="showClose" class="mq-tooltip__close" @click.stop="close">×</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { registerOutsideCloser } from '../../utils/queue'
import type { MqTooltipEmits, MqTooltipProps } from './types'

defineOptions({
  name: 'mq-tooltip',
})

const props = withDefaults(defineProps<MqTooltipProps>(), {
  modelValue: false,
  content: '',
  placement: 'top',
  disabled: false,
  showClose: false,
})

const emit = defineEmits<MqTooltipEmits>()

function open() {
  if (props.disabled || props.modelValue) {
    return
  }
  emit('update:modelValue', true)
  emit('open')
}

function close() {
  if (!props.modelValue) {
    return
  }
  emit('update:modelValue', false)
  emit('close')
}

function onToggle() {
  if (props.disabled) {
    return
  }
  if (props.modelValue) {
    close()
    return
  }
  open()
}

let unregister: (() => void) | undefined

onMounted(() => {
  unregister = registerOutsideCloser(() => {
    close()
  })
})

onBeforeUnmount(() => {
  unregister?.()
})

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      close()
    }
  },
)
</script>

<style lang="scss">
@import './index.scss';
</style>
