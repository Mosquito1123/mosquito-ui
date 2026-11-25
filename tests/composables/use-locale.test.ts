import { beforeEach, describe, expect, test } from 'vitest'
import { useLocale } from '@/composables/use-locale'
import { enUS, localeState, zhCN } from '@/locale'

beforeEach(() => {
  localeState.locale = 'zh-CN'
  localeState.messages = {
    'zh-CN': { ...zhCN },
    'en-US': { ...enUS },
  }
})

describe('useLocale', () => {
  test('返回共享的响应式 locale 与 messages', () => {
    const a = useLocale()
    const b = useLocale()
    expect(a.locale.value).toBe('zh-CN')
    a.locale.value = 'en-US'
    expect(b.locale.value).toBe('en-US')
    expect(a.messages.value['en-US']['common.confirm']).toBe('Confirm')
    localeState.locale = 'zh-CN'
  })

  test('t 跟随语言变化，setLocale/addMessages 与模块 API 一致', () => {
    const { t, setLocale, addMessages, locale } = useLocale()
    expect(t('common.confirm')).toBe('确定')
    setLocale('en-US')
    expect(locale.value).toBe('en-US')
    expect(t('common.confirm')).toBe('Confirm')

    addMessages('en-US', { 'common.confirm': 'Agreed' })
    expect(t('common.confirm')).toBe('Agreed')
    expect(useLocale().t('common.confirm')).toBe('Agreed')
  })

  test('setLocale 只切换语言，不传 messages 时不修改语言包', () => {
    const { setLocale } = useLocale()
    const before = JSON.stringify(localeState.messages)
    setLocale('en-US')
    expect(JSON.stringify(localeState.messages)).toBe(before)
  })
})
