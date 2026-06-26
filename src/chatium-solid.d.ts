declare module '@app/html-jsx' {
  export const jsx: (...args: unknown[]) => unknown
  export function createSolidComponent<TProps extends Record<string, unknown>>(
    component: (props: TProps) => unknown,
  ): (props: TProps) => unknown
}

declare module 'solid-js' {
  export type Accessor<T> = () => T
  export type Setter<T> = (next: T | ((prev: T) => T)) => void

  export function createSignal<T>(value: T): [Accessor<T>, Setter<T>]
}

declare const app: {
  html: (node: unknown) => unknown
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: unknown
  }
}
