import { saveLead } from './leadStorage'
import { createInitialState, moveBack, moveNext, saveAnswer } from './quizEngine'
import { buildPersonalResult } from './resultLogic'
import { loadQuizFlowConfig } from './screenMap'
import { renderScreen } from './screenRenderer'
import { toChatiumAdapterPayload } from './uiAdapter'
import type {
  LeadGateAnswer,
  LeadPayload,
  NavigationResult,
  QuizFlowConfig,
  QuizRuntimeState,
  QuizScreen,
  SaveAnswerResult,
  ValidationIssue,
} from './types'
import type { ChatiumAdapterPayload, RenderedScreenModel } from './uiAdapter'

function buildInputIssue(screenId: string, message: string): ValidationIssue {
  return { screenId, field: 'value', message }
}

function getCurrentScreen(config: QuizFlowConfig, state: QuizRuntimeState): QuizScreen {
  return config.screens[state.currentScreenIndex]
}

export class QuizScenarioController {
  readonly config: QuizFlowConfig

  private state: QuizRuntimeState
  private issues: ValidationIssue[]

  constructor(utm: Record<string, string> = {}) {
    this.config = loadQuizFlowConfig()
    this.state = createInitialState(utm)
    this.issues = []
  }

  getState(): QuizRuntimeState {
    return this.state
  }

  getIssues(): ValidationIssue[] {
    return this.issues
  }

  startQuiz(): RenderedScreenModel {
    this.state = createInitialState(this.state.utm)
    this.issues = []
    return this.renderCurrentScreen()
  }

  renderCurrentScreen(): RenderedScreenModel {
    return renderScreen(this.config, this.state, this.issues)
  }

  renderCurrentScreenForChatium(): ChatiumAdapterPayload {
    const model = this.renderCurrentScreen()
    return toChatiumAdapterPayload(model)
  }

  handleOptionClick(option: string): SaveAnswerResult {
    const screen = getCurrentScreen(this.config, this.state)

    if (screen.kind === 'single') {
      const result = saveAnswer(this.config, this.state, screen.id, option)
      this.applySaveResult(result)
      return result
    }

    if (screen.kind === 'multiple') {
      const current = this.state.answersByScreen[screen.id]
      const selected = Array.isArray(current) ? [...current] : []
      const hasOption = selected.includes(option)
      const next = hasOption ? selected.filter((item) => item !== option) : [...selected, option]

      const result = saveAnswer(this.config, this.state, screen.id, next)
      this.applySaveResult(result)
      return result
    }

    const fail: SaveAnswerResult = {
      state: this.state,
      saved: false,
      issues: [buildInputIssue(screen.id, 'Этот экран не поддерживает выбор варианта.')],
    }
    this.issues = fail.issues
    return fail
  }

  handleNumberInput(value: number): SaveAnswerResult {
    const screen = getCurrentScreen(this.config, this.state)
    if (screen.kind !== 'input') {
      const fail: SaveAnswerResult = {
        state: this.state,
        saved: false,
        issues: [buildInputIssue(screen.id, 'Текущий экран не поддерживает числовой ввод.')],
      }
      this.issues = fail.issues
      return fail
    }

    const result = saveAnswer(this.config, this.state, screen.id, value)
    this.applySaveResult(result)
    return result
  }

  handleLeadGateNameInput(value: string): SaveAnswerResult {
    return this.updateLeadGateField({ name: value })
  }

  handleLeadGateEmailInput(value: string): SaveAnswerResult {
    return this.updateLeadGateField({ email: value })
  }

  handleConsentToggle(checked: boolean): SaveAnswerResult {
    return this.updateLeadGateField({ consentAccepted: checked })
  }

  goNext(): NavigationResult {
    const nextResult = moveNext(this.config, this.state)
    this.state = nextResult.state
    this.issues = nextResult.issues
    return nextResult
  }

  goBack(): NavigationResult {
    const backResult = moveBack(this.config, this.state)
    this.state = backResult.state
    this.issues = []
    return backResult
  }

  async completeLeadGateAndPersistLead(): Promise<void> {
    const currentScreen = getCurrentScreen(this.config, this.state)
    if (currentScreen.kind !== 'leadGate') return

    const leadValue = this.state.answersByScreen[currentScreen.id]
    if (!(typeof leadValue === 'object' && leadValue !== null && 'name' in leadValue && 'email' in leadValue && 'consentAccepted' in leadValue)) {
      return
    }

    const currentWeight = Number(this.state.answersByScreen.current_weight ?? 70)
    const targetWeight = Number(this.state.answersByScreen.target_weight ?? currentWeight)
    const height = Number(this.state.answersByScreen.height ?? 165)

    const result = buildPersonalResult({
      ageBucket: typeof this.state.answersByScreen.age === 'string' ? this.state.answersByScreen.age : undefined,
      activity: typeof this.state.answersByScreen.activity === 'string' ? this.state.answersByScreen.activity : undefined,
      currentWeight,
      targetWeight,
      height,
      goalBody: typeof this.state.answersByScreen.goal_body === 'string' ? this.state.answersByScreen.goal_body : undefined,
      resultFocus: typeof this.state.answersByScreen.result_focus === 'string' ? this.state.answersByScreen.result_focus : undefined,
      zones: Array.isArray(this.state.answersByScreen.zones) ? (this.state.answersByScreen.zones as string[]) : undefined,
      trainingPlace: typeof this.state.answersByScreen.training_place === 'string' ? this.state.answersByScreen.training_place : undefined,
    })

    const leadPayload: LeadPayload = {
      name: (leadValue as LeadGateAnswer).name,
      email: (leadValue as LeadGateAnswer).email,
      consentAccepted: (leadValue as LeadGateAnswer).consentAccepted,
      answersByScreen: this.state.answersByScreen,
      height,
      currentWeight,
      targetWeight,
      resultType: result.resultType,
      calorieNorm: result.calorieNorm,
      macros: result.macros,
      utm: this.state.utm,
      createdAt: this.state.startedAt,
    }

    await saveLead(leadPayload)
  }

  async runFullFlowDemo(demoAnswersByScreen: Record<string, string | string[] | number | LeadGateAnswer>): Promise<RenderedScreenModel[]> {
    const snapshots: RenderedScreenModel[] = []

    snapshots.push(this.startQuiz())

    for (const screen of this.config.screens) {
      const answer = demoAnswersByScreen[screen.id]

      if (screen.kind === 'single' && typeof answer === 'string') {
        this.handleOptionClick(answer)
      }

      if (screen.kind === 'multiple' && Array.isArray(answer)) {
        for (const option of answer) {
          this.handleOptionClick(option)
        }
      }

      if (screen.kind === 'input' && typeof answer === 'number') {
        this.handleNumberInput(answer)
      }

      if (screen.kind === 'leadGate' && typeof answer === 'object' && answer !== null) {
        const lead = answer as LeadGateAnswer
        this.handleLeadGateNameInput(lead.name)
        this.handleLeadGateEmailInput(lead.email)
        this.handleConsentToggle(lead.consentAccepted)
        await this.completeLeadGateAndPersistLead()
      }

      this.goNext()
      snapshots.push(this.renderCurrentScreen())
    }

    return snapshots
  }

  private updateLeadGateField(partial: Partial<LeadGateAnswer>): SaveAnswerResult {
    const screen = getCurrentScreen(this.config, this.state)
    if (screen.kind !== 'leadGate') {
      const fail: SaveAnswerResult = {
        state: this.state,
        saved: false,
        issues: [buildInputIssue(screen.id, 'Поля имени, почты и согласия доступны только на лид-гейте.')],
      }
      this.issues = fail.issues
      return fail
    }

    const current = this.state.answersByScreen[screen.id]
    const lead: LeadGateAnswer =
      typeof current === 'object' && current !== null && 'name' in current && 'email' in current && 'consentAccepted' in current
        ? (current as LeadGateAnswer)
        : { name: '', email: '', consentAccepted: true }

    const nextLead: LeadGateAnswer = {
      ...lead,
      ...partial,
    }

    // Lead-gate fields are updated progressively. Full validation is enforced on "next".
    const nextState: QuizRuntimeState = {
      ...this.state,
      answersByScreen: {
        ...this.state.answersByScreen,
        [screen.id]: nextLead,
      },
      updatedAt: new Date().toISOString(),
    }

    const result: SaveAnswerResult = {
      state: nextState,
      saved: true,
      issues: [],
    }

    this.applySaveResult(result)
    return result
  }

  private applySaveResult(result: SaveAnswerResult): void {
    this.state = result.state
    this.issues = result.issues
  }
}
