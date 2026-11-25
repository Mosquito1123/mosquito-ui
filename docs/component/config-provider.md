<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqConfigProvider `mq-config-provider`

主题与 CSS 变量作用域

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-config-provider>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-config-provider />
```

## API

### Props

| 名称        | 类型                     | 必填 | 说明                                                             |
| ----------- | ------------------------ | ---- | ---------------------------------------------------------------- |
| `theme`     | `MqThemeMode`            | 否   | —                                                                |
| `themeVars` | `Record<string, string>` | 否   | CSS 变量键值。键可省略 `--` 前缀，会自动补上。                   |
| `locale`    | `string`                 | 否   | 全局语言标识，例如 `zh-CN` / `en-US`。变化时切换全部组件的文案。 |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-config-provider/` 为准。

### 导出类型

`MqThemeMode`、`MqConfigProviderProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
