<template>
  <view class="mq-password-input" @click.stop="onFocus">
    <view class="mq-password-input__cells">
      <view
        v-for="index in length"
        :key="index"
        class="mq-password-input__cell"
        :class="{ 'is-focus': focused && index - 1 === value.length }"
        :style="cellStyle"
      >
        <view v-if="mask && chars[index - 1]" class="mq-password-input__dot" />
        <text v-else-if="chars[index - 1]">{{ chars[index - 1] }}</text>
        <view v-else-if="focused && index - 1 === value.length" class="mq-password-input__cursor" />
      </view>
    </view>
    <text v-if="errorInfo" class="mq-password-input__info is-error">{{ errorInfo }}</text>
    <text v-else-if="info" class="mq-password-input__info">{{ info }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqPasswordInputEmits, MqPasswordInputProps } from './types'

defineOptions({
  name: 'mq-password-input',
})

const props = withDefaults(defineProps<MqPasswordInputProps>(), {
  modelValue: '',
  mask: true,
  info: '',
  errorInfo: '',
  gutter: 0,
  length: 6,
  focused: false,
})

const emit = defineEmits<MqPasswordInputEmits>()

const length = computed(() => {
  if (!Number.isFinite(props.length) || props.length < 1) {
    return 6
  }
  return Math.floor(props.length)
})

const value = computed(() => String(props.modelValue ?? '').slice(0, length.value))
const chars = computed(() => value.value.split(''))

const cellStyle = computed(() => {
  const gutter =
    typeof props.gutter === 'number'
      ? props.gutter
      : Number.parseFloat(String(props.gutter || '0')) || 0
  if (gutter <= 0) {
    return { marginLeft: '-1px' }
  }
  return { marginLeft: `${gutter}px` }
})

function onFocus(event: Event) {
  emit('focus', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
