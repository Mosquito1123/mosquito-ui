<template>
  <view v-if="!hidden" class="mq-pagination" role="navigation">
    <view class="mq-pagination__bar">
      <text
        class="mq-pagination__btn"
        :class="{ 'is-disabled': current <= 1 }"
        role="button"
        :aria-disabled="current <= 1 ? 'true' : undefined"
        @click.stop="go(-1)"
      >
        <slot name="prev" :model-value="current" :total="safeTotal" :page-size="pageSize">{{
          prevLabel
        }}</slot>
      </text>
      <text class="mq-pagination__size">
        <slot
          name="size"
          :model-value="current"
          :total-page-num="pages"
          :total="safeTotal"
          :page-size="pageSize"
          >{{ current }} / {{ pages }}</slot
        >
      </text>
      <text
        class="mq-pagination__btn"
        :class="{ 'is-disabled': current >= pages }"
        role="button"
        :aria-disabled="current >= pages ? 'true' : undefined"
        @click.stop="go(1)"
      >
        <slot name="next" :model-value="current" :total="safeTotal" :page-size="pageSize">{{
          nextLabel
        }}</slot>
      </text>
    </view>
    <text v-if="showMessage" class="mq-pagination__message">
      <slot
        name="message"
        :model-value="current"
        :total-page-num="pages"
        :total="safeTotal"
        :page-size="pageSize"
        >{{ t('common.total', { total: safeTotal }) }}</slot
      >
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t } from '../../locale'
import { pageCount, clampPage } from '../../utils/model'
import type { MqPaginationEmits, MqPaginationProps } from './types'

defineOptions({
  name: 'mq-pagination',
})

const props = withDefaults(defineProps<MqPaginationProps>(), {
  modelValue: 1,
  total: 0,
  pageSize: 10,
  totalPage: undefined,
  showMessage: false,
  hideIfOnePage: false,
})

const emit = defineEmits<MqPaginationEmits>()

const prevLabel = computed(() => props.prevText?.trim() || t('common.prevPage'))
const nextLabel = computed(() => props.nextText?.trim() || t('common.nextPage'))

const safeTotal = computed(() =>
  Number.isFinite(props.total) && props.total > 0 ? Math.floor(props.total) : 0,
)
const pages = computed(() => {
  const explicit = props.totalPage
  if (typeof explicit === 'number' && Number.isFinite(explicit) && explicit > 0) {
    return Math.floor(explicit)
  }
  return pageCount(props.total, props.pageSize)
})
const current = computed(() => clampPage(props.modelValue, pages.value))
const hidden = computed(() => props.hideIfOnePage && pages.value <= 1)

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
