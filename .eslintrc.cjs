module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    // easycom 依赖 kebab-case 组件名，PascalCase 约束不适用于本项目。
    'vue/component-definition-name-casing': 'off',
    'vue/attributes-order': 'off',
    // uni-app 原生组件（slider 等）的属性是驼峰形式。
    'vue/attribute-hyphenation': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-undef': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
    'unpackage/',
    '*.uvue',
    'pnpm-lock.yaml',
    'docs/.vitepress/cache/',
    'docs/.vitepress/dist/',
  ],
}
