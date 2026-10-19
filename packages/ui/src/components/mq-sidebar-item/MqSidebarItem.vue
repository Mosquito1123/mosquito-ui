<template>
  <view
    class="mq-sidebar-item"
    :class="{ 'is-active': active, 'is-disabled': disabled }"
    role="tab"
    :aria-selected="active ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : undefined"
    @click.stop="onClick"
  >
    <text class="mq-sidebar-item__label">{{ label }}</text>
    <text v-if="badgeText !== null" class="mq-sidebar-item__badge" :class="{ 'is-dot': isDot }">
      {{ badgeText }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { formatBadge } from '../../utils/model'
import { sidebarKey } from '../mq-sidebar/context'
import type { MqSidebarItemProps } from './types'

defineOptions({
  name: 'mq-sidebar-item',
})

const props = withDefaults(defineProps<MqSidebarItemProps>(), {
  label: '',
  badge: undefined,
  isDot: false,
  max: 99,
  disabled: false,
})

const group = inject(sidebarKey, null)

const active = computed(() => group?.active.value === props.value)

const badgeText = computed(() =>
  formatBadge(props.badge, { max: props.max, dot: props.isDot, showZero: true }),
)

function onClick() {
  if (!group || props.value === undefined) {
    return
  }
  void group.select(props.value, props.label, props.disabled)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
