import type { Ref } from 'vue'

/** 单条语言的键值表。键支持 `a.b.c` 点路径，值支持 `{{name}}` 插值。 */
export type MqMessageMap = Record<string, string>

/** 语言包集合：语言标识 -> 键值表。 */
export type MqLocaleMessages = Record<string, MqMessageMap>

/** 自定义语言包允许写成嵌套对象，合并前会摊平成点路径。 */
export interface MqMessageInput {
  [key: string]: string | MqMessageInput
}

/** 插值的参数值。 */
export type MqTranslateParams = Record<string, string | number>

/** t 函数签名。 */
export type MqTranslate = (key: string, params?: MqTranslateParams) => string

/** 全局语言状态，模块级单例。 */
export interface MqLocaleState {
  locale: string
  messages: MqLocaleMessages
}

/** useLocale 返回值。 */
export interface UseLocaleReturn {
  locale: Ref<string>
  t: MqTranslate
  setLocale: (locale: string, messages?: MqMessageInput) => void
  addMessages: (locale: string, messages: MqMessageInput) => void
  messages: Ref<MqLocaleMessages>
}
