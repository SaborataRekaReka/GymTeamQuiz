import type {
  LeadGateAnswer,
  NavigationResult,
  QuizAnswerValue,
  QuizFlowConfig,
  QuizRuntimeState,
  QuizScreen,
  SaveAnswerResult,
  ValidationIssue,
} from './types'

function nowIso(): string {
  return new Date().toISOString()
}

function buildIssue(screenId: string, field: string, message: string): ValidationIssue {
  return { screenId, field, message }
}

function uniqueCompleted(ids: string[], nextId: string): string[] {
  return ids.includes(nextId) ? ids : [...ids, nextId]
}

function isLeadGateAnswer(value: QuizAnswerValue): value is LeadGateAnswer {
  return typeof value === 'object' && value !== null && 'name' in value && 'email' in value && 'consentAccepted' in value
}

function validateSingle(screen: QuizScreen, value: QuizAnswerValue): ValidationIssue[] {
  if (screen.kind !== 'single') return []
  if (typeof value !== 'string' || !value.trim()) {
    return [buildIssue(screen.id, 'value', 'Выберите один вариант.')]
  }
  if (!screen.options.includes(value)) {
    return [buildIssue(screen.id, 'value', 'Выбран неизвестный вариант ответа.')]
  }
  return []
}

function validateMultiple(screen: QuizScreen, value: QuizAnswerValue): ValidationIssue[] {
  if (screen.kind !== 'multiple') return []
  if (!Array.isArray(value) || value.length === 0) {
    return [buildIssue(screen.id, 'value', 'Выберите хотя бы один вариант.')]
  }
  const hasUnknown = value.some((entry) => typeof entry !== 'string' || !screen.options.includes(entry))
  if (hasUnknown) {
    return [buildIssue(screen.id, 'value', 'Найден неизвестный вариант ответа.')]
  }
  return []
}

function validateInput(screen: QuizScreen, value: QuizAnswerValue): ValidationIssue[] {
  if (screen.kind !== 'input') return []
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return [buildIssue(screen.id, 'value', 'Введите корректное числовое значение.')]
  }
  if (screen.min !== undefined && value < screen.min) {
    return [buildIssue(screen.id, 'value', `Значение должно быть не меньше ${screen.min}.`)]
  }
  if (screen.max !== undefined && value > screen.max) {
    return [buildIssue(screen.id, 'value', `Значение должно быть не больше ${screen.max}.`)]
  }
  return []
}

function validateLeadGate(screen: QuizScreen, value: QuizAnswerValue): ValidationIssue[] {
  if (screen.kind !== 'leadGate') return []
  if (!isLeadGateAnswer(value)) {
    return [buildIssue(screen.id, 'lead_gate', 'Заполните имя, почту и согласие на обработку данных.')]
  }

  const issues: ValidationIssue[] = []
  const name = value.name.trim()
  const email = value.email.trim()

  if (!name) {
    issues.push(buildIssue(screen.id, 'name', 'Введите ваше имя.'))
  }
  if (!email) {
    issues.push(buildIssue(screen.id, 'email', 'Введите вашу почту.'))
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    issues.push(buildIssue(screen.id, 'email', 'Введите почту в корректном формате.'))
  }
  if (screen.consentRequired && !value.consentAccepted) {
    issues.push(buildIssue(screen.id, 'consentAccepted', 'Подтвердите согласие на обработку персональных данных.'))
  }

  return issues
}

export function createInitialState(utm: Record<string, string> = {}): QuizRuntimeState {
  const created = nowIso()
  return {
    currentScreenIndex: 0,
    answersByScreen: {},
    completedScreenIds: [],
    startedAt: created,
    updatedAt: created,
    utm,
  }
}

export function getCurrentScreen(config: QuizFlowConfig, state: QuizRuntimeState): QuizScreen {
  return config.screens[state.currentScreenIndex] ?? config.screens[0]
}

export function getScreenById(config: QuizFlowConfig, screenId: string): QuizScreen | undefined {
  return config.screens.find((screen) => screen.id === screenId)
}

export function validateRequiredForScreen(screen: QuizScreen, value: QuizAnswerValue | undefined): ValidationIssue[] {
  if (!screen.required) return []
  if (value === undefined) {
    return [buildIssue(screen.id, 'value', 'Поле обязательно для заполнения.')]
  }

  const validators = [validateSingle(screen, value), validateMultiple(screen, value), validateInput(screen, value), validateLeadGate(screen, value)]
  return validators.flat()
}

export function validateRequiredState(config: QuizFlowConfig, state: QuizRuntimeState): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  for (const screen of config.screens) {
    const value = state.answersByScreen[screen.id]
    issues.push(...validateRequiredForScreen(screen, value))
  }
  return issues
}

export function saveAnswer(
  config: QuizFlowConfig,
  state: QuizRuntimeState,
  screenId: string,
  value: QuizAnswerValue,
): SaveAnswerResult {
  const screen = getScreenById(config, screenId)
  if (!screen) {
    return {
      state,
      saved: false,
      issues: [buildIssue(screenId, 'screen', 'Экран не найден в конфигурации.')],
    }
  }

  const issues = validateRequiredForScreen(screen, value)
  if (issues.length > 0) {
    return { state, saved: false, issues }
  }

  const updated: QuizRuntimeState = {
    ...state,
    answersByScreen: {
      ...state.answersByScreen,
      [screenId]: value,
    },
    completedScreenIds: uniqueCompleted(state.completedScreenIds, screenId),
    updatedAt: nowIso(),
  }

  return {
    state: updated,
    saved: true,
    issues: [],
  }
}

export function canMoveNext(config: QuizFlowConfig, state: QuizRuntimeState): ValidationIssue[] {
  const screen = getCurrentScreen(config, state)
  const value = state.answersByScreen[screen.id]
  return validateRequiredForScreen(screen, value)
}

export function moveNext(config: QuizFlowConfig, state: QuizRuntimeState): NavigationResult {
  const issues = canMoveNext(config, state)
  if (issues.length > 0) {
    return {
      state,
      moved: false,
      issues,
    }
  }

  const nextIndex = Math.min(state.currentScreenIndex + 1, config.screens.length - 1)
  const nextState: QuizRuntimeState = {
    ...state,
    currentScreenIndex: nextIndex,
    updatedAt: nowIso(),
  }

  return {
    state: nextState,
    moved: nextIndex !== state.currentScreenIndex,
    issues: [],
  }
}

export function moveBack(state: QuizRuntimeState): NavigationResult {
  const previousIndex = Math.max(state.currentScreenIndex - 1, 0)
  const nextState: QuizRuntimeState = {
    ...state,
    currentScreenIndex: previousIndex,
    updatedAt: nowIso(),
  }

  return {
    state: nextState,
    moved: previousIndex !== state.currentScreenIndex,
    issues: [],
  }
}

export function calculateProgressPercent(config: QuizFlowConfig, state: QuizRuntimeState): number {
  if (config.screens.length === 0) return 0
  const progress = ((state.currentScreenIndex + 1) / config.screens.length) * 100
  return Math.max(0, Math.min(100, Math.round(progress)))
}
