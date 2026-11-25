<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqAvatarGroup `mq-avatar-group`

面向 uni-app（Vue 3）的轻量组件。

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-avatar-group>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-avatar-group />
```

## API

### Props

| 名称            | 类型                     | 必填 | 说明                                                   |
| --------------- | ------------------------ | ---- | ------------------------------------------------------ |
| `maxCount`      | `number`                 | 否   | 最多显示几个头像，超出部分收成 `+N`。为 0 时全部显示。 |
| `total`         | `number`                 | 否   | 外部总数，用于只拿到数量、不渲染完整列表的场景。       |
| `cascading`     | `MqAvatarGroupCascading` | 否   | 叠层方向。`right-up` 把顺序反过来，从右侧开始叠。      |
| `shape`         | `MqAvatarShape`          | 否   | 统一头像形状，子头像没写 `shape` 时生效。              |
| `size`          | `MqAvatarSize`           | 否   | 统一头像尺寸，子头像没写 `size` 时生效。               |
| `vertical`      | `boolean`                | 否   | —                                                      |
| `collapseText`  | `string`                 | 否   | 折叠头像上的文字，不写时为 `+N`。                      |
| `collapseBg`    | `string`                 | 否   | —                                                      |
| `collapseColor` | `string`                 | 否   | —                                                      |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-avatar-group/` 为准。

### 导出类型

`MqAvatarGroupCascading`、`MqAvatarGroupProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
