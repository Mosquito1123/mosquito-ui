<template>
  <view class="mq-pagination" role="navigation">
    <view class="mq-pagination__bar">
      <text
        class="mq-pagination__btn"
        :class="{ 'is-disabled': current <= 1 }"
        role="button"
        :aria-disabled="current <= 1 ? 'true' : undefined"
        @click.stop="go(-1)"
      >
        <slot name="prev" :model-value="current">{{ prevText }}</slot>
      </text>
      <text class="mq-pagination__size">
        <slot name="size" :model-value="current" :total-page-num="pages">{{ current }} / {{ pages }}</slot>
      </text>
      <text
        class="mq-pagination__btn"
        :class="{ 'is-disabled': current >= pages }"
        role="button"
        :aria-disabled="current >= pages ? 'true' : undefined"
        @click.stop="go(1)"
      >
        <slot name="next" :model-value="current" :total-page-num="pages">{{ nextText }}</slot>
      </text>
    </view>
    <text v-if="showMessage" class="mq-pagination__message">
      <slot name="message" :model-value="current" :total-page-num="pages">共 {{ safeTotal }} 条</slot>
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { pageCount, clampPage } from '../../utils/model'
import type { MqPaginationEmits, MqPaginationProps } from './types'

defineOptions({
  name: 'mq-pagination',
})

const props = withDefaults(defineProps<MqPaginationProps>(), {
  modelValue: 1,
  total: 0,
  pageSize: 10,
  showMessage: false,
  prevText: '上一页',
  nextText: '下一页',
})

const emit = defineEmits<MqPaginationEmits>()

const safeTotal = computed(() => (Number.isFinite(props.total) && props.total > 0 ? Math.floor(props.total) : 0))
const pages = computed(() => pageCount(props.total, props.pageSize))
const current = computed(() => clampPage(props.modelValue, pages.value))

function go(step: number) {
  const next = clampPage(current.value + step, pages.value)
  if (next === current.value) {
    return
  }
  emit('update:modelValue', next)
  emit('change', { value: next })
}
</script>

<style lang="scss">
@import './index.scss';
</style>
