# MqMessageBox 命令式弹框

页面里挂一个宿主，即可通过 `useMessage()` 调用 alert、confirm、prompt。每次调用返回 Promise：确认时 resolve，取消或点遮罩时以 `'cancel' | 'modal'` reject。

## 何时使用

- 需要强提醒（只有确定按钮）、二次确认或带输入校验的弹窗。
- 需要在路由守卫、请求拦截器等位置之外，用命令式方式发起确认。
- 同一页面需要多个独立弹框，可用 `selector` 隔离。

## 用法示例

```vue
<mq-message-box />
```

```ts
import { useMessage } from '@mosquito/ui'

const message = useMessage()

message.alert('操作成功')
message.confirm({ title: '提示', msg: '确定删除吗' }).catch(() => {})
message
  .prompt({ title: '请输入邮箱', inputPattern: /.+@.+\..+/i, inputError: '邮箱格式不正确' })
  .then((value) => console.log(value))
  .catch(() => {})
```

## API

### Props

| 名称       | 类型     | 默认值 | 说明                                         |
| ---------- | -------- | ------ | -------------------------------------------- |
| `selector` | `string` | `''`   | 宿主唯一标识，与 `useMessage(selector)` 对应 |

### Events

| 名称      | 参数      | 说明                               |
| --------- | --------- | ---------------------------------- |
| `confirm` | `request` | 用户确认，随后 resolve Promise     |
| `cancel`  | `request` | 用户取消，随后以 `'cancel'` reject |

### Options（`useMessage` 传入）

| 名称                                            | 类型                                                           | 默认值                      | 说明                                      |
| ----------------------------------------------- | -------------------------------------------------------------- | --------------------------- | ----------------------------------------- |
| `title`                                         | `string`                                                       | —                           | 标题                                      |
| `msg`                                           | `string`                                                       | `''`                        | 消息文案                                  |
| `type`                                          | `'alert' \| 'confirm' \| 'prompt'`                             | `'alert'`                   | 弹框类型                                  |
| `closeOnClickModal`                             | `boolean`                                                      | `true`                      | 点遮罩是否关闭（以 `'modal'` reject）     |
| `inputType` / `inputValue` / `inputPlaceholder` | `string` / `string \| number` / `string`                       | `'text'` / — / `请输入内容` | prompt 输入框配置                         |
| `inputPattern` / `inputValidate` / `inputError` | `RegExp` / `(value) => boolean \| Promise<boolean>` / `string` | — / — / `输入的数据不合法`  | prompt 校验                               |
| `confirmButtonText` / `cancelButtonText`        | `string`                                                       | `确定` / `取消`             | 按钮文案                                  |
| `zIndex`                                        | `number`                                                       | —                           | 弹窗层级                                  |
| `beforeConfirm`                                 | `({ resolve }) => void`                                        | —                           | 确认前异步处理，`resolve(false)` 拦截关闭 |

### Slots

无；复杂内容建议改用 `mq-dialog` 默认插槽。

### Methods

宿主没有对外方法；关闭当前弹框用 `useMessage().close()`。

## 主题变量

复用 `mq-dialog` 的 `--mq-*` 变量；输入框错误文案使用 `--mq-color-danger`，清单见[主题令牌](/guide/theme-vars)。
