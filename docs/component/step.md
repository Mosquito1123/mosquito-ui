<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqStep `mq-step`

面向 uni-app（Vue 3）的轻量组件。

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-step>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-step />
```

## API

### Props

| 名称          | 类型           | 必填 | 说明                                                             |
| ------------- | -------------- | ---- | ---------------------------------------------------------------- |
| `title`       | `string`       | 否   | —                                                                |
| `description` | `string`       | 否   | —                                                                |
| `status`      | `MqStepStatus` | 否   | 不传时按父级 active 推导：之前为完成，当前为进行中，之后为等待。 |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-step/` 为准。

### 导出类型

`MqStepStatus`、`MqStepProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
