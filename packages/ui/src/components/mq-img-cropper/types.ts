export type MqImgCropperAspect = number | string

export interface MqImgCropperProps {
  /** 图片地址。可用 `chooseImage()` 或选图按钮替换。 */
  src?: string
  /** 裁剪框 / 导出宽度，单位 px。数字字符串按 px 处理；不传按 200。 */
  width?: number | string
  /** 裁剪框 / 导出高度，单位 px。数字字符串按 px 处理；不传按 200。 */
  height?: number | string
  /** 宽高比：数字表示宽 / 高，字符串支持 `1:1`、`16:9`。 */
  aspectRatio?: MqImgCropperAspect
  /** 导出质量，0 - 1，默认 1。 */
  quality?: number
  /** 禁用态：不响应交互，也不发出事件。 */
  disabled?: boolean
  /** 是否在裁剪框内显示九宫格参考线。 */
  showGrid?: boolean
}

/** 图片信息就绪时发出的载荷。 */
export interface MqImgCropperReady {
  width: number
  height: number
}

/** 裁剪结果。 */
export interface MqImgCropperResult {
  path: string
  width: number
  height: number
}

export interface MqImgCropperEmits {
  ready: [info: MqImgCropperReady]
  cancel: []
  confirm: [result: MqImgCropperResult]
}

export interface MqImgCropperExpose {
  /** 调用 `uni.chooseImage` 选图并加载。禁用态下不生效。 */
  chooseImage: () => void
  /** 按当前比例与尺寸导出裁剪结果，成功时发出 `confirm`。 */
  crop: () => void
  /** 顺时针旋转 90 度。禁用态下不生效。 */
  rotate: () => void
  /** 重置旋转、缩放与位移。 */
  reset: () => void
}
