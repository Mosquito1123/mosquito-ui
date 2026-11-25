<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqDropMenu `mq-drop-menu`

下拉筛选菜单，支持上下展开、蒙层与自定义选项

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-drop-menu>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-drop-menu />
```

## API

### Props

| 名称                | 类型             | 必填 | 说明                  |
| ------------------- | ---------------- | ---- | --------------------- |
| `zIndex`            | `number`         | 否   | 弹层层级。            |
| `direction`         | `'down' \| 'up'` | 否   | —                     |
| `modal`             | `boolean`        | 否   | 是否显示蒙层。        |
| `closeOnClickModal` | `boolean`        | 否   | —                     |
| `duration`          | `number`         | 否   | 展开 / 收起动画时长。 |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-drop-menu/` 为准。

### 导出类型

`MqDropMenuProps`、`MqDropMenuExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
