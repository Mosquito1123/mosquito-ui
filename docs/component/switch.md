<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqSwitch `mq-switch`

`v-model`，可换开关值、颜色和尺寸。`before-change` 返回 `false` 时不切换

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-switch>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-switch />
```

## API

### Props

| 名称            | 类型                   | 必填 | 说明                              |
| --------------- | ---------------------- | ---- | --------------------------------- |
| `modelValue`    | `MqOptionValue`        | 否   | —                                 |
| `disabled`      | `boolean`              | 否   | —                                 |
| `loading`       | `boolean`              | 否   | —                                 |
| `activeValue`   | `MqOptionValue`        | 否   | 打开时写入的值。默认 `true`。     |
| `inactiveValue` | `MqOptionValue`        | 否   | 关闭时写入的值。默认 `false`。    |
| `activeColor`   | `string`               | 否   | —                                 |
| `inactiveColor` | `string`               | 否   | —                                 |
| `activeText`    | `string`               | 否   | —                                 |
| `inactiveText`  | `string`               | 否   | —                                 |
| `size`          | `string \| number`     | 否   | 高度。数字按 px，宽度按高度推算。 |
| `shape`         | `MqSwitchShape`        | 否   | —                                 |
| `beforeChange`  | `MqSwitchBeforeChange` | 否   | 返回 `false` 或抛错时不切换。     |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: { value: MqOptionValue }]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-switch/` 为准。

### 导出类型

`MqSwitchShape`、`MqSwitchBeforeChange`、`MqSwitchProps`、`MqSwitchEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
