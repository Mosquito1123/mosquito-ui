<template>
  <view class="mq-index-bar" :style="rootStyle">
    <scroll-view class="mq-index-bar__body" scroll-y :scroll-into-view="scrollIntoView">
      <slot />
    </scroll-view>
    <view class="mq-index-bar__sidebar">
      <text
        v-for="item in indexes"
        :key="String(item)"
        class="mq-index-bar__tip"
        :class="{ 'is-active': item === active }"
        @click.stop="select(item)"
      >
        {{ item }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, provide, ref, toRef } from 'vue'
import { indexBarKey } from './context'
import type { MqIndexBarEmits, MqIndexBarProps } from './types'

defineOptions({
  name: 'mq-index-bar',
})

const props = withDefaults(defineProps<MqIndexBarProps>(), {
  sticky: true,
  highlightColor: '',
})

const emit = defineEmits<MqIndexBarEmits>()

const indexes = ref<Array<string | number>>([])
const active = ref<string | number | undefined>()
const scrollIntoView = ref('')

const rootStyle = computed(() => {
  if (!props.highlightColor) {
    return undefined
  }
  return { '--mq-index-active': props.highlightColor }
})

function register(index: string | number) {
  if (!indexes.value.includes(index)) {
    indexes.value = [...indexes.value, index]
  }
  if (active.value === undefined) {
    active.value = index
  }
}

function unregister(index: string | number) {
  indexes.value = indexes.value.filter((item) => item !== index)
}

function select(index: string | number) {
  active.value = index
  scrollIntoView.value = `mq-index-${index}`
  emit('select', index)
  emit('change', index)
}

provide(indexBarKey, {
  sticky: toRef(props, 'sticky'),
  indexes,
  active,
  register,
  unregister,
  select,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
