<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqTabbarItem `mq-tabbar-item`

面向 uni-app（Vue 3）的轻量组件。

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-tabbar-item>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-tabbar-item />
```

## API

### Props

| 名称    | 类型               | 必填 | 说明                                         |
| ------- | ------------------ | ---- | -------------------------------------------- |
| `title` | `string`           | 否   | —                                            |
| `name`  | `string \| number` | 否   | —                                            |
| `mark`  | `string`           | 否   | 文字标记，替代图标字体。也可用 `icon` 插槽。 |
| `value` | `string \| number` | 否   | —                                            |
| `isDot` | `boolean`          | 否   | —                                            |
| `max`   | `number`           | 否   | —                                            |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-tabbar-item/` 为准。

### 导出类型

`MqTabbarItemProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
