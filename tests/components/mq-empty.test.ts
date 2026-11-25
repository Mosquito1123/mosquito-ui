import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MqEmpty from '@/components/mq-empty/MqEmpty.vue'

function mountEmpty(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MqEmpty, { props, slots })
}

describe('MqEmpty', () => {
  test('falls back to the CSS mark and renders tip and default slot', () => {
    const wrapper = mountEmpty({ tip: '暂无数据' }, { default: '<text class="retry">重试</text>' })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.find('.mq-empty__mark').exists()).toBe(true)
    expect(wrapper.find('.mq-empty__icon').exists()).toBe(false)
    expect(wrapper.find('.mq-empty__tip').text()).toBe('暂无数据')
    expect(wrapper.find('.mq-empty__bottom .retry').text()).toBe('重试')

    const bare = mountEmpty()
    expect(bare.find('.mq-empty__tip').exists()).toBe(false)
    expect(bare.find('.mq-empty__bottom').exists()).toBe(false)
  })

  test('renders a text glyph icon before the tip with iconSize', () => {
    const wrapper = mountEmpty({ icon: '★', iconSize: 48, tip: '空空如也' })
    const icon = wrapper.find('.mq-empty__icon')
    expect(icon.text()).toBe('★')
    expect(icon.attributes('style')).toContain('font-size: 48px')
    expect(icon.attributes('style')).toContain('width: 48px')
    expect(icon.attributes('style')).toContain('height: 48px')
    expect(wrapper.find('.mq-empty__mark').exists()).toBe(false)

    const children = Array.from(wrapper.element.children)
    const iconIndex = children.findIndex((node) => node.classList.contains('mq-empty__icon'))
    const tipIndex = children.findIndex((node) => node.classList.contains('mq-empty__tip'))
    expect(iconIndex).toBeGreaterThanOrEqual(0)
    expect(iconIndex).toBeLessThan(tipIndex)
  })

  test('renders an image for slash paths and data URLs', () => {
    const path = mountEmpty({ icon: '/assets/empty.png', iconSize: '6rem' })
    const image = path.find('image')
    expect(image.attributes('src')).toBe('/assets/empty.png')
    expect(image.attributes('mode')).toBe('aspectFit')
    expect(image.attributes('style')).toContain('width: 6rem')
    expect(image.attributes('style')).toContain('height: 6rem')
    expect(image.attributes('style')).toContain('font-size: 6rem')
    expect(path.find('.mq-empty__mark').exists()).toBe(false)
    expect(path.find('.mq-empty__icon:not(.mq-empty__icon--image)').exists()).toBe(false)

    const dataUrl = mountEmpty({ icon: 'data:image/png;base64,AAAA' })
    expect(dataUrl.find('image').attributes('src')).toBe('data:image/png;base64,AAAA')
    expect(dataUrl.find('image').attributes('style')).toBeUndefined()
  })

  test('image slot has highest priority over icon and fallback mark', () => {
    const wrapper = mountEmpty(
      { icon: '/assets/empty.png', tip: '空' },
      { image: '<text class="custom-image">自定义插图</text>' },
    )
    expect(wrapper.find('.custom-image').exists()).toBe(true)
    expect(wrapper.find('image').exists()).toBe(false)
    expect(wrapper.find('.mq-empty__icon').exists()).toBe(false)
    expect(wrapper.find('.mq-empty__mark').exists()).toBe(false)
  })

  test('ignores blank and invalid icon sizes and non-string icons', () => {
    const cases: Array<string | number | null> = [0, Number.NaN, '', '   ', null]
    for (const iconSize of cases) {
      const wrapper = mountEmpty({ icon: '★', iconSize })
      expect(wrapper.find('.mq-empty__icon').attributes('style')).toBeUndefined()
    }
    const nonString = mountEmpty({ icon: null as unknown as string })
    expect(nonString.find('.mq-empty__mark').exists()).toBe(true)
    expect(nonString.find('.mq-empty__icon').exists()).toBe(false)
  })
})
