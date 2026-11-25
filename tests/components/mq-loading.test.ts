import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MqLoading from '@/components/mq-loading/MqLoading.vue'
import { t } from '@/locale'

function mountLoading(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MqLoading, { props, slots })
}

describe('MqLoading', () => {
  test('renders the default circular, horizontal indicator', () => {
    const wrapper = mountLoading()
    expect(wrapper.classes()).toContain('mq-loading')
    expect(wrapper.classes()).toContain('mq-loading--circular')
    expect(wrapper.classes()).toContain('mq-loading--horizontal')
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe(t('common.loading'))
    expect(wrapper.attributes('style')).toContain('width: 20px')
    expect(wrapper.attributes('style')).toContain('height: 20px')
    expect(wrapper.find('.mq-loading__text').exists()).toBe(false)
  })

  test('keeps size and color behavior', () => {
    const wrapper = mountLoading({ size: 32, color: '#ff0000' })
    expect(wrapper.attributes('style')).toContain('width: 32px')
    expect(wrapper.attributes('style')).toContain('height: 32px')
    expect(wrapper.attributes('style')).toContain('border-top-color: rgb(255, 0, 0)')

    const stringSize = mountLoading({ size: '3rem', color: '  ' })
    expect(stringSize.attributes('style')).toContain('width: 3rem')
    expect(stringSize.attributes('style')).not.toContain('border-top-color')

    const invalid = mountLoading({ size: 0 })
    expect(invalid.attributes('style')).toContain('width: 20px')
    const notFinite = mountLoading({ size: Number.NaN })
    expect(notFinite.attributes('style')).toContain('height: 20px')
    const empty = mountLoading({ size: '' })
    expect(empty.attributes('style')).toContain('height: 20px')
  })

  test('resolves the accessibility label with trimming and fallback', () => {
    expect(mountLoading({ label: '  加载中...  ' }).attributes('aria-label')).toBe('加载中...')
    expect(mountLoading({ label: '   ' }).attributes('aria-label')).toBe(t('common.loading'))
  })

  test('supports all four indicator types', () => {
    for (const type of ['circular', 'spinner', 'dots', 'wave']) {
      const wrapper = mountLoading({ type })
      expect(wrapper.classes()).toContain(`mq-loading--${type}`)
    }
  })

  test('renders text and lets the default slot override it', () => {
    const withText = mountLoading({ text: '加载中' })
    expect(withText.find('.mq-loading__text').text()).toBe('加载中')

    const overridden = mountLoading({ text: '加载中' }, { default: '<text class="custom">请稍候</text>' })
    expect(overridden.find('.custom').text()).toBe('请稍候')
    expect(overridden.find('.mq-loading__text').exists()).toBe(false)

    const slotOnly = mountLoading({}, { default: '<text class="custom">处理中</text>' })
    expect(slotOnly.find('.custom').text()).toBe('处理中')
  })

  test('applies direction classes', () => {
    expect(mountLoading().classes()).toContain('mq-loading--horizontal')
    expect(mountLoading({ direction: 'vertical' }).classes()).toContain('mq-loading--vertical')
    expect(mountLoading({ direction: 'vertical' }).classes()).not.toContain('mq-loading--horizontal')
  })
})
