import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MqSwiper from '@/components/mq-swiper/MqSwiper.vue'

const list = [{ url: '/a.png', title: '图 A' }, '/b.png', { url: '/c.png' }]

function mountSwiper(props: Record<string, unknown> = {}) {
  return mount(MqSwiper, { props: { list, ...props } })
}

describe('MqSwiper', () => {
  test('renders items, title and normalized string entries', () => {
    const wrapper = mountSwiper()
    const items = wrapper.findAll('swiper-item')
    expect(items).toHaveLength(3)
    expect(wrapper.find('.mq-swiper__title-text').text()).toBe('图 A')
    expect(wrapper.findAll('.mq-swiper__image')).toHaveLength(3)
    expect(wrapper.find('.mq-swiper').attributes('style')).toContain('height: 160px')
  })

  test('emits change and update:modelValue when swiper changes', async () => {
    const wrapper = mountSwiper()
    await wrapper.find('swiper').trigger('change', { detail: { current: 1 } })
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    expect(wrapper.emitted('change')![0][0]).toMatchObject({ index: 1, item: '/b.png' })
  })

  test('ignores duplicate or out-of-range change indices', async () => {
    const wrapper = mountSwiper()
    await wrapper.find('swiper').trigger('change', { detail: { current: 0 } })
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.find('swiper').trigger('change', { detail: { current: 99 } })
    expect(wrapper.emitted('change')![0][0]).toMatchObject({ index: 2 })
  })

  test('syncs external modelValue and clamps on list shrink', async () => {
    const wrapper = mountSwiper({ modelValue: 2 })
    expect(wrapper.findAll('.mq-swiper__dot')[2].classes()).toContain('is-active')
    await wrapper.setProps({ modelValue: 5 })
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.setProps({ modelValue: 1 })
    expect(wrapper.findAll('.mq-swiper__dot')[1].classes()).toContain('is-active')
    await wrapper.setProps({ list: ['/x.png'] })
    expect(wrapper.findAll('.mq-swiper__dot')).toHaveLength(0)
  })

  test('emits click with index and item', async () => {
    const wrapper = mountSwiper()
    await wrapper.findAll('swiper-item')[1].trigger('click')
    expect(wrapper.emitted('click')![0][0]).toMatchObject({ index: 1, item: '/b.png' })
  })

  test('emits transition payload', async () => {
    const wrapper = mountSwiper()
    await wrapper.find('swiper').trigger('transition', { detail: { dx: 12, dy: -3 } })
    expect(wrapper.emitted('transition')).toEqual([[{ dx: 12, dy: -3 }]])
  })

  test('draws indicator dots with active color', () => {
    const wrapper = mountSwiper({
      indicatorColor: 'rgb(1, 2, 3)',
      indicatorActiveColor: 'rgb(4, 5, 6)',
    })
    const dots = wrapper.findAll('.mq-swiper__dot')
    expect(dots).toHaveLength(3)
    expect(dots[0].attributes('style')).toContain('rgb(4, 5, 6)')
    expect(dots[1].attributes('style')).toContain('rgb(1, 2, 3)')
  })

  test('hides indicator when disabled or single item', () => {
    const hidden = mountSwiper({ indicator: false })
    expect(hidden.find('.mq-swiper__indicator').exists()).toBe(false)
    const single = mount(MqSwiper, { props: { list: ['/only.png'] } })
    expect(single.find('.mq-swiper__indicator').exists()).toBe(false)
  })

  test('passes swiper options and margins through', () => {
    const wrapper = mountSwiper({
      vertical: true,
      circular: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      height: '40vh',
      previousMargin: 10,
      nextMargin: '20px',
    })
    const swiper = wrapper.find('swiper')
    expect(swiper.attributes('vertical')).toBe('true')
    expect(swiper.attributes('circular')).toBe('true')
    expect(swiper.attributes('autoplay')).toBe('true')
    expect(swiper.attributes('interval')).toBe('2000')
    expect(swiper.attributes('duration')).toBe('500')
    expect(swiper.attributes('previous-margin')).toBe('10px')
    expect(swiper.attributes('next-margin')).toBe('20px')
    expect(wrapper.find('.mq-swiper').attributes('style')).toContain('height: 40vh')
  })

  test('exposes switchTo with clamping', () => {
    const wrapper = mountSwiper()
    const vm = wrapper.vm as unknown as { switchTo: (index: number) => void }
    vm.switchTo(2)
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    vm.switchTo(2)
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    vm.switchTo(-1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[2], [0]])
  })

  test('handles an empty list', () => {
    const wrapper = mount(MqSwiper)
    expect(wrapper.findAll('swiper-item')).toHaveLength(0)
    expect(wrapper.find('.mq-swiper__indicator').exists()).toBe(false)
  })
})
