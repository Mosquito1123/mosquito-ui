<template>
  <view class="mq-tree" :class="{ 'is-disabled': disabled }">
    <view
      v-for="row in rows"
      :key="row.node.value"
      class="mq-tree__row"
      :class="{ 'is-disabled': row.node.disabled }"
      :style="{ paddingLeft: `${row.depth * indent}px` }"
      @click="onRow(row)"
    >
      <view
        class="mq-tree__caret"
        :class="{
          'is-expanded': isExpanded(row.node),
          'is-hidden': !hasTreeChildren(row.node),
        }"
        @click.stop="toggleExpand(row.node)"
      >
        <text>{{ isExpanded(row.node) ? '▾' : '▸' }}</text>
      </view>
      <view
        v-if="checkable"
        class="mq-tree__checkbox"
        :class="`is-${stateOf(row.node)}`"
        role="checkbox"
        :aria-checked="stateOf(row.node) === 'all' ? 'true' : stateOf(row.node) === 'partial' ? 'mixed' : 'false'"
        @click.stop="toggleCheck(row.node)"
      >
        <text v-if="stateOf(row.node) === 'all'">✓</text>
        <text v-else-if="stateOf(row.node) === 'partial'">−</text>
      </view>
      <text class="mq-tree__label" :class="{ 'is-selected': isSelected(row.node) }">
        {{ row.node.label }}
      </text>
    </view>
    <view v-if="!rows.length" class="mq-tree__empty">{{ emptyText }}</view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  collectExpandableValues,
  flattenTree,
  hasTreeChildren,
  toggleTreeSelection,
  treeSelectionState,
} from '../../utils/tree'
import type { MqTreeNode } from '../../utils/tree'
import type {
  MqTreeEmits,
  MqTreeExpandPayload,
  MqTreeProps,
} from './types'

defineOptions({
  name: 'mq-tree',
})

const props = withDefaults(defineProps<MqTreeProps>(), {
  data: () => [],
  modelValue: undefined,
  checkable: false,
  defaultExpandAll: false,
  expanded: undefined,
  indent: 18,
  emptyText: '暂无数据',
  disabled: false,
})

const emit = defineEmits<MqTreeEmits>()

const expandedValues = ref<Array<string | number>>(
  props.expanded
    ? [...props.expanded]
    : props.defaultExpandAll
      ? collectExpandableValues(props.data)
      : [],
)

const rows = computed(() => flattenTree(props.data, expandedValues.value))

const selectedValues = computed<Array<string | number>>(() => {
  const value = props.modelValue
  if (Array.isArray(value)) {
    return value
  }
  return value === undefined || value === null || value === '' ? [] : [value]
})

watch(
  () => props.expanded,
  (value) => {
    if (value) {
      expandedValues.value = [...value]
    }
  },
)

function isExpanded(node: MqTreeNode): boolean {
  return expandedValues.value.includes(node.value)
}

function isSelected(node: MqTreeNode): boolean {
  return selectedValues.value.includes(node.value)
}

function stateOf(node: MqTreeNode): 'none' | 'partial' | 'all' {
  return treeSelectionState(node, selectedValues.value)
}

function setExpanded(next: Array<string | number>) {
  expandedValues.value = next
  emit('update:expanded', [...next])
}

function toggleExpand(node: MqTreeNode) {
  if (!hasTreeChildren(node)) {
    return
  }
  const expanded = !isExpanded(node)
  setExpanded(
    expanded
      ? [...expandedValues.value, node.value]
      : expandedValues.value.filter((value) => value !== node.value),
  )
  const payload: MqTreeExpandPayload = { node, expanded }
  emit('expand', payload)
}

function toggleCheck(node: MqTreeNode) {
  if (props.disabled || node.disabled) {
    return
  }
  const selected = toggleTreeSelection(selectedValues.value, node, true)
  emit('update:modelValue', selected)
  emit('check', { node, selected: [...selected] })
}

function onRow(row: { node: MqTreeNode; depth: number }) {
  if (props.disabled || row.node.disabled) {
    return
  }
  emit('node-click', { node: row.node, depth: row.depth })
  if (props.checkable) {
    toggleCheck(row.node)
    return
  }
  emit('update:modelValue', row.node.value)
}

function expandAll() {
  setExpanded(collectExpandableValues(props.data))
}

function collapseAll() {
  setExpanded([])
}

defineExpose({
  expandAll,
  collapseAll,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
