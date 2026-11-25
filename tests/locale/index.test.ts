import { beforeEach, describe, expect, test } from 'vitest'
import { addMessages, enUS, localeState, setLocale, t, zhCN } from '@/locale'

function resetLocale() {
  localeState.locale = 'zh-CN'
  localeState.messages = {
    'zh-CN': { ...zhCN },
    'en-US': { ...enUS },
  }
}

beforeEach(resetLocale)

describe('locale', () => {
  test('默认语言为 zh-CN，内置文案可用', () => {
    expect(localeState.locale).toBe('zh-CN')
    expect(t('common.confirm')).toBe('确定')
    expect(t('common.cancel')).toBe('取消')
    expect(t('calendar.prevMonth')).toBe('上个月')
    expect(enUS['common.confirm']).toBe('Confirm')
  })

  test('setLocale 切换语言，t 使用当前语言', () => {
    setLocale('en-US')
    expect(localeState.locale).toBe('en-US')
    expect(t('common.confirm')).toBe('Confirm')
    expect(t('common.search')).toBe('Search')
    expect(t('calendar.prevMonth')).toBe('Previous month')
  })

  test('t 支持点路径与 {{name}} 插值', () => {
    expect(t('calendar.monthTitle', { year: 2026, month: 1 })).toBe('2026年1月')
    setLocale('en-US')
    expect(t('calendar.monthTitle', { year: 2026, month: 1 })).toBe('2026/1')
    expect(t('common.total', { total: 8 })).toBe('8 items in total')
    expect(t('calendar.weekdays.monday')).toBe('Mon')
  })

  test('缺失键回退 zh-CN，再回退 key 本身', () => {
    addMessages('zh-CN', { 'common.onlyChinese': '仅中文' })
    setLocale('en-US')
    expect(t('common.onlyChinese')).toBe('仅中文')
    expect(t('common.notTranslatedAnywhere')).toBe('common.notTranslatedAnywhere')
    // 语言包整体不存在时也走默认语言。
    setLocale('fr-FR')
    expect(t('common.confirm')).toBe('确定')
  })

  test('setLocale 可同时补充文案，addMessages 深合并且可覆盖', () => {
    setLocale('en-US', { 'common.confirm': 'Sure', 'custom.greeting': 'Hello' })
    expect(t('common.confirm')).toBe('Sure')
    expect(t('common.cancel')).toBe('Cancel')
    expect(t('custom.greeting')).toBe('Hello')
    expect(localeState.locale).toBe('en-US')

    addMessages('en-US', { 'common.confirm': 'Yep', 'common.search': 'Find' })
    expect(t('common.confirm')).toBe('Yep')
    expect(t('common.search')).toBe('Find')
    expect(t('custom.greeting')).toBe('Hello')
    expect(localeState.locale).toBe('en-US')
  })

  test('addMessages 支持嵌套对象，摊平为点路径', () => {
    setLocale('en-US')
    addMessages('en-US', { custom: { nested: { key: 'Deep' } } })
    expect(t('custom.nested.key')).toBe('Deep')
    addMessages('en-US', { custom: { nested: { key: 'Overridden' } } })
    expect(t('custom.nested.key')).toBe('Overridden')
  })

  test('未提供的插值参数保持占位符原样', () => {
    expect(t('common.total')).toBe('共 {{total}} 条')
  })
})
