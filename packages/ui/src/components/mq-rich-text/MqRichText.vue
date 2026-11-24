<template>
  <view class="mq-rich-text" :class="{ 'is-selectable': selectable, 'is-user-select': userSelect }">
    <component v-if="rootNode" :is="TreeNode" :node="rootNode" />
  </view>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { MqRichTextEmits, MqRichTextNode, MqRichTextProps } from './types'

defineOptions({
  name: 'mq-rich-text',
})

const props = withDefaults(defineProps<MqRichTextProps>(), {
  nodes: () => [],
  userSelect: false,
  selectable: false,
})

const emit = defineEmits<MqRichTextEmits>()

interface NormalizedNode {
  type: string
  text: string
  attrs: Record<string, unknown>
  children: NormalizedNode[]
  raw: MqRichTextNode
}

const BLOCK_TAGS = [
  'p',
  'div',
  'span',
  'a',
  'strong',
  'em',
  'b',
  'i',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
]

function normalize(value: string | MqRichTextNode): NormalizedNode {
  if (typeof value === 'string') {
    return {
      type: 'text',
      text: value,
      attrs: {},
      children: [],
      raw: { type: 'text', text: value },
    }
  }
  const type = value.type || value.node || (value.text !== undefined ? 'text' : 'span')
  const raw: MqRichTextNode = { ...value, type }
  const source = value.children
  const list = typeof source === 'string' ? [source] : source || []
  return {
    type,
    text: value.text ?? '',
    attrs: value.attrs || {},
    children: list.map(normalize),
    raw,
  }
}

const rootNode = computed<NormalizedNode | null>(() => {
  const nodes = props.nodes
  if (typeof nodes === 'string') {
    return normalize(nodes)
  }
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return null
  }
  if (nodes.length === 1) {
    return normalize(nodes[0])
  }
  return normalize({ type: 'div', children: nodes })
})

/**
 * `nodes` 常来自后端或 CMS，attrs 可能受攻击者控制。
 * 只放行渲染所需的属性：innerHTML / on* / srcdoc 等一旦透传给 h() 会变成真实的 DOM 写入和事件监听。
 */
const SAFE_ATTRS = new Set(['id', 'style', 'src', 'alt', 'title', 'width', 'height', 'href', 'target', 'rel'])
const UNSAFE_URL = /^\s*(javascript|vbscript|data:text\/html)\s*:/i

function safeAttr(key: string, value: unknown): unknown {
  if (key === 'href' || key === 'src') {
    return UNSAFE_URL.test(String(value)) ? undefined : value
  }
  if (key === 'style' && typeof value === 'string' && /javascript\s*:|expression\s*\(/i.test(value)) {
    return undefined
  }
  return value
}

/** 递归函数组件，避免额外子组件文件；不解析 HTML 字符串，不使用 v-html。 */
function TreeNode(nodeProps: { node: NormalizedNode }) {
  const node = nodeProps.node
  const type = node.type
  const classes = ['mq-rich-text__node', `mq-rich-text__${type}`]
  if (node.attrs.class) {
    classes.push(String(node.attrs.class))
  }

  const attrs: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node.attrs)) {
    if (!SAFE_ATTRS.has(key) || value == null) {
      continue
    }
    const sanitized = safeAttr(key, value)
    if (sanitized !== undefined && sanitized !== null) {
      attrs[key] = sanitized
    }
  }

  const children = node.children.map((child, index) => h(TreeNode, { node: child, key: index }))
  const handlers =
    type === 'br'
      ? {}
      : {
          onClick: (event: Event) => {
            event.stopPropagation?.()
            emit('click', { node: node.raw, event })
          },
        }

  if (type === 'text') {
    return h('text', { class: classes.join(' '), ...handlers }, node.text)
  }
  if (type === 'br') {
    return h('br', { class: classes.join(' ') })
  }
  if (type === 'img') {
    return h('image', {
      class: classes.join(' '),
      src: String(node.attrs.src ?? ''),
      ...attrs,
      ...handlers,
    })
  }

  const tag = BLOCK_TAGS.includes(type) ? type : 'span'
  return h(tag, { class: classes.join(' '), ...attrs, ...handlers }, children.length ? children : node.text)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
