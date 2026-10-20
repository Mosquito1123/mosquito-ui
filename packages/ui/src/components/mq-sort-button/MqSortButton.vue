<template>
  <view class="mq-sort-button" :class="{ 'is-line': line }" role="button" @click.stop="onToggle">
    <text class="mq-sort-button__title">{{ title }}</text>
    <view class="mq-sort-button__arrows" aria-hidden="true">
      <text :class="{ 'is-on': modelValue === 1 }">▲</text>
      <text :class="{ 'is-on': modelValue === -1 }">▼</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { nextSortValue } from '../../utils/model'
import type { MqSortButtonEmits, MqSortButtonProps, MqSortButtonValue } from './types'

defineOptions({
  name: 'mq-sort-button',
})

const props = withDefaults(defineProps<MqSortButtonProps>(), {
  modelValue: 0,
  title: '',
  allowReset: false,
  descFirst: false,
  line: false,
})

const emit = defineEmits<MqSortButtonEmits>()

function onToggle() {
  const next = nextSortValue(props.modelValue as MqSortButtonValue, {
    allowReset: props.allowReset,
    descFirst: props.descFirst,
  })
  emit('update:modelValue', next)
  emit('change', { value: next })
}
</script>

<style lang="scss">
@import './index.scss';
</style>
