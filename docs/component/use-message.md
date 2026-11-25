# useMessage 命令式弹框

`MqMessageBox` 的命令式入口。页面先挂 `<mq-message-box />`，再调用本函数即可发起 alert / confirm / prompt。

## 何时使用

- 不想在模板里维护对话框的显隐状态。
- 需要 Promise 风格的结果处理：确认 resolve，取消 / 点遮罩 reject。
- 同一页面存在多个弹框宿主，用 `selector` 指定目标。

## 用法示例

```ts
import { useMessage } from '@mosquito/ui'

const message = useMessage()

message.alert('操作成功')

message
  .confirm({ title: '提示', msg: '确定删除吗' })
  .then(() => remove())
  .catch((action) => console.log(action)) // 'cancel' | 'modal'

message.prompt({ inputValue: '', inputPattern: /.+@.+\..+/ }).then((value) => console.log(value))
```

```vue
<mq-message-box />
```

## API

### 参数

`useMessage(selector?: string)`：`selector` 对应 `<mq-message-box selector="..." />`，默认空字符串。

### Methods

| 名称      | 参数                | 返回值             | 说明                                 |
| --------- | ------------------- | ------------------ | ------------------------------------ |
| `show`    | `options`           | `Promise<unknown>` | 按 `options.type` 展示，默认 `alert` |
| `alert`   | `string \| options` | `Promise<void>`    | 只有确定按钮                         |
| `confirm` | `string \| options` | `Promise<void>`    | 取消时 reject                        |
| `prompt`  | `string \| options` | `Promise<string>`  | 确认时 resolve 输入值                |
| `close`   | —                   | `void`             | 关闭当前弹框，以 `'modal'` reject    |

`options` 的完整字段见 [MqMessageBox 文档](/component/message-box)。

## 注意

`confirm` / `prompt` 在用户取消时会 reject，调用方需要处理，否则会产生未处理的 Promise 拒绝。

## 主题变量

见 [MqMessageBox 文档](/component/message-box) 的「主题变量」。
