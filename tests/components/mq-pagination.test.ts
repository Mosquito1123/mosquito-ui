import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MqPagination from '@/components/mq-pagination/MqPagination.vue'
import { t } from '@/locale'

function mountPage(props: Record<string, unknown> = {}) {
  return mount(MqPagination, { props })
}

describe('MqPagination', () => {
  test('renders navigation with computed page count and default labels', () => {
    const wrapper = mountPage({ total: 95 })
    expect(wrapper.classes()).toContain('mq-pagination')
    expect(wrapper.attributes('role')).toBe('navigation')

    const buttons = wrapper.findAll('.mq-pagination__btn')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe(t('common.prevPage'))
    expect(buttons[1].text()).toBe(t('common.nextPage'))
    expect(wrapper.find('.mq-pagination__size').text()).toBe('1 / 10')
    expect(wrapper.find('.mq-pagination__message').exists()).toBe(false)
  })

  test('clamps the page and disables boundary buttons', async () => {
    const first = mountPage({ total: 95, modelValue: 0 })
    expect(first.find('.mq-pagination__size').text()).toBe('1 / 10')
    const prev = first.findAll('.mq-pagination__btn')[0]
    expect(prev.classes()).toContain('is-disabled')
    expect(prev.attributes('aria-disabled')).toBe('true')
    await prev.trigger('click')
    expect(first.emitted('update:modelValue')).toBeUndefined()

    const last = mountPage({ total: 95, modelValue: 99 })
    expect(last.find('.mq-pagination__size').text()).toBe('10 / 10')
    const next = last.findAll('.mq-pagination__btn')[1]
    expect(next.classes()).toContain('is-disabled')
    expect(next.attributes('aria-disabled')).toBe('true')
    await next.trigger('click')
    expect(last.emitted('change')).toBeUndefined()
  })

  test('emits update:modelValue and change when navigating', async () => {
    const wrapper = mountPage({ total: 95, modelValue: 2 })
    const [prev, next] = wrapper.findAll('.mq-pagination__btn')
    expect(prev.attributes('aria-disabled')).toBeUndefined()
    expect(next.attributes('aria-disabled')).toBeUndefined()

    await next.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe(3)
    expect(wrapper.emitted('change')![0][0]).toEqual({ value: 3 })

    await prev.trigger('click')
    expect(wrapper.emitted('update:modelValue')![1][0]).toBe(1)
    expect(wrapper.emitted('change')![1][0]).toEqual({ value: 1 })
  })

  test('uses totalPage instead of the computed count when provided', () => {
    const wrapper = mountPage({ total: 95, pageSize: 10, totalPage: 3, modelValue: 2 })
    expect(wrapper.find('.mq-pagination__size').text()).toBe('2 / 3')
    expect(wrapper.findAll('.mq-pagination__btn')[1].attributes('aria-disabled')).toBeUndefined()

    const atEnd = mountPage({ total: 95, totalPage: 3, modelValue: 3 })
    expect(atEnd.findAll('.mq-pagination__btn')[1].classes()).toContain('is-disabled')

    expect(mountPage({ total: 95, totalPage: 0 }).find('.mq-pagination__size').text()).toBe('1 / 10')
    expect(mountPage({ total: 95, totalPage: Number.NaN }).find('.mq-pagination__size').text()).toBe('1 / 10')
  })

  test('hides the root when hideIfOnePage is set and pages are at most one', () => {
    expect(mountPage({ total: 5, hideIfOnePage: true }).find('.mq-pagination').exists()).toBe(false)
    expect(mountPage({ total: 95, totalPage: 1, hideIfOnePage: true }).find('.mq-pagination').exists()).toBe(
      false,
    )
    expect(mountPage({ total: 5 }).find('.mq-pagination').exists()).toBe(true)
    expect(mountPage({ total: 95, hideIfOnePage: true }).find('.mq-pagination').exists()).toBe(true)
  })

  test('renders showMessage, custom labels and trimmed text', () => {
    const wrapper = mountPage({
      total: 5,
      showMessage: true,
      prevText: '  Prev  ',
      nextText: ' Next ',
    })
    expect(wrapper.find('.mq-pagination__message').text()).toBe(t('common.total', { total: 5 }))
    const buttons = wrapper.findAll('.mq-pagination__btn')
    expect(buttons[0].text()).toBe('Prev')
    expect(buttons[1].text()).toBe('Next')

    const fallback = mountPage({ prevText: '   ', nextText: '   ' })
    const fallbackButtons = fallback.findAll('.mq-pagination__btn')
    expect(fallbackButtons[0].text()).toBe(t('common.prevPage'))
    expect(fallbackButtons[1].text()).toBe(t('common.nextPage'))
  })

  test('exposes model value, total, totalPageNum and pageSize to every scoped slot', () => {
    const wrapper = mountPage({
      modelValue: 2,
      total: 95,
      pageSize: 10,
      showMessage: true,
    })
    expect(wrapper.find('.mq-pagination__size').text()).toBe('2 / 10')

    const scoped = mount(MqPagination, {
      props: { modelValue: 2, total: 95, pageSize: 10, totalPage: 4, showMessage: true },
      slots: {
        prev: '<text class="s-prev">{{ modelValue }}|{{ total }}|{{ pageSize }}</text>',
        size: '<text class="s-size">{{ modelValue }}|{{ totalPageNum }}|{{ total }}|{{ pageSize }}</text>',
        next: '<text class="s-next">{{ modelValue }}|{{ total }}|{{ pageSize }}</text>',
        message:
          '<text class="s-message">{{ modelValue }}|{{ totalPageNum }}|{{ total }}|{{ pageSize }}</text>',
      },
    })
    expect(scoped.find('.s-prev').text()).toBe('2|95|10')
    expect(scoped.find('.s-size').text()).toBe('2|4|95|10')
    expect(scoped.find('.s-next').text()).toBe('2|95|10')
    expect(scoped.find('.s-message').text()).toBe('2|4|95|10')
  })
})
