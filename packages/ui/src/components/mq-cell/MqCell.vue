<template>
  <view
    class="mq-cell"
    :class="{ 'is-link': isLink }"
    :hover-class="isLink ? 'mq-cell--pressed' : 'none'"
    @click="onClick"
  >
    <text class="mq-cell__title">{{ title }}</text>
    <text v-if="showValue" class="mq-cell__value">{{ value }}</text>
    <text v-if="isLink" class="mq-cell__arrow">›</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqCellProps } from './types'

defineOptions({
  name: 'mq-cell',
})

const props = withDefaults(defineProps<MqCellProps>(), {
  title: '',
  isLink: false,
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const showValue = computed(() => props.value !== undefined && props.value !== '')

function onClick(event: Event) {
  emit('click', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
