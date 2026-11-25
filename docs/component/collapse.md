<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqCollapse `mq-collapse`

多选或手风琴。`before-expand` 返回 `false` 时不展开

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-collapse>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-collapse />
```

## API

### Props

| 名称         | 类型              | 必填 | 说明                                                        |
| ------------ | ----------------- | ---- | ----------------------------------------------------------- |
| `modelValue` | `MqCollapseModel` | 否   | —                                                           |
| `accordion`  | `boolean`         | 否   | 为 true 时 `v-model` 是当前打开项的名字，关闭时为空字符串。 |
| `disabled`   | `boolean`         | 否   | —                                                           |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: { value: MqCollapseModel }]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-collapse/` 为准。

### 导出类型

`MqCollapseModel`、`MqCollapseProps`、`MqCollapseEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
