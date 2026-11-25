import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import MqRichText from '@/components/mq-rich-text/MqRichText.vue'
import type { MqRichTextNode } from '@/components/mq-rich-text/types'

describe('MqRichText', () => {
  test('renders a single view root and a plain text string', () => {
    const wrapper = mount(MqRichText, { props: { nodes: 'hello' } })
    expect(wrapper.element.tagName).toBe('VIEW')
    expect(wrapper.classes()).toContain('mq-rich-text')
    expect(wrapper.find('text').text()).toBe('hello')
    expect(wrapper.html()).not.toContain('innerHTML')
  })

  test('renders nested text in p and span nodes', () => {
    const nodes: MqRichTextNode[] = [
      { type: 'p', children: [{ type: 'text', text: '段落' }] },
      { type: 'span', text: '行内' },
    ]
    const wrapper = mount(MqRichText, { props: { nodes } })
    expect(wrapper.find('p').text()).toBe('段落')
    expect(wrapper.find('span').text()).toBe('行内')
  })

  test('renders image, link and br', () => {
    const nodes: MqRichTextNode[] = [
      { type: 'img', attrs: { src: '/a.png', alt: '图' } },
      { type: 'a', attrs: { href: 'https://example.com' }, children: '链接' },
      { type: 'br' },
    ]
    const wrapper = mount(MqRichText, { props: { nodes } })
    expect(wrapper.find('image').attributes('src')).toBe('/a.png')
    expect(wrapper.find('image').attributes('alt')).toBe('图')
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
    expect(wrapper.find('a').text()).toBe('链接')
    expect(wrapper.find('br').exists()).toBe(true)
  })

  test('renders all supported tag types', () => {
    const types = ['strong', 'em', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li']
    const nodes: MqRichTextNode[] = types.map((type) => ({ type, text: type }))
    const wrapper = mount(MqRichText, { props: { nodes } })
    for (const type of types) {
      expect(wrapper.find(type).exists(), type).toBe(true)
    }
  })

  test('supports node alias, string children and unknown tag fallback', () => {
    const nodes: MqRichTextNode[] = [
      { node: 'span', text: '别名' },
      { type: 'div', children: '字符串子节点' },
      { type: 'custom', text: '未知' },
    ]
    const wrapper = mount(MqRichText, { props: { nodes } })
    expect(wrapper.text()).toContain('别名')
    expect(wrapper.text()).toContain('字符串子节点')
    expect(wrapper.findAll('span').some((el) => el.text() === '未知')).toBe(true)
  })

  test('applies attrs.class and selectable classes', () => {
    const wrapper = mount(MqRichText, {
      props: {
        userSelect: true,
        selectable: true,
        nodes: [{ type: 'p', attrs: { class: 'custom' }, text: 'x' }],
      },
    })
    expect(wrapper.classes()).toContain('is-user-select')
    expect(wrapper.classes()).toContain('is-selectable')
    expect(wrapper.find('p').classes()).toContain('custom')
  })

  test('emits click with the clicked node', async () => {
    const wrapper = mount(MqRichText, {
      props: { nodes: [{ type: 'p', children: [{ type: 'text', text: '点我' }] }] },
    })
    await wrapper.find('p').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    const payload = wrapper.emitted('click')![0][0] as {
      node: MqRichTextNode
      event: Event
    }
    expect(payload.node.type).toBe('p')
    expect(payload.event).toBeInstanceOf(Event)
  })

  test('clicking a nested text node emits once with the text node', async () => {
    const wrapper = mount(MqRichText, {
      props: { nodes: [{ type: 'p', children: [{ type: 'text', text: '子' }] }] },
    })
    await wrapper.find('text').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    const payload = wrapper.emitted('click')![0][0] as { node: MqRichTextNode }
    expect(payload.node.type).toBe('text')
  })

  test('renders nothing for empty nodes and does not emit for br', async () => {
    const empty = mount(MqRichText, { props: { nodes: [] } })
    expect(empty.find('text').exists()).toBe(false)
    const wrapper = mount(MqRichText, { props: { nodes: [{ type: 'br' }] } })
    await wrapper.find('br').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  test('drops unsafe attrs from untrusted nodes', async () => {
    const wrapper = mount(MqRichText, {
      props: {
        nodes: [
          {
            type: 'p',
            attrs: {
              innerHTML: '<img src=x onerror=alert(1)>',
              onclick: 'alert(1)',
              href: 'javascript:alert(1)',
              style: 'background:url(javascript:alert(1))',
            },
            children: [{ type: 'text', text: '安全' }],
          },
          { type: 'a', attrs: { href: 'javascript:alert(1)', src: 'vbscript:msgbox(1)' }, text: '链接' },
        ],
      },
    })
    expect(wrapper.html()).not.toContain('onerror')
    expect(wrapper.html()).not.toContain('onclick')
    expect(wrapper.html()).not.toContain('javascript:')
    expect(wrapper.html()).not.toContain('vbscript:')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('a').attributes('href')).toBeUndefined()
    expect(wrapper.text()).toContain('安全')
  })
})
