import { beforeEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import MqCalendar from '@/components/mq-calendar/MqCalendar.vue'
import MqConfigProvider from '@/components/mq-config-provider/MqConfigProvider.vue'
import MqDialog from '@/components/mq-dialog/MqDialog.vue'
import MqLoadmore from '@/components/mq-loadmore/MqLoadmore.vue'
import MqSearch from '@/components/mq-search/MqSearch.vue'
import { enUS, localeState, setLocale, zhCN } from '@/locale'

beforeEach(() => {
  localeState.locale = 'zh-CN'
  localeState.messages = {
    'zh-CN': { ...zhCN },
    'en-US': { ...enUS },
  }
})

describe('组件文案随语言切换', () => {
  test('MqDialog 默认中文，切到 en-US 后按钮与标题渲染英文', async () => {
    const wrapper = mount(MqDialog, { props: { modelValue: true, message: 'hello' } })
    await nextTick()
    expect(wrapper.find('.mq-dialog__btn--cancel').text()).toBe('取消')
    expect(wrapper.find('.mq-dialog__btn--confirm').text()).toBe('确定')
    expect(wrapper.find('.mq-popup').attributes('aria-label')).toBe('对话框')

    setLocale('en-US')
    await nextTick()
    expect(wrapper.find('.mq-dialog__btn--cancel').text()).toBe('Cancel')
    expect(wrapper.find('.mq-dialog__btn--confirm').text()).toBe('Confirm')
    expect(wrapper.find('.mq-popup').attributes('aria-label')).toBe('Dialog')
    wrapper.unmount()
  })

  test('MqSearch 占位符与操作按钮跟随语言', async () => {
    const wrapper = mount(MqSearch)
    expect(wrapper.find('input').attributes('placeholder')).toBe('搜索')
    expect(wrapper.find('.mq-search__action').text()).toBe('搜索')

    setLocale('en-US')
    await nextTick()
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search')
    expect(wrapper.find('.mq-search__action').text()).toBe('Search')
    wrapper.unmount()
  })

  test('MqCalendar 的月份、星期、导航与摘要都走 t()', async () => {
    const wrapper = mount(MqCalendar, { props: { month: '2026-01-01' } })
    expect(wrapper.find('.mq-calendar__month').text()).toBe('2026年1月')
    expect(wrapper.findAll('.mq-calendar__weekday')[0].text()).toBe('日')
    expect(wrapper.find('.mq-calendar__summary').text()).toBe('请选择日期')
    expect(wrapper.findAll('.mq-calendar__nav')[0].attributes('aria-label')).toBe('上个月')

    setLocale('en-US')
    await nextTick()
    expect(wrapper.find('.mq-calendar__month').text()).toBe('2026/1')
    expect(wrapper.findAll('.mq-calendar__weekday')[0].text()).toBe('Sun')
    expect(wrapper.find('.mq-calendar__summary').text()).toBe('Please select a date')
    expect(wrapper.findAll('.mq-calendar__nav')[0].attributes('aria-label')).toBe('Previous month')
    wrapper.unmount()
  })

  test('MqLoadmore 文案与重试提示跟随语言', async () => {
    const wrapper = mount(MqLoadmore, { props: { state: 'error' } })
    expect(wrapper.text()).toContain('加载失败')
    expect(wrapper.text()).toContain('点击重试')

    setLocale('en-US')
    await nextTick()
    expect(wrapper.text()).toContain('Failed to load')
    expect(wrapper.text()).toContain('Tap to retry')
    wrapper.unmount()
  })

  test('MqConfigProvider 的 locale prop 全局生效，卸载不回滚', async () => {
    const wrapper = mount(MqConfigProvider, {
      props: { locale: 'en-US' },
      slots: { default: () => h(MqDialog, { modelValue: true, message: 'hello' }) },
    })
    await nextTick()
    expect(localeState.locale).toBe('en-US')
    expect(wrapper.find('.mq-dialog__btn--confirm').text()).toBe('Confirm')

    await wrapper.setProps({ locale: 'zh-CN' })
    await nextTick()
    expect(localeState.locale).toBe('zh-CN')
    expect(wrapper.find('.mq-dialog__btn--confirm').text()).toBe('确定')

    await wrapper.setProps({ locale: 'en-US' })
    wrapper.unmount()
    expect(localeState.locale).toBe('en-US')
  })

  test('显式传入的文案优先于翻译，且切换语言后仍保持', async () => {
    const wrapper = mount(MqDialog, {
      props: { modelValue: true, confirmText: '自定义', message: 'hello' },
    })
    await nextTick()
    setLocale('en-US')
    await nextTick()
    expect(wrapper.find('.mq-dialog__btn--confirm').text()).toBe('自定义')
    expect(wrapper.find('.mq-dialog__btn--cancel').text()).toBe('Cancel')
    wrapper.unmount()
  })
})
