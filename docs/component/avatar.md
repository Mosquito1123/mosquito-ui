<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqAvatar `mq-avatar`

头像：图片 / 文字 / `mark`；叠层头像组超出数量收成 `+N`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-avatar>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-avatar />
```

## API

### Props

| 名称      | 类型            | 必填 | 说明                     |
| --------- | --------------- | ---- | ------------------------ |
| `src`     | `string`        | 否   | —                        |
| `text`    | `string`        | 否   | —                        |
| `mark`    | `string`        | 否   | 文字标记，代替图标字体。 |
| `shape`   | `MqAvatarShape` | 否   | —                        |
| `size`    | `MqAvatarSize`  | 否   | —                        |
| `bgColor` | `string`        | 否   | —                        |
| `color`   | `string`        | 否   | —                        |
| `alt`     | `string`        | 否   | —                        |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-avatar/` 为准。

### 导出类型

`MqAvatarShape`、`MqAvatarSize`、`MqAvatarProps`、`MqAvatarEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
