export interface MqLoadingProps {
  /** 直径。数字按 px。小于等于 0 或非法时用 20。 */
  size?: string | number
  /** 顶部描边颜色，写到 `border-top-color`。 */
  color?: string
  /** 无障碍名称。默认「加载中」。 */
  label?: string
}
