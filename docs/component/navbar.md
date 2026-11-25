<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqNavbar `mq-navbar`

顶栏。左侧箭头用文字 `‹`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-navbar>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-navbar />
```

## API

### Props

| 名称               | 类型      | 必填 | 说明                                 |
| ------------------ | --------- | ---- | ------------------------------------ |
| `title`            | `string`  | 否   | —                                    |
| `leftText`         | `string`  | 否   | —                                    |
| `rightText`        | `string`  | 否   | —                                    |
| `leftArrow`        | `boolean` | 否   | 左侧显示文字箭头 ‹，不使用图标字体。 |
| `bordered`         | `boolean` | 否   | —                                    |
| `fixed`            | `boolean` | 否   | —                                    |
| `placeholder`      | `boolean` | 否   | 固定时是否生成等高占位。             |
| `safeAreaInsetTop` | `boolean` | 否   | —                                    |
| `leftDisabled`     | `boolean` | 否   | —                                    |
| `rightDisabled`    | `boolean` | 否   | —                                    |
| `zIndex`           | `number`  | 否   | —                                    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-navbar/` 为准。

### 导出类型

`MqNavbarProps`、`MqNavbarEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
