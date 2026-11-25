import { beforeEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MqCalendarView from '@/components/mq-calendar-view/MqCalendarView.vue'
import { setLocale } from '@/locale'

beforeEach(() => {
  setLocale('zh-CN')
})

function mountView(props: Record<string, unknown> = {}) {
  return mount(MqCalendarView, { props: { modelValue: '2026-01-15', month: '2026-01-15', ...props } })
}

function dayCell(wrapper: ReturnType<typeof mountView>, month: string, day: number) {
  const section = wrapper.find(`[data-month="${month}"]`)
  const cell = section.findAll('.mq-calendar-view__cell').find((item) => item.text() === String(day))
  if (!cell) {
    throw new Error(`找不到 ${month}-${day}`)
  }
  return cell
}

describe('MqCalendarView', () => {
  test('渲染当前月及前后各一个月，标题与星期可翻译', async () => {
    const wrapper = mountView()
    expect(wrapper.findAll('.mq-calendar-view__month')).toHaveLength(3)
    expect(wrapper.find('[data-month="2026-01"]').exists()).toBe(true)
    expect(wrapper.find('[data-month="2025-12"]').exists()).toBe(true)
    expect(wrapper.find('[data-month="2026-02"]').exists()).toBe(true)
    expect(wrapper.findAll('.mq-calendar-view__weekday')[0].text()).toBe('日')
    expect(wrapper.find('.mq-calendar-view__title').text()).toBe('2025年12月')

    setLocale('en-US')
    await nextTick()
    expect(wrapper.findAll('.mq-calendar-view__weekday')[0].text()).toBe('Sun')
    setLocale('zh-CN')
  })

  test('单选点击日期后提交字符串值', async () => {
    const wrapper = mountView()
    await dayCell(wrapper, '2026-01', 20).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-01-20']])
    expect(wrapper.emitted('change')![0][0]).toEqual({ value: '2026-01-20' })
    expect(dayCell(wrapper, '2026-01', 20).classes()).toContain('is-selected')
  })

  test('禁用日期不响应点击', async () => {
    const disabledDate = vi.fn((date: string) => date === '2026-01-20')
    const wrapper = mountView({ disabledDate, minDate: '2026-01-10', maxDate: '2026-01-25' })

    await dayCell(wrapper, '2026-01', 5).trigger('click')
    await dayCell(wrapper, '2026-01', 20).trigger('click')
    await dayCell(wrapper, '2026-01', 26).trigger('click')

    expect(wrapper.emitted('change')).toBeUndefined()
    expect(disabledDate).toHaveBeenCalled()
  })

  test('区间可选择起止两天', async () => {
    const wrapper = mountView({ type: 'daterange', modelValue: '' })
    await dayCell(wrapper, '2026-01', 10).trigger('click')
    await dayCell(wrapper, '2026-01', 12).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['2026-01-10']], [['2026-01-10', '2026-01-12']]])
  })

  test('同日起止与超出 maxRange 时提示并保留起点', async () => {
    const same = mountView({ type: 'daterange', modelValue: '' })
    await dayCell(same, '2026-01', 10).trigger('click')
    await dayCell(same, '2026-01', 10).trigger('click')
    expect(same.find('.mq-calendar-view__error').text()).toBe('起止日期不能是同一天')
    expect(same.emitted('change')).toHaveLength(1)

    const ranged = mountView({ type: 'daterange', modelValue: '', maxRange: 3 })
    await dayCell(ranged, '2026-01', 10).trigger('click')
    await dayCell(ranged, '2026-01', 15).trigger('click')
    expect(ranged.find('.mq-calendar-view__error').text()).toBe('选择天数不能超过 3 天')
    expect(ranged.emitted('change')).toHaveLength(1)

    const allowed = mountView({ type: 'daterange', modelValue: '', maxRange: 3, allowSameDay: true })
    await dayCell(allowed, '2026-01', 10).trigger('click')
    await dayCell(allowed, '2026-01', 10).trigger('click')
    expect(allowed.emitted('change')).toHaveLength(2)
  })

  test('datetime 类型按 defaultTime 拼接时间', async () => {
    const wrapper = mountView({ type: 'datetime', modelValue: '', defaultTime: '09:30:00' })
    await dayCell(wrapper, '2026-01', 20).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-01-20 09:30:00']])

    const range = mountView({
      type: 'datetimerange',
      modelValue: [],
      defaultTime: ['08:00:00', '20:00:00'],
    })
    await dayCell(range, '2026-01', 10).trigger('click')
    await dayCell(range, '2026-01', 12).trigger('click')
    expect(range.emitted('update:modelValue')).toEqual([
      [['2026-01-10 08:00:00']],
      [['2026-01-10 08:00:00', '2026-01-12 20:00:00']],
    ])
  })

  test('panelHeight 生成样式，scrollIntoView 在 jsdom 中安全调用', () => {
    const wrapper = mountView({ panelHeight: 240 })
    expect(wrapper.attributes('style')).toContain('max-height: 240px')
    expect(() => (wrapper.vm as unknown as { scrollIntoView: () => void }).scrollIntoView()).not.toThrow()
  })
})
