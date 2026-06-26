import { jsx } from '@app/html-jsx'
import { createSignal } from 'solid-js'
import { LeadGateScreen } from './LeadGateScreen'
import { LoaderScreen } from './LoaderScreen'
import { PaywallScreen } from './PaywallScreen'
import { QuestionScreen } from './QuestionScreen'
import { ResultScreen } from './ResultScreen'
import { TrustScreen } from './TrustScreen'
import { saveLead } from '../quiz/lead'
import { getResultImages } from '../quiz/resultImages'
import { buildPersonalResult } from '../quiz/result'
import { buildResultInputs, recommendResultPrograms } from '../quiz/programs'
import { quizFlow } from '../quiz/screens'
import {
  calculateProgressPercent,
  canMoveNext,
  createInitialState,
  moveBack,
  moveNext,
  saveAnswer,
} from '../quiz/state'
import type {
  LeadGateAnswer,
  LeadPayload,
  QuizRuntimeState,
  QuizScreen,
  ValidationIssue,
} from '../quiz/types'

function buildResultTitle(template: string | undefined, name: string, currentWeight: number, targetWeight: number): string {
  const base = template ?? '{Имя}, вот ваш план: с {вес} до {целевой вес}'
  return base
    .replace('{Имя}', name || 'Ваш план')
    .replace('{вес}', String(currentWeight))
    .replace('{целевой вес}', String(targetWeight))
}

function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? ''
}

function isLead(value: unknown): value is LeadGateAnswer {
  return typeof value === 'object' && value !== null && 'name' in value && 'email' in value && 'consentAccepted' in value
}

function currentScreen(state: QuizRuntimeState): QuizScreen {
  return quizFlow.screens[state.currentScreenIndex]
}

function getStringAnswer(state: QuizRuntimeState, screenId: string): string | undefined {
  const value = state.answersByScreen[screenId]
  return typeof value === 'string' ? value : undefined
}

function getStringArrayAnswer(state: QuizRuntimeState, screenId: string): string[] | undefined {
  const value = state.answersByScreen[screenId]
  if (!Array.isArray(value)) return undefined
  return value.filter((item): item is string => typeof item === 'string')
}

function readLeadValuesFromDom(): Partial<LeadGateAnswer> {
  if (typeof document === 'undefined') return {}

  const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement | null
  const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement | null
  const consentInput = document.querySelector('#leadConsent') as HTMLInputElement | null

  const next: Partial<LeadGateAnswer> = {}
  if (nameInput) next.name = nameInput.value
  if (emailInput) next.email = emailInput.value
  if (consentInput) next.consentAccepted = consentInput.checked
  return next
}

let loaderAutoTimer: ReturnType<typeof setTimeout> | undefined
let loaderAutoKey: string | undefined

// @shared
export function QuizApp(props: { utm?: Record<string, string> }) {
  const [state, setState] = createSignal<QuizRuntimeState>(createInitialState(props.utm ?? {}))
  const [issues, setIssues] = createSignal<ValidationIssue[]>([])

  const onNext = async () => {
    let runtimeState = state()
    const screen = currentScreen(runtimeState)

    if (screen.kind === 'leadGate') {
      const current = runtimeState.answersByScreen[screen.id]
      const currentLead: LeadGateAnswer = isLead(current)
        ? current
        : { name: '', email: '', consentAccepted: true }

      const domLead = readLeadValuesFromDom()
      const mergedLead: LeadGateAnswer = {
        ...currentLead,
        ...domLead,
      }

      const changed =
        mergedLead.name !== currentLead.name ||
        mergedLead.email !== currentLead.email ||
        mergedLead.consentAccepted !== currentLead.consentAccepted

      if (changed) {
        runtimeState = {
          ...runtimeState,
          answersByScreen: {
            ...runtimeState.answersByScreen,
            [screen.id]: mergedLead,
          },
          updatedAt: new Date().toISOString(),
        }
        setState(runtimeState)
      }
    }

    if (screen.kind === 'leadGate') {
      const leadValue = runtimeState.answersByScreen[screen.id]
      if (isLead(leadValue)) {
        const currentWeight = Number(runtimeState.answersByScreen.current_weight ?? 70)
        const targetWeight = Number(runtimeState.answersByScreen.target_weight ?? currentWeight)
        const height = Number(runtimeState.answersByScreen.height ?? 165)

        const result = buildPersonalResult({
          ageBucket: getStringAnswer(runtimeState, 'age'),
          activity: getStringAnswer(runtimeState, 'activity'),
          currentWeight,
          targetWeight,
          height,
          goalBody: getStringAnswer(runtimeState, 'goal_body'),
          resultFocus: getStringAnswer(runtimeState, 'result_focus'),
          zones: getStringArrayAnswer(runtimeState, 'zones'),
          trainingPlace: getStringAnswer(runtimeState, 'training_place'),
        })

        const payload: LeadPayload = {
          name: leadValue.name,
          email: leadValue.email,
          consentAccepted: leadValue.consentAccepted,
          answersByScreen: runtimeState.answersByScreen,
          height,
          currentWeight,
          targetWeight,
          resultType: result.resultType,
          calorieNorm: result.calorieNorm,
          macros: result.macros,
          utm: runtimeState.utm,
          createdAt: runtimeState.startedAt,
        }

        await saveLead(payload)
      }
    }

    const result = moveNext(quizFlow, runtimeState)
    setState(result.state)
    setIssues(result.issues)
  }

  const onBack = () => {
    const result = moveBack(state())
    setState(result.state)
    setIssues([])
  }

  const onSelectSingle = (option: string) => {
    const screen = currentScreen(state())
    if (screen.kind !== 'single') return

    const saved = saveAnswer(quizFlow, state(), screen.id, option)
    setState(saved.state)
    setIssues(saved.issues)

    if (saved.issues.length === 0) {
      setTimeout(() => {
        const active = currentScreen(state())
        if (active.id !== screen.id) return
        const result = moveNext(quizFlow, state())
        setState(result.state)
        setIssues(result.issues)
      }, 260)
    }
  }

  const onToggleMultiple = (option: string) => {
    const screen = currentScreen(state())
    if (screen.kind !== 'multiple') return

    const current = state().answersByScreen[screen.id]
    const selected = Array.isArray(current) ? [...current] : []
    const hasOption = selected.includes(option)
    const next = hasOption ? selected.filter((item) => item !== option) : [...selected, option]

    const saved = saveAnswer(quizFlow, state(), screen.id, next)
    setState(saved.state)
    setIssues(saved.issues)
  }

  const onInputNumber = (raw: string) => {
    const screen = currentScreen(state())
    if (screen.kind !== 'input') return

    const parsed = Number(raw)
    const nextValue = raw === '' || Number.isNaN(parsed) ? undefined : parsed

    setState({
      ...state(),
      answersByScreen: {
        ...state().answersByScreen,
        [screen.id]: nextValue,
      },
      updatedAt: new Date().toISOString(),
    })

    // Do not block typing with per-keystroke validation.
    // Full validation still runs on "Продолжить".
    setIssues([])
  }

  const updateLead = (partial: Partial<LeadGateAnswer>) => {
    const screen = currentScreen(state())
    if (screen.kind !== 'leadGate') return

    const current = state().answersByScreen[screen.id]
    const lead: LeadGateAnswer = isLead(current)
      ? current
      : { name: '', email: '', consentAccepted: true }

    const nextLead: LeadGateAnswer = {
      ...lead,
      ...partial,
    }

    setState({
      ...state(),
      answersByScreen: {
        ...state().answersByScreen,
        [screen.id]: nextLead,
      },
      updatedAt: new Date().toISOString(),
    })

    setIssues([])
  }

  const goPaywallFromResult = () => {
    const screen = currentScreen(state())
    if (screen.kind !== 'result') return

    const paywallIndex = quizFlow.screens.findIndex((item) => item.kind === 'paywall')
    if (paywallIndex < 0) return

    setState({
      ...state(),
      currentScreenIndex: paywallIndex,
      updatedAt: new Date().toISOString(),
    })
    setIssues([])
  }

  const progressPercent = () => calculateProgressPercent(quizFlow, state())
  const screen = () => currentScreen(state())
  const currentIssues = () => issues().filter((issue) => issue.screenId === screen().id)

  const guardIssues = () => canMoveNext(quizFlow, state())
  const nextBlocked = () => guardIssues().length > 0 && (screen().kind === 'single' || screen().kind === 'multiple' || screen().kind === 'input' || screen().kind === 'leadGate')

  const activeScreen = screen()

  if (activeScreen.kind === 'loader' && activeScreen.steps.length > 0) {
    const currentIndex = state().currentScreenIndex
    const key = `${currentIndex}:${activeScreen.id}`

    if (loaderAutoKey !== key) {
      if (loaderAutoTimer) clearTimeout(loaderAutoTimer)
      loaderAutoKey = key

      loaderAutoTimer = setTimeout(() => {
        const runtime = state()
        const current = currentScreen(runtime)
        if (runtime.currentScreenIndex !== currentIndex) return
        if (current.kind !== 'loader' || current.id !== activeScreen.id) return

        const result = moveNext(quizFlow, runtime)
        setState(result.state)
        setIssues(result.issues)
      }, 4200)
    }
  } else {
    if (loaderAutoTimer) clearTimeout(loaderAutoTimer)
    loaderAutoTimer = undefined
    loaderAutoKey = undefined
  }

  if (activeScreen.kind === 'single' || activeScreen.kind === 'multiple' || activeScreen.kind === 'input') {
    return (
      <QuestionScreen
        screen={activeScreen}
        state={state()}
        progressPercent={progressPercent()}
        issues={currentIssues()}
        legalLinks={quizFlow.legalLinks}
        onSelect={onSelectSingle}
        onToggle={onToggleMultiple}
        onInput={onInputNumber}
        onNext={onNext}
        onBack={onBack}
      />
    )
  }

  if (activeScreen.kind === 'trust' || activeScreen.kind === 'salesTransition') {
    return (
      <TrustScreen
        screen={activeScreen}
        progressPercent={progressPercent()}
        onNext={onNext}
        onBack={onBack}
      />
    )
  }

  if (activeScreen.kind === 'loader') {
    return (
      <LoaderScreen
        screen={activeScreen}
        progressPercent={progressPercent()}
        onNext={onNext}
        onBack={onBack}
      />
    )
  }

  if (activeScreen.kind === 'leadGate') {
    const lead = state().answersByScreen[activeScreen.id]
    const leadValue: LeadGateAnswer = isLead(lead)
      ? lead
      : { name: '', email: '', consentAccepted: true }

    return (
      <LeadGateScreen
        screen={activeScreen}
        value={leadValue}
        legalLinks={quizFlow.legalLinks}
        progressPercent={progressPercent()}
        issues={currentIssues().length > 0 ? currentIssues() : nextBlocked() ? guardIssues() : []}
        onNameInput={(value) => updateLead({ name: value })}
        onEmailInput={(value) => updateLead({ email: value })}
        onConsentToggle={(checked) => updateLead({ consentAccepted: checked })}
        onNext={onNext}
        onBack={onBack}
      />
    )
  }

  if (activeScreen.kind === 'result') {
    const runtimeState = state()
    const lead = state().answersByScreen.lead_gate
    const leadValue: LeadGateAnswer = isLead(lead)
      ? lead
      : { name: '', email: '', consentAccepted: true }

    const currentWeight = Number(runtimeState.answersByScreen.current_weight ?? 70)
    const targetWeight = Number(runtimeState.answersByScreen.target_weight ?? currentWeight)
    const height = Number(runtimeState.answersByScreen.height ?? 165)

    const result = buildPersonalResult({
      ageBucket: getStringAnswer(runtimeState, 'age'),
      activity: getStringAnswer(runtimeState, 'activity'),
      currentWeight,
      targetWeight,
      height,
      goalBody: getStringAnswer(runtimeState, 'goal_body'),
      resultFocus: getStringAnswer(runtimeState, 'result_focus'),
      zones: getStringArrayAnswer(runtimeState, 'zones'),
      trainingPlace: getStringAnswer(runtimeState, 'training_place'),
      experience: getStringAnswer(runtimeState, 'experience'),
    })

    const resultInput = {
      ageBucket: getStringAnswer(runtimeState, 'age'),
      activity: getStringAnswer(runtimeState, 'activity'),
      currentWeight,
      targetWeight,
      height,
      goalBody: getStringAnswer(runtimeState, 'goal_body'),
      resultFocus: getStringAnswer(runtimeState, 'result_focus'),
      zones: getStringArrayAnswer(runtimeState, 'zones'),
      trainingPlace: getStringAnswer(runtimeState, 'training_place'),
      experience: getStringAnswer(runtimeState, 'experience'),
      bestShape: getStringAnswer(runtimeState, 'best_shape'),
    }

    const resultName = getFirstName(leadValue.name)
    const title = buildResultTitle(activeScreen.titleTemplate, resultName, currentWeight, targetWeight)
    const images = getResultImages({
      currentBodyType: getStringAnswer(runtimeState, 'body_now'),
      goalBody: getStringAnswer(runtimeState, 'goal_body'),
      resultFocus: getStringAnswer(runtimeState, 'result_focus'),
      bmi: result.bmi,
    })

    return (
      <ResultScreen
        title={title}
        name={resultName}
        result={result}
        inputs={buildResultInputs(resultInput)}
        programs={recommendResultPrograms(resultInput)}
        currentImage={images.currentImage}
        targetImage={images.targetImage}
        currentWeight={currentWeight}
        targetWeight={targetWeight}
        progressPercent={progressPercent()}
        onOpenPaywall={goPaywallFromResult}
        onBack={onBack}
      />
    )
  }

  if (activeScreen.kind !== 'paywall') {
    return null
  }

  const runtimeState = state()
  const lead = runtimeState.answersByScreen.lead_gate
  const leadValue: LeadGateAnswer = isLead(lead)
    ? lead
    : { name: '', email: '', consentAccepted: true }

  const currentWeight = Number(runtimeState.answersByScreen.current_weight ?? 70)
  const targetWeight = Number(runtimeState.answersByScreen.target_weight ?? currentWeight)
  const height = Number(runtimeState.answersByScreen.height ?? 165)
  const result = buildPersonalResult({
    ageBucket: getStringAnswer(runtimeState, 'age'),
    activity: getStringAnswer(runtimeState, 'activity'),
    currentWeight,
    targetWeight,
    height,
    goalBody: getStringAnswer(runtimeState, 'goal_body'),
    resultFocus: getStringAnswer(runtimeState, 'result_focus'),
    zones: getStringArrayAnswer(runtimeState, 'zones'),
    trainingPlace: getStringAnswer(runtimeState, 'training_place'),
    experience: getStringAnswer(runtimeState, 'experience'),
  })
  const resultInput = {
    ageBucket: getStringAnswer(runtimeState, 'age'),
    activity: getStringAnswer(runtimeState, 'activity'),
    currentWeight,
    targetWeight,
    height,
    goalBody: getStringAnswer(runtimeState, 'goal_body'),
    resultFocus: getStringAnswer(runtimeState, 'result_focus'),
    zones: getStringArrayAnswer(runtimeState, 'zones'),
    trainingPlace: getStringAnswer(runtimeState, 'training_place'),
    experience: getStringAnswer(runtimeState, 'experience'),
    bestShape: getStringAnswer(runtimeState, 'best_shape'),
  }
  const images = getResultImages({
    currentBodyType: getStringAnswer(runtimeState, 'body_now'),
    goalBody: getStringAnswer(runtimeState, 'goal_body'),
    resultFocus: getStringAnswer(runtimeState, 'result_focus'),
    bmi: result.bmi,
  })

  return (
    <PaywallScreen
      screen={activeScreen}
      tariffs={quizFlow.tariffs}
      legalLinks={quizFlow.legalLinks}
      name={getFirstName(leadValue.name)}
      currentWeight={currentWeight}
      targetWeight={targetWeight}
      goal={getStringAnswer(runtimeState, 'result_focus') ?? getStringAnswer(runtimeState, 'goal_body') ?? 'вашу цель'}
      zones={getStringArrayAnswer(runtimeState, 'zones') ?? []}
      trainingPlace={getStringAnswer(runtimeState, 'training_place') ?? 'удобный формат'}
      programs={recommendResultPrograms(resultInput)}
      currentImage={images.currentImage}
      targetImage={images.targetImage}
      progressPercent={progressPercent()}
      onBack={onBack}
    />
  )
}
