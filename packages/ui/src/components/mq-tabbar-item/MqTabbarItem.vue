<template>
  <view
    class="mq-tabbar-item"
    :class="{ 'is-active': active }"
    :style="rootStyle"
    role="tab"
    :aria-selected="active ? 'true' : 'false'"
    @click.stop="onClick"
  >
    <view class="mq-tabbar-item__icon">
      <slot name="icon" :active="active">
        <text v-if="mark" class="mq-tabbar-item__mark">{{ mark }}</text>
      </slot>
      <text v-if="badgeText !== null" class="mq-tabbar-item__badge" :class="{ 'is-dot': isDot }">
        {{ badgeText }}
      </text>
    </view>
    <text v-if="title" class="mq-tabbar-item__title">{{ title }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { formatBadge } from '../../utils/model'
import { tabbarKey } from '../mq-tabbar/context'
import type { MqTabbarItemProps } from './types'

defineOptions({
  name: 'mq-tabbar-item',
})

const props = withDefaults(defineProps<MqTabbarItemProps>(), {
  title: '',
  mark: '',
  isDot: false,
  max: 99,
})

const group = inject(tabbarKey, null)
const index = group ? group.claim() : 0
const itemValue = computed(() => (props.name === undefined ? index : props.name))
const active = computed(() => group?.active.value === itemValue.value)

const badgeText = computed(() =>
  formatBadge(props.value, { max: props.max, dot: props.isDot, showZero: true }),
)

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  const on = group?.activeColor.value
  const off = group?.inactiveColor.value
  if (active.value && on) {
    style.color = on
  } else if (!active.value && off) {
    style.color = off
  }
  return style
})

function onClick() {
  group?.select(itemValue.value)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
