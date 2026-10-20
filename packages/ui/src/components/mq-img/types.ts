export interface MqImgProps {
  /** 图片地址。为空或加载失败时进入占位态。 */
  src?: string
  /** 宽。数字按 px，字符串原样使用。默认 `100%`。 */
  width?: string | number
  /** 高。数字按 px，字符串原样使用。默认 `180px`。 */
  height?: string | number
  /** 同 uni-app `image` 的 `mode`。 */
  mode?: string
  /** 圆角。数字按 px，字符串原样使用。 */
  radius?: string | number
  /** 胶囊圆角。 */
  round?: boolean
  lazyLoad?: boolean
  /** 加载中是否显示遮罩。 */
  showLoading?: boolean
  /** 加载失败时的文字。 */
  alt?: string
}

export interface MqImgEmits {
  click: [event: Event]
  load: [event: Event]
  error: [event: Event]
}
