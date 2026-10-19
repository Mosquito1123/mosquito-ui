export type MqSkeletonTheme = 'text' | 'avatar' | 'paragraph' | 'image'
export type MqSkeletonAnimation = '' | 'gradient' | 'flashed'

export interface MqSkeletonProps {
  theme?: MqSkeletonTheme
  /** 为 true 时显示骨架，否则显示默认插槽。 */
  loading?: boolean
  animation?: MqSkeletonAnimation
  /** `paragraph` 主题的行数。非法时按 3。 */
  rows?: number
}
