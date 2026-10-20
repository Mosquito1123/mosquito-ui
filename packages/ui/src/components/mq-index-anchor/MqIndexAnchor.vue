<template>
  <view :id="anchorId" class="mq-index-anchor" :class="{ 'is-sticky': sticky }">
    <slot>{{ index }}</slot>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from 'vue'
import { indexBarKey } from '../mq-index-bar/context'
import type { MqIndexAnchorProps } from './types'

defineOptions({
  name: 'mq-index-anchor',
})

const props = withDefaults(defineProps<MqIndexAnchorProps>(), {
  index: '',
})

const bar = inject(indexBarKey, null)
const sticky = computed(() => Boolean(bar?.sticky.value))
const anchorId = computed(() => `mq-index-${props.index}`)

onMounted(() => {
  if (bar && props.index !== '') {
    bar.register(props.index)
  }
})

onBeforeUnmount(() => {
  if (bar && props.index !== '') {
    bar.unregister(props.index)
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
