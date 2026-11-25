# useNotify 通知条

## 何时使用

需要带类型（主色/成功/警告/错误）、位置或自定义颜色的顶部/底部通知条时。它转发 `showNotify` / `hideNotify` / `notifyState`，页面仍需挂 `<mq-notify />`。

## 示例

```ts
import { useNotify } from '@mosquito/ui/composables'

const notify = useNotify({ position: 'top', duration: 2500 })

notify.show('普通通知')
notify.primary('提交中')
notify.success('保存成功')
notify.warning('即将过期')
notify.error('删除失败')
notify.success('自定义', { duration: 0, closable: true })
notify.hide()
```

## API

`useNotify(options?: Omit<MqNotifyOptions, 'message'>): UseNotifyReturn`

| 字段                                        | 类型                                                             | 说明                                                                                               |
| ------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `state`                                     | `MqNotifyState`                                                  | 就是 `notifyState`，含 `visible`、`message`、`type`、`position`、`color`、`background`、`closable` |
| `show`                                      | `(input: string \| MqNotifyOptions) => MqNotifyCloser`           | 显示通知，预设作为缺省值；返回关闭当前这条的函数                                                   |
| `hide`                                      | `() => void`                                                     | 关闭当前通知，等价于 `hideNotify()`                                                                |
| `primary` / `success` / `warning` / `error` | `(message: string, options?: UseNotifyPreset) => MqNotifyCloser` | 按名字设置类型；`error` 对应底层 `danger`                                                          |

`UseNotifyPreset` 可包含 `type`、`position`、`duration`、`color`、`background`、`closable`。

## 注意

- 预设按实例隔离，显示状态是全局单例（`state === notifyState`），后一条覆盖前一条。
- 语义方法的类型优先于预设和单次 options 里的 `type`；其他字段仍可被单次 options 覆盖。
- `duration: 0` 不自动关闭；底层不提供「常驻原生通知」，必须挂 `<mq-notify />` 才有 UI。
- `error()` 映射到 `MqNotifyType` 中的 `danger`，不要传 `'error'` 给类型字段。
