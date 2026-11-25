# 组合式函数

组合式函数从 `@mosquito/ui/composables` 导入，按场景把命令式调用或组件状态收进逻辑层。它们都是对现有 API 的封装，不替换组件；页面仍然需要挂对应的宿主组件（如 `<mq-toast />`、`<mq-notify />`）。

```ts
import {
  useToast,
  useNotify,
  useDialog,
  useCountDown,
  useUpload,
  useConfigProvider,
} from '@mosquito/ui/composables'
```

## useToast

`useToast(options?: { duration?: number })` 转发 `showToast` / `hideToast` / `toastState`。状态是全局单例，预设按实例隔离。

```ts
const toast = useToast({ duration: 1500 })

toast.show('保存成功')
toast.success('已提交')
toast.show({ message: '网络异常', duration: 0 }) // 不自动关闭
toast.hide()
```

`state` 就是 `toastState`，可直接绑到 `<mq-toast />`。`show` 返回只关闭当前一条的函数。`success` / `error` / `info` / `warning` 只是语义别名，不会改变图标或颜色。详见 [useToast](/component/use-toast)。

## useNotify

`useNotify(options?: Omit<MqNotifyOptions, 'message'>)` 转发 `showNotify` / `hideNotify` / `notifyState`。

```ts
const notify = useNotify({ position: 'top', duration: 2500 })

notify.primary('提交中')
notify.success('保存成功')
notify.error('删除失败') // 对应底层 danger
notify.hide()
```

`error()` 映射到 `MqNotifyType` 的 `danger`；不要给类型字段传 `'error'`。详见 [useNotify](/component/use-notify)。

## useDialog

`useDialog(options?)` 只管理对话框状态，渲染仍由 `<mq-dialog v-model="dialog.visible" />` 负责。

```ts
const dialog = useDialog({ title: '删除确认', message: '确定删除这条记录？' })

dialog.show({ message: '再确认一次' })
const ok = await dialog.confirm() // 通过 beforeConfirm 才关闭并返回 true
```

- `visible` 可直接 `v-model`；`title` / `message` 是从 `options` 派生的计算属性。
- `beforeConfirm` 是可写的 `Ref`，`confirm()` 是异步的。
- `cancel()` / `close()` 不触发 `beforeConfirm`。详见 [useDialog](/component/use-dialog)。

## useCountDown

`useCountDown(options?)` 在逻辑层拿倒计时读数和开始 / 暂停 / 重置能力。

```ts
const timer = useCountDown({ time: 60_000, format: 'mm:ss.SSS', millisecond: true })

timer.formatted.value
timer.current.value.seconds
timer.pause()
timer.start()
timer.update(30_000)
timer.reset()
```

- `current` 是 `{ total, days, hours, minutes, seconds, milliseconds }`。
- `update()` 不传参时强制刷新一次；`onFinish` 每次归零触发一次。详见 [useCountDown](/component/use-count-down)。

## useUpload

`useUpload(options?)` 管理「选择 → 校验 → 上传 → 结果」流程，所有 uni API 从全局 `uni` 读取。

```ts
const uploader = useUpload({ accept: 'image', maxCount: 3 })

await uploader.choose() // 调起选择，不会自动上传
const urls = await uploader.upload()
uploader.remove(0)
uploader.clear()
```

- 没有 `action` 也没有 `customUpload` 时，上传结果直接用 `file.path`。
- `progress` 是按成功个数估算的单轮进度，需要精细进度请用 `customUpload`。详见 [useUpload](/component/use-upload)。

## useConfigProvider

`useConfigProvider(options?)` 维护共享的主题模式和 CSS 变量表。

```ts
const theme = useConfigProvider({ theme: 'light' })

theme.setTheme('dark')
theme.setThemeVar('color-primary', '#8a5a2b')
theme.cssVars.value // { '--color-primary': '#8a5a2b' }
theme.reset()
```

- 所有实例共享同一份状态；`themeVars` 的键不自动补前缀，`cssVars` 才补。
- 组件 `MqConfigProvider` 仍按自己的 props 工作，需要显式把 `theme` / `cssVars` 传给它。详见 [useConfigProvider](/component/use-config-provider)。

## useImagePreview / useVideoPreview

预览类组合式函数与宿主组件共享同一份 reactive 状态，单独从子路径导入：

```ts
import { useImagePreview } from '@mosquito/ui/composables/use-image-preview'
import { useVideoPreview } from '@mosquito/ui/composables/use-video-preview'

const { state: images, show: showImages, hide: hideImages } = useImagePreview()
const { state: video, show: showVideo, hide: hideVideo } = useVideoPreview()

showImages({ urls: ['a.png', 'b.png'], current: 1 })
showVideo({ src: 'a.mp4', title: '演示', poster: 'cover.png' })
```

页面里放一个不带 props 的 `<mq-image-preview />` 或 `<mq-video-preview />` 作为宿主；`show()` 返回只关闭本次的 closer。详见 [useImagePreview](/component/use-image-preview) 和 [useVideoPreview](/component/use-video-preview)。

## 与组件的关系

组合式函数不替代组件：toast / notify 仍要挂宿主，对话框仍要 `<mq-dialog>`，倒计时和上传也可以用组件自身的 `ref` 方法与 `v-model`。两种方式按页面复杂度选择即可。
