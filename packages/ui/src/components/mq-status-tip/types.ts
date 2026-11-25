/** 内置缺省图类型。其余字符串按自定义图片 URL 处理。 */
export type MqStatusTipImage = 'search' | 'network' | 'content' | 'collect' | 'comment' | 'halo' | 'message'

export interface MqStatusTipImageSize {
  width?: string | number
  height?: string | number
}

export interface MqStatusTipProps {
  /** 内置类型或自定义图片 URL。 */
  image?: MqStatusTipImage | string
  /** 图片大小。数字按 px，字符串按 CSS 尺寸。 */
  imageSize?: string | number | MqStatusTipImageSize
  tip?: string
  /** 自定义图片的 uni-app `mode`。 */
  imageMode?: string
  /** 自定义图片 URL 前缀。 */
  urlPrefix?: string
}
