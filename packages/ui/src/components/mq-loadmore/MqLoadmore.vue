<template>
  <view class="mq-loadmore" :class="state ? `is-${state}` : undefined" role="status" @click.stop="onReload">
    <slot v-if="state === 'loading'" name="loading">
      <view class="mq-loadmore__spin" aria-hidden="true" />
      <text>{{ loadingLabel }}</text>
    </slot>
    <slot v-else-if="state === 'finished'" name="finished">
      <text>{{ finishedLabel }}</text>
    </slot>
    <slot v-else-if="state === 'error'" name="error">
      <text>{{ errorLabel }}</text>
      <text class="mq-loadmore__hint">{{ t('common.retry') }}</text>
    </slot>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t } from '../../locale'
import type { MqLoadmoreEmits, MqLoadmoreProps } from './types'

defineOptions({
  name: 'mq-loadmore',
})

const props = defineProps<MqLoadmoreProps>()

const emit = defineEmits<MqLoadmoreEmits>()

const loadingLabel = computed(() => props.loadingText?.trim() || t('common.loadingMore'))
const finishedLabel = computed(() => props.finishedText?.trim() || t('common.finished'))
const errorLabel = computed(() => props.errorText?.trim() || t('common.loadFailed'))

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
