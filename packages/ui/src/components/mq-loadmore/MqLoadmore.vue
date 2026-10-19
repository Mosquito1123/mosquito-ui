<template>
  <view
    class="mq-loadmore"
    :class="state ? `is-${state}` : undefined"
    role="status"
    @click.stop="onReload"
  >
    <slot v-if="state === 'loading'" name="loading">
      <view class="mq-loadmore__spin" aria-hidden="true" />
      <text>{{ loadingText }}</text>
    </slot>
    <slot v-else-if="state === 'finished'" name="finished">
      <text>{{ finishedText }}</text>
    </slot>
    <slot v-else-if="state === 'error'" name="error">
      <text>{{ errorText }}</text>
      <text class="mq-loadmore__hint">点击重试</text>
    </slot>
  </view>
</template>

<script setup lang="ts">
import type { MqLoadmoreEmits, MqLoadmoreProps } from './types'

defineOptions({
  name: 'mq-loadmore',
})

const props = withDefaults(defineProps<MqLoadmoreProps>(), {
  loadingText: '正在努力加载中...',
  finishedText: '已加载完毕',
  errorText: '加载失败',
})

const emit = defineEmits<MqLoadmoreEmits>()

function onReload() {
  if (props.state !== 'error') {
    return
  }
  emit('reload')
}
</script>

<style lang="scss">
@import './index.scss';
</style>
