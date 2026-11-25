<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqUpload `mq-upload`

图片 / 视频 / 文件选择，接 `uni.uploadFile` 或自定义上传

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-upload>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-upload />
```

## API

### Props

| 名称           | 类型                                                  | 必填 | 说明                                                                                   |
| -------------- | ----------------------------------------------------- | ---- | -------------------------------------------------------------------------------------- |
| `modelValue`   | `string[]`                                            | 否   | 已上传文件的地址列表。                                                                 |
| `maxCount`     | `number`                                              | 否   | 最多几个，0 表示不限制。                                                               |
| `multiple`     | `boolean`                                             | 否   | —                                                                                      |
| `accept`       | `MqUploadAccept`                                      | 否   | 选择类型。`image` 走相册/相机，`video` 走视频，`file` 走文件选择。                     |
| `disabled`     | `boolean`                                             | 否   | —                                                                                      |
| `readonly`     | `boolean`                                             | 否   | —                                                                                      |
| `size`         | `number \| string`                                    | 否   | 单个格子边长，数字按 px。                                                              |
| `preview`      | `boolean`                                             | 否   | 点击图片是否调用 `uni.previewImage`。                                                  |
| `action`       | `string`                                              | 否   | 配合 `uni.uploadFile` 的上传地址。不写且没有 `customUpload` 时，直接把临时路径当结果。 |
| `name`         | `string`                                              | 否   | 上传字段名。                                                                           |
| `headers`      | `Record<string, string>`                              | 否   | —                                                                                      |
| `formData`     | `Record<string, string>`                              | 否   | —                                                                                      |
| `maxSize`      | `number`                                              | 否   | 单文件大小上限，字节。                                                                 |
| `beforeUpload` | `(file: MqUploadFile) => boolean \| Promise<boolean>` | 否   | 选中后、上传前的校验。返回 `false` 时不传。                                            |
| `customUpload` | `(file: MqUploadFile) => string \| Promise<string>`   | 否   | 自定义上传，返回最终地址。                                                             |
| `tip`          | `string`                                              | 否   | 下方说明文字。                                                                         |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: { fileList: string[] }]` | — |
| `success` | `[payload: { file: MqUploadFile` | — |
| `error` | `[payload: { file: MqUploadFile` | — |
| `remove` | `[payload: { index: number` | — |
| `oversize` | `[payload: { file: MqUploadFile` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-upload/` 为准。

### 导出类型

`MqUploadAccept`、`MqUploadFile`、`MqUploadProps`、`MqUploadEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
