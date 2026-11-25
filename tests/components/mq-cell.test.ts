import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import MqCell from '@/components/mq-cell/MqCell.vue'
import type { MqCellArrowDirection, MqCellValueAlign } from '@/components/mq-cell/types'

// tests/setup.ts 只提供最小 uni 兼容层，导航 API 由本文件按需注入。
const uniApi = (globalThis as Record<string, any>).uni

function setNavApi(name: 'navigateTo' | 'redirectTo', value: unknown) {
  Object.defineProperty(uniApi, name, { configurable: true, writable: true, value })
}

function navSpies() {
  return {
    navigateTo: vi.spyOn(uniApi, 'navigateTo'),
    redirectTo: vi.spyOn(uniApi, 'redirectTo'),
  }
}

beforeEach(() => {
  setNavApi('navigateTo', vi.fn())
  setNavApi('redirectTo', vi.fn())
})

describe('MqCell', () => {
  test('renders a single view root with default modifiers', () => {
    const wrapper = mount(MqCell)

    expect(wrapper.element.tagName).toBe('VIEW')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['mq-cell', 'mq-cell--normal']))
    expect(wrapper.classes().filter((name) => name.startsWith('is-'))).toEqual([])
    expect(wrapper.find('.mq-cell__title').text()).toBe('')
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    expect(wrapper.find('.mq-cell__arrow').exists()).toBe(false)
  })

  test('renders flat title and renders the default slot only when provided', () => {
    const plain = mount(MqCell, { props: { title: '手机号' } })
    expect(plain.find('.mq-cell__title').text()).toBe('手机号')
    expect(plain.find('.mq-cell__main').exists()).toBe(false)
    expect(plain.find('.mq-cell__extra').exists()).toBe(false)

    const withSlot = mount(MqCell, { slots: { default: '<text class="extra">附</text>' } })
    expect(withSlot.find('.mq-cell__extra .extra').text()).toBe('附')
  })

  test('renders label, required star and title width in the main branch', () => {
    const wrapper = mount(MqCell, {
      props: { title: '姓名', label: '必填项', required: true, titleWidth: 120 },
    })

    expect(wrapper.find('.mq-cell__main').exists()).toBe(true)
    expect(wrapper.find('.mq-cell__label').text()).toBe('必填项')
    expect(wrapper.find('.mq-cell__star').text()).toBe('*')
    expect(wrapper.find('.mq-cell__title').attributes('style')).toContain('width: 120px')
  })

  test('accepts string title widths and skips empty ones', () => {
    const withWidth = mount(MqCell, { props: { title: 'A', titleWidth: '40%' } })
    expect(withWidth.find('.mq-cell__title').attributes('style')).toContain('width: 40%')

    const withoutWidth = mount(MqCell, { props: { title: 'B', titleWidth: 0 } })
    expect(withoutWidth.find('.mq-cell__title').attributes('style')).toContain('width: 0px')
  })

  test('shows finite values (including 0) and falls back to placeholder', () => {
    const zero = mount(MqCell, { props: { value: 0 } })
    expect(zero.find('.mq-cell__value').text()).toBe('0')
    expect(zero.find('.mq-cell__value').classes()).not.toContain('is-placeholder')

    const nan = mount(MqCell, { props: { value: Number.NaN, placeholder: '暂无' } })
    expect(nan.find('.mq-cell__value').classes()).toContain('is-placeholder')
    expect(nan.find('.mq-cell__value').text()).toBe('暂无')

    const empty = mount(MqCell, { props: { value: '', placeholder: '请选择' } })
    expect(empty.find('.mq-cell__value').text()).toBe('请选择')

    const nullish = mount(MqCell, { props: { value: null } })
    expect(nullish.find('.mq-cell__value').exists()).toBe(false)
  })

  test('applies value alignment to both value and placeholder', () => {
    const alignments: MqCellValueAlign[] = ['left', 'center', 'right']
    for (const align of alignments) {
      const wrapper = mount(MqCell, { props: { value: 'V', valueAlign: align } })
      const value = wrapper.find('.mq-cell__value')
      expect(value.classes(), align).toContain(`mq-cell__value--${align}`)
      expect(value.attributes('style'), align).toContain(`text-align: ${align}`)

      const placeholder = mount(MqCell, { props: { placeholder: 'P', valueAlign: align } }).find(
        '.mq-cell__value',
      )
      expect(placeholder.classes(), align).toContain(`mq-cell__value--${align}`)
      expect(placeholder.attributes('style'), align).toContain(`text-align: ${align}`)
    }
  })

  test('uses the requested arrow glyph and direction class', () => {
    const glyphs: Record<MqCellArrowDirection, string> = {
      right: '›',
      left: '‹',
      up: '▴',
      down: '▾',
    }
    for (const direction of Object.keys(glyphs) as MqCellArrowDirection[]) {
      const wrapper = mount(MqCell, { props: { isLink: true, arrowDirection: direction } })
      const arrow = wrapper.find('.mq-cell__arrow')
      expect(arrow.text(), direction).toBe(glyphs[direction])
      expect(arrow.classes(), direction).toContain(`mq-cell__arrow--${direction}`)
    }
  })

  test('renders an arrow only for links', () => {
    const link = mount(MqCell, { props: { isLink: true } })
    expect(link.classes()).toContain('is-link')
    expect(link.attributes('role')).toBe('button')
    expect(link.attributes('tabindex')).toBe('0')
    expect(link.attributes('hover-class')).toBe('mq-cell--pressed')
    expect(link.find('.mq-cell__arrow').exists()).toBe(true)

    const clickable = mount(MqCell, { props: { clickable: true } })
    expect(clickable.classes()).toContain('is-clickable')
    expect(clickable.find('.mq-cell__arrow').exists()).toBe(false)
  })

  test('applies center, size, border and ellipsis modifiers', () => {
    const wrapper = mount(MqCell, {
      props: { center: true, size: 'large', border: true, ellipsis: true, value: 'long' },
    })

    expect(wrapper.classes()).toContain('is-center')
    expect(wrapper.classes()).toContain('mq-cell--large')
    expect(wrapper.classes()).not.toContain('mq-cell--normal')
    expect(wrapper.classes()).toContain('has-border')
    expect(wrapper.classes()).toContain('is-ellipsis')
  })

  test('emits click on pointer and keyboard activation for interactive cells', async () => {
    const wrapper = mount(MqCell, { props: { clickable: true } })

    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: ' ' })

    expect(wrapper.emitted('click')).toHaveLength(3)
  })

  test('ignores keyboard activation when not interactive', async () => {
    const wrapper = mount(MqCell)
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  test('disabled cell emits no click and navigates nowhere', async () => {
    const spies = navSpies()
    const wrapper = mount(MqCell, {
      props: { to: '/detail', clickable: true, disabled: true },
    })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('hover-class')).toBe('none')

    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(spies.navigateTo).not.toHaveBeenCalled()
    expect(spies.redirectTo).not.toHaveBeenCalled()
  })

  test('navigates with navigateTo when a clickable cell has a target', async () => {
    const spies = navSpies()
    const wrapper = mount(MqCell, { props: { to: '/pages/detail?id=1', clickable: true } })

    await wrapper.trigger('click')

    expect(spies.navigateTo).toHaveBeenCalledTimes(1)
    expect(spies.navigateTo).toHaveBeenCalledWith({ url: '/pages/detail?id=1' })
    expect(spies.redirectTo).not.toHaveBeenCalled()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  test('navigates from links too, and uses redirectTo when replace is set', async () => {
    const spies = navSpies()
    const wrapper = mount(MqCell, {
      props: { to: '/pages/home', isLink: true, replace: true },
    })

    await wrapper.trigger('keydown', { key: 'Enter' })

    expect(spies.redirectTo).toHaveBeenCalledTimes(1)
    expect(spies.redirectTo).toHaveBeenCalledWith({ url: '/pages/home' })
    expect(spies.navigateTo).not.toHaveBeenCalled()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  test('does not navigate without a target or without being interactive', async () => {
    const spies = navSpies()
    const withTarget = mount(MqCell, { props: { to: '/only' } })
    await withTarget.trigger('click')
    expect(spies.navigateTo).not.toHaveBeenCalled()
    expect(withTarget.emitted('click')).toHaveLength(1)

    const interactiveWithoutTarget = mount(MqCell, { props: { clickable: true } })
    await interactiveWithoutTarget.trigger('click')
    expect(spies.navigateTo).not.toHaveBeenCalled()
  })

  test('missing uni navigation APIs never throw on click', async () => {
    setNavApi('navigateTo', undefined)
    setNavApi('redirectTo', undefined)
    const wrapper = mount(MqCell, { props: { to: '/missing', clickable: true } })

    await expect(wrapper.trigger('click')).resolves.toBeUndefined()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
