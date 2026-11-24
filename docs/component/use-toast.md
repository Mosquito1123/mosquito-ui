# useToast 轻提示

## 何时使用

需要在逻辑里快速弹出文字提示，又不想每次重复写 `duration` 等选项时。它转发 `showToast` / `hideToast` / `toastState`，不改变原有单例行为（同一时间只显示最后一条）。

## 示例

```ts
import { useToast } from '@mosquito/ui/composables'

const toast = useToast({ duration: 1500 })

toast.show('保存成功')
toast.success('已提交')
toast.show({ message: '网络异常', duration: 0 }) // 不自动关闭，需手动 hide
const close = toast.info('处理中')
close() // 只关闭这一条（若它仍是最后一条）
toast.hide()
```

模板里可直接绑定共享状态：

```vue
<mq-toast v-model:visible="toast.state.visible" :message="toast.state.message" />
```

## API

`useToast(options?: { duration?: number }): UseToastReturn`

| 字段                                     | 类型                                                                  | 说明                                                         |
| ---------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ |
| `state` / `toasts`                       | `MqToastState`                                                        | 就是 `toastState`，同一响应式对象，包含 `visible`、`message` |
| `show`                                   | `(input: string \| MqToastOptions) => MqToastCloser`                  | 显示提示，预设 duration 会作为缺省值；返回关闭当前这条的函数 |
| `hide`                                   | `() => void`                                                          | 关闭当前提示，等价于 `hideToast()`                           |
| `success` / `error` / `info` / `warning` | `(message: string, options?: { duration?: number }) => MqToastCloser` | 语义化别名，底层仍是无图标的文字提示                         |

## 注意

- 预设按实例隔离：两次 `useToast()` 的 duration 互不干扰，创建后再修改传入的 options 对象也不会影响已创建的实例。
- 显示状态仍是全局单例：`toast.state === toastState`，多处调用会互相覆盖，这是底层设计，不是 bug。
- `duration: 0` 表示不自动关闭；底层在无宿主时会用原生 `uni.showToast` 兜底，详见 `utils/toast.ts`。
- `success` 等别名只是语义标记，不会改变图标或颜色；需要区分样式请用 `useNotify`。
