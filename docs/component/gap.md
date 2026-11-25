<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqGap `mq-gap`

间隔槽，可开底部安全区

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-gap>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-gap />
```

## API

### Props

| 名称             | 类型               | 必填 | 说明                              |
| ---------------- | ------------------ | ---- | --------------------------------- |
| `height`         | `string \| number` | 否   | 高度。数字按 px，字符串原样写入。 |
| `bg`             | `string`           | 否   | —                                 |
| `safeAreaBottom` | `boolean`          | 否   | 是否追加底部安全区内边距。        |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-gap/` 为准。

### 导出类型

`MqGapProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
