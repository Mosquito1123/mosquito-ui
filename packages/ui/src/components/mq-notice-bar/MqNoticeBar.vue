<template>
  <view
    v-if="!dismissed"
    class="mq-notice"
    :class="[`is-${type}`, { 'is-wrap': wrapable }]"
    :style="rootStyle"
    role="status"
    @click="onClick"
  >
    <view v-if="slots.prefix" class="mq-notice__prefix">
      <slot name="prefix" />
    </view>
    <view class="mq-notice__body">
      <text class="mq-notice__text" :class="{ 'is-scroll': scrolling }">{{ text }}</text>
    </view>
    <text v-if="closable" class="mq-notice__close" aria-label="关闭" @click.stop="onClose">×</text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import type { MqNoticeBarEmits, MqNoticeBarProps } from './types'

defineOptions({
  name: 'mq-notice-bar',
})

const props = withDefaults(defineProps<MqNoticeBarProps>(), {
  text: '',
  type: 'warning',
  closable: false,
  scrollable: false,
  wrapable: false,
  color: '',
  background: '',
})

const emit = defineEmits<MqNoticeBarEmits>()
const slots = useSlots()
const dismissed = ref(false)

const scrolling = computed(() => props.scrollable && !props.wrapable && props.text.trim() !== '')

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color) {
    style.color = props.color
  }
  if (props.background) {
    style.background = props.background
  }
  return style
})

function onClick() {
  emit('click')
}

function onClose() {
  dismissed.value = true
  emit('close')
}
</script>

<style lang="scss">
@import './index.scss';
</style>
