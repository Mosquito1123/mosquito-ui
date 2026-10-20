declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '*.scss' {
  const content: string
  export default content
}

declare namespace JSX {
  interface IntrinsicElements {
    view: Record<string, unknown>
    text: Record<string, unknown>
    image: Record<string, unknown>
    'scroll-view': Record<string, unknown>
  }
}
