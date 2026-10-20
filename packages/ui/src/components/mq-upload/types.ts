export type MqUploadAccept = 'image' | 'video' | 'file'

export interface MqUploadFile {
  path: string
  name?: string
  size?: number
  type?: string
}

export interface MqUploadProps {
  /** 已上传文件的地址列表。 */
  modelValue?: string[]
  /** 最多几个，0 表示不限制。 */
  maxCount?: number
  multiple?: boolean
  /** 选择类型。`image` 走相册/相机，`video` 走视频，`file` 走文件选择。 */
  accept?: MqUploadAccept
  disabled?: boolean
  readonly?: boolean
  /** 单个格子边长，数字按 px。 */
  size?: number | string
  /** 点击图片是否调用 `uni.previewImage`。 */
  preview?: boolean
  /** 配合 `uni.uploadFile` 的上传地址。不写且没有 `customUpload` 时，直接把临时路径当结果。 */
  action?: string
  /** 上传字段名。 */
  name?: string
  headers?: Record<string, string>
  formData?: Record<string, string>
  /** 单文件大小上限，字节。 */
  maxSize?: number
  /** 选中后、上传前的校验。返回 `false` 时不传。 */
  beforeUpload?: (file: MqUploadFile) => boolean | Promise<boolean>
  /** 自定义上传，返回最终地址。 */
  customUpload?: (file: MqUploadFile) => string | Promise<string>
  /** 下方说明文字。 */
  tip?: string
}

export interface MqUploadEmits {
  'update:modelValue': [value: string[]]
  change: [payload: { fileList: string[] }]
  success: [payload: { file: MqUploadFile; url: string }]
  error: [payload: { file: MqUploadFile; error: unknown }]
  remove: [payload: { index: number; url: string }]
  oversize: [payload: { file: MqUploadFile; maxSize: number }]
}
