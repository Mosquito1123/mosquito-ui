<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqEmpty `mq-empty`

空状态。标记用伪元素，图片和底部用插槽；支持 `icon` / `icon-size`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-empty>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-empty />
```

## API

### Props

| 名称       | 类型               | 必填 | 说明                                              |
| ---------- | ------------------ | ---- | ------------------------------------------------- |
| `tip`      | `string`           | 否   | —                                                 |
| `icon`     | `string`           | 否   | 文字图形，或包含 `/` / `data:` 的图片地址。       |
| `iconSize` | `string \| number` | 否   | 图标尺寸。数字按 px，同时用于文字字号与图片宽高。 |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-empty/` 为准。

### 导出类型

`MqEmptyProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
