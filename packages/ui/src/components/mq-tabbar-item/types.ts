export interface MqTabbarItemProps {
  title?: string
  name?: string | number
  /** 文字标记，替代图标字体。也可用 `icon` 插槽。 */
  mark?: string
  value?: string | number
  isDot?: boolean
  max?: number
}
