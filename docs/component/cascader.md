<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqCascader `mq-cascader`

级联选择：逐级面板、选中路径 Tab、`check-strictly`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-cascader>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-cascader />
```

## API

### Props

| 名称            | 类型                      | 必填 | 说明                               |
| --------------- | ------------------------- | ---- | ---------------------------------- |
| `modelValue`    | `string \| number`        | 否   | 叶子节点的值。                     |
| `visible`       | `boolean`                 | 否   | —                                  |
| `options`       | `MqCascaderOption[]`      | 否   | —                                  |
| `title`         | `string`                  | 否   | —                                  |
| `cancelText`    | `string`                  | 否   | —                                  |
| `confirmText`   | `string`                  | 否   | —                                  |
| `checkStrictly` | `boolean`                 | 否   | 任意一级都可选，不再强制选到叶子。 |
| `beforeConfirm` | `MqCascaderBeforeConfirm` | 否   | —                                  |
| `maskClosable`  | `boolean`                 | 否   | —                                  |
| `zIndex`        | `number`                  | 否   | —                                  |
| `duration`      | `number`                  | 否   | —                                  |
| `safeArea`      | `boolean`                 | 否   | —                                  |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-cascader/` 为准。

### 导出类型

`MqCascaderBeforeConfirm`、`MqCascaderProps`、`MqCascaderConfirmPayload`、`MqCascaderEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
