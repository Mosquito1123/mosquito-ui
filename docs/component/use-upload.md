# useUpload 文件上传

## 何时使用

需要脱离 `MqUpload` 组件、在逻辑里管理「选择 → 校验 → 上传 → 结果」流程时。所有 uni API 都从全局 `uni` 读取，便于用 `vi.spyOn(uni, 'chooseImage')` 等 mock。

## 示例

```ts
import { useUpload } from '@mosquito/ui/composables'

const uploader = useUpload({
  action: 'https://api.example.com/upload',
  maxCount: 3,
  maxSize: 2 * 1024 * 1024,
  accept: 'image',
  beforeUpload: (file) => file.size !== 0,
})

async function onPick() {
  await uploader.choose() // 调起相册，校验后追加到 files
  const urls = await uploader.upload() // 上传未成功的文件，返回地址数组
  console.log(urls, uploader.progress.value)
}

uploader.remove(0)
uploader.clear()
```

自定义上传：

```ts
const uploader = useUpload({
  customUpload: async (file) => {
    const form = new FormData()
    form.append('file', file.path)
    const res = await fetch('/upload', { method: 'POST', body: form })
    return (await res.json()).url as string
  },
})
```

## API

`useUpload(options?: UseUploadOptions): UseUploadReturn`

| 字段        | 类型                                                    | 说明                                                                                      |
| ----------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `files`     | `Ref<UseUploadFile[]>`                                  | 文件列表，条目含 `path`、`name?`、`size?`、`type?`、`id?`、`url?`、`status?`、`progress?` |
| `uploading` | `ComputedRef<boolean>`                                  | 是否存在 `status === 'pending'` 的文件                                                    |
| `progress`  | `Ref<number>`                                           | 本轮上传粗略进度（0-100）                                                                 |
| `error`     | `Ref<unknown>`                                          | 最近一次错误，初始 `null`                                                                 |
| `choose`    | `() => Promise<UseUploadFile[]>`                        | 调起选择并追加通过校验的文件，返回本次追加的条目                                          |
| `upload`    | `(file?: UseUploadFile \| number) => Promise<string[]>` | 上传指定文件（对象或下标）或所有未成功文件；错误记入 `error`，不抛出                      |
| `remove`    | `(file: UseUploadFile \| number) => void`               | 按下标/对象移除                                                                           |
| `clear`     | `() => void`                                            | 清空列表、进度和错误                                                                      |
| `validate`  | `(file: MqUploadFile) => Promise<boolean>`              | 校验路径、数量、大小与 `beforeUpload`                                                     |

`UseUploadOptions` 支持 `action`、`maxCount`（0 不限）、`maxSize`（0 不限，字节）、`accept`（`image` / `video` / `file`）、`beforeUpload`、`customUpload`，以及 `uni.uploadFile` 需要的 `name`、`headers`、`formData`、`multiple`。

## 注意

- `status` 取值：`ready`（刚选中）、`pending`（上传中）、`success`、`error`；`choose()` 不会自动上传。
- 没有 `action` 也没有 `customUpload` 时，上传结果直接使用 `file.path`，方便本地调试。
- `uni.uploadFile` 没有进度回调，所以 `progress` 只是按成功个数估算的单轮进度；需要精细进度请用 `customUpload` 自行维护。
- `validate()` 会调用 `beforeUpload`，`upload()` 内部会再校验一次；若 `beforeUpload` 有副作用请自行去重。
- `beforeUpload` 返回 `false` 不写 `error`（视为主动拒绝）；抛错会写入 `error`。
- jsdom 中全局 `uni` 的选择方法通常是 `vi.fn()`，测试 `choose()` 时必须让 mock 调用 `options.success(...)`，否则 Promise 不会完成；`uni` 不存在时会安全返回空数组。
