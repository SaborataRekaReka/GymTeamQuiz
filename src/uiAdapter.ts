import type { TariffConfig } from './types'

export type UiNode =
  | UiTextNode
  | UiProgressNode
  | UiOptionsNode
  | UiInputNode
  | UiCheckboxNode
  | UiButtonNode
  | UiListNode
  | UiTariffListNode
  | UiEmbedPlaceholderNode

export interface UiTextNode {
  type: 'text'
  role: 'title' | 'subtitle' | 'body' | 'error' | 'caption'
  text: string
}

export interface UiProgressNode {
  type: 'progress'
  percent: number
}

export interface UiOptionsNode {
  type: 'options'
  selection: 'single' | 'multiple'
  options: Array<{
    label: string
    selected: boolean
    action: UiActionDescriptor
  }>
}

export interface UiInputNode {
  type: 'input'
  inputType: 'number' | 'text' | 'email'
  value: string
  placeholder?: string
  unit?: string
  action: UiActionDescriptor
}

export interface UiCheckboxNode {
  type: 'checkbox'
  label: string
  checked: boolean
  action: UiActionDescriptor
}

export interface UiButtonNode {
  type: 'button'
  label: string
  disabled?: boolean
  action: UiActionDescriptor
}

export interface UiListNode {
  type: 'list'
  title?: string
  items: string[]
}

export interface UiTariffListNode {
  type: 'tariffs'
  items: TariffConfig[]
}

export interface UiEmbedPlaceholderNode {
  type: 'embedPlaceholder'
  text: string
}

export interface UiActionDescriptor {
  id: string
  type:
    | 'selectOption'
    | 'toggleOption'
    | 'input'
    | 'toggleConsent'
    | 'next'
    | 'back'
    | 'openPaywall'
    | 'noop'
  payload?: Record<string, string | number | boolean>
}

export interface RenderedScreenModel {
  screenId: string
  screenOrder: number
  progressPercent: number
  nodes: UiNode[]
}

export interface ChatiumAdapterPayload {
  type: 'chatium_screen_payload'
  screenId: string
  blocks: unknown[]
}

export function toChatiumAdapterPayload(model: RenderedScreenModel): ChatiumAdapterPayload {
  // TODO: Chatium integration. Replace neutral UiNode mapping with Chatium AppUI components.
  // Suggested mapping:
  // UiTextNode -> AppUI.Text
  // UiProgressNode -> AppUI.Progress
  // UiOptionsNode -> AppUI.Card list with tap handlers
  // UiInputNode -> AppUI.Input
  // UiCheckboxNode -> AppUI.Checkbox
  // UiButtonNode -> AppUI.Button
  // UiListNode -> AppUI.List
  // UiTariffListNode -> AppUI.Cards
  // UiEmbedPlaceholderNode -> AppUI.Html/Embed for GetCourse widget
  const blocks = model.nodes.map((node) => ({
    component: node.type,
    props: node,
  }))

  return {
    type: 'chatium_screen_payload',
    screenId: model.screenId,
    blocks,
  }
}
