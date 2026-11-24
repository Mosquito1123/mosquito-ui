# useDialog 对话框状态

## 何时使用

需要在业务代码里集中管理一个对话框的显隐、文案与确认前拦截，而不想给 `MqDialog` 打补丁时。只管理状态，渲染仍由 `<mq-dialog v-model="dialog.visible" />` 负责。

## 示例

```ts
import { useDialog } from '@mosquito/ui/composables'

const dialog = useDialog({
  title: '删除确认',
  message: '确定删除这条记录？',
  confirmText: '删除',
  showCancel: true,
})

function open() {
  dialog.show({ message: `确定删除「${name}」？` })
}

async function onConfirm() {
  // beforeConfirm 可放在默认值里，也可运行时替换
  dialog.beforeConfirm.value = async () => {
    await api.check()
    return true
  }
  const ok = await dialog.confirm()
  if (ok) {
    await api.remove()
  }
}
```

```vue
<mq-dialog
  v-model="dialog.visible"
  :title="dialog.title"
  :message="dialog.message"
  :confirm-text="dialog.options.confirmText"
  @confirm="onConfirm"
  @cancel="dialog.cancel"
/>
```

## API

`useDialog(options?: UseDialogOptions): UseDialogReturn`

| 字段                | 类型                                      | 说明                                                                          |
| ------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| `visible`           | `Ref<boolean>`                            | 受控显隐，可直接 `v-model`                                                    |
| `options`           | `Ref<UseDialogOptions>`                   | 当前生效配置；每次 `show()` 都生成新对象                                      |
| `title` / `message` | `ComputedRef<string>`                     | 从 `options` 派生，缺省为空串                                                 |
| `show`              | `(options?: UseDialogOptions) => void`    | 用「默认值 + 本次配置」覆盖当前配置并打开                                     |
| `confirm`           | `() => Promise<boolean>`                  | 等待 `beforeConfirm`；通过才关闭并返回 `true`，被拦截时保持打开并返回 `false` |
| `cancel` / `close`  | `() => void`                              | 关闭，不触发 `beforeConfirm`                                                  |
| `beforeConfirm`     | `Ref<MqDialogBeforeConfirm \| undefined>` | 可写入的钩子；`show()` 会同步默认值/本次配置里的钩子                          |

`UseDialogOptions` 等价于 `MqDialogProps` 去掉 `modelValue`，包含 `title`、`message`、`showCancel`、`confirmText`、`cancelText`、`beforeConfirm`、`maskClosable`、`duration`、`zIndex`。

## 注意

- `confirm()` 是异步的：`beforeConfirm` 返回 `false` 或抛错都会视为取消；返回 `void` 视为通过。
- 等待期间若调用了 `cancel()` / `close()` / `show()`，这次 `confirm()` 会返回 `false`，不会把新打开的对话框误关掉。
- `cancel()` 与 `close()` 行为一致，保留两个名字是为了语义清晰。
- 本 composable 不修改 `MqDialog` 源码；`MqDialog` 自己的 `beforeConfirm` prop 仍可单独使用，两者不要重复配置。
