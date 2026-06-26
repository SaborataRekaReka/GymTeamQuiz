<template>
  <QuestionScreen
    v-if="screen.kind === 'single' || screen.kind === 'multiple' || screen.kind === 'input'"
    :screen="screen"
    :selected-single="selectedSingle"
    :selected-multiple="selectedMultiple"
    :input-value="inputValue"
    :answers-by-screen="state.answersByScreen"
    :progress-percent="progressPercent"
    :issues="currentIssues"
    :legal-links="quizFlow.legalLinks"
    :on-select="onSelectSingle"
    :on-toggle="onToggleMultiple"
    :on-input="onInputNumber"
    :on-next="onNext"
    :on-back="onBack"
  />

  <TrustScreen
    v-else-if="screen.kind === 'trust' || screen.kind === 'salesTransition'"
    :title="screen.title"
    :text="trustText"
    :benefits="trustBenefits"
    :media-src="trustMediaSrc"
    :media-video-src="trustVideoSrc"
    :before-after="trustBeforeAfter"
    :button-text="trustButtonText"
    :research-slides="researchSlides"
    :progress-percent="progressPercent"
    :on-next="onNext"
    :on-back="onBack"
  />

  <LoaderScreen
    v-else-if="screen.kind === 'loader'"
    :title="screen.title"
    :text="loaderText"
    :steps="loaderSteps"
    :button-text="loaderButtonText"
    :progress-percent="progressPercent"
    :on-next="onNext"
    :on-back="onBack"
  />

  <LeadGateScreen
    v-else-if="screen.kind === 'leadGate'"
    :title="screen.title"
    :text="leadGateText"
    :value="leadValue"
    :legal-links="quizFlow.legalLinks"
    :progress-percent="progressPercent"
    :issues="leadGateIssues"
    :on-name-input="(v: string) => updateLead({ name: v })"
    :on-email-input="(v: string) => updateLead({ email: v })"
    :on-consent-toggle="(c: boolean) => updateLead({ consentAccepted: c })"
    :on-next="onNext"
    :on-back="onBack"
  />

  <ResultScreen
    v-else-if="screen.kind === 'result'"
    :title="resultData.title"
    :name="resultData.name"
    :current-image="resultData.currentImage"
    :target-image="resultData.targetImage"
    :current-weight="resultData.currentWeight"
    :target-weight="resultData.targetWeight"
    :weight-diff="resultData.weightDiff"
    :weight-loss="resultData.weightLoss"
    :inputs="resultData.inputs"
    :calorie-norm="resultData.calorieNorm"
    :protein="resultData.protein"
    :fat="resultData.fat"
    :carbs="resultData.carbs"
    :bmi="resultData.bmi"
    :bmi-label="resultData.bmiLabel"
    :programs="resultData.programs"
    :progress-percent="progressPercent"
    :on-open-paywall="goPaywallFromResult"
    :on-back="onBack"
  />

  <PaywallScreen
    v-else-if="screen.kind === 'paywall'"
    :screen="screen"
    :tariffs="quizFlow.tariffs"
    :legal-links="quizFlow.legalLinks"
    :name="paywallData.name"
    :current-weight="paywallData.currentWeight"
    :target-weight="paywallData.targetWeight"
    :goal="paywallData.goal"
    :zones="paywallData.zones"
    :training-place="paywallData.trainingPlace"
    :programs="paywallData.programs"
    :current-image="paywallData.currentImage"
    :target-image="paywallData.targetImage"
    :required-blocks="screen.requiredBlocks"
    :progress-percent="progressPercent"
    :on-back="onBack"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import QuestionScreen from '../components/QuestionScreen.vue'
import TrustScreen from '../components/TrustScreen.vue'
import LoaderScreen from '../components/LoaderScreen.vue'
import LeadGateScreen from '../components/LeadGateScreen.vue'
import ResultScreen from '../components/ResultScreen.vue'
import PaywallScreen from '../components/PaywallScreen.vue'

import { quizFlow } from '../../src/quiz/screens'
import {
  calculateProgressPercent,
  canMoveNext,
  createInitialState,
  moveBack,
  moveNext,
  saveAnswer,
} from '../../src/quiz/state'
import { buildPersonalResult } from '../../src/quiz/result'
import { buildResultInputs, recommendResultPrograms } from '../../src/quiz/programs'
import { getResultImages } from '../../src/quiz/resultImages'
import type {
  LeadGateAnswer,
  QuizRuntimeState,
  QuizScreen,
  ValidationIssue,
} from '../../src/quiz/types'

import { resolveUtm } from '../shared/utm'
import { clearQuizState, getOrCreateSessionId, loadQuizState, saveQuizState } from '../shared/quizPersist'
import { upsertLead } from '../shared/saveLead'

/* ---- Презентационные метаданные экранов доверия (как в src/components/TrustScreen.tsx) ---- */
const TRUST_MEDIA_BY_ID: Record<string, string> = {
  trust_580k: '/assets/quiz/realistic woman scene/womans.webp',
  nutrition_assistant: '/assets/quiz/trust/nutrition-assistant-transition.webp',
}
const TRUST_VIDEO_BY_ID: Record<string, string> = {
  trust_soft_training: '/assets/quiz/trust/trust-soft-training.mp4',
}
const BEFORE_AFTER_BY_ID: Record<string, { before: string; after: string }> = {
  final_loader: {
    before: '/assets/quiz/before/current_02_soft.png.png',
    after: '/assets/quiz/before/target_02_toned_fit.png.png',
  },
}
const RESEARCH_SLIDES_BY_ID: Record<string, Array<{ text: string; source: string }>> = {
  research_trust: [
    {
      text: 'Регулярная ходьба и щадящие тренировки помогают сбросить часть веса за несколько недель и заметно прибавляют энергии.',
      source: 'Журнал Американской медицинской ассоциации, 2019',
    },
    {
      text: 'Умеренная регулярная физическая активность связана с ростом чувства энергии и снижением усталости по данным мета-анализа.',
      source: 'Психологический бюллетень, 2006',
    },
    {
      text: 'Самоконтроль питания и привычек улучшает удержание результата по весу и делает программу более устойчивой в реальной жизни.',
      source: 'Журнал Американской диетологической ассоциации, 2011',
    },
  ],
}

/* ---- Состояние ---- */
const sessionId = getOrCreateSessionId()
const utm = resolveUtm() as Record<string, string>
const state = ref<QuizRuntimeState>(loadQuizState() ?? createInitialState(utm))
const issues = ref<ValidationIssue[]>([])

/* Сохраняем прогресс локально при любом изменении. */
watch(
  state,
  (value) => saveQuizState(value),
  { deep: true },
)

function isLead(value: unknown): value is LeadGateAnswer {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'email' in value &&
    'consentAccepted' in value
  )
}

function getStringAnswer(runtime: QuizRuntimeState, screenId: string): string | undefined {
  const value = runtime.answersByScreen[screenId]
  return typeof value === 'string' ? value : undefined
}
function getStringArrayAnswer(runtime: QuizRuntimeState, screenId: string): string[] | undefined {
  const value = runtime.answersByScreen[screenId]
  if (!Array.isArray(value)) return undefined
  return value.filter((item): item is string => typeof item === 'string')
}
function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? ''
}
function buildResultTitle(template: string | undefined, name: string, currentWeight: number, targetWeight: number): string {
  const base = template ?? '{Имя}, вот ваш план: с {вес} до {целевой вес}'
  return base
    .replace('{Имя}', name || 'Ваш план')
    .replace('{вес}', String(currentWeight))
    .replace('{целевой вес}', String(targetWeight))
}

const screen = computed<QuizScreen>(() => quizFlow.screens[state.value.currentScreenIndex])
const progressPercent = computed(() => calculateProgressPercent(quizFlow, state.value))
const currentIssues = computed(() => issues.value.filter((issue) => issue.screenId === screen.value.id))

const guardIssues = computed(() => canMoveNext(quizFlow, state.value))
const nextBlocked = computed(
  () =>
    guardIssues.value.length > 0 &&
    (screen.value.kind === 'single' ||
      screen.value.kind === 'multiple' ||
      screen.value.kind === 'input' ||
      screen.value.kind === 'leadGate'),
)

/* ---- Селекторы значений для текущего экрана ---- */
const selectedSingle = computed(() => {
  const value = state.value.answersByScreen[screen.value.id]
  return typeof value === 'string' ? value : undefined
})
const selectedMultiple = computed(() => {
  const value = state.value.answersByScreen[screen.value.id]
  return Array.isArray(value) ? (value as string[]) : []
})
const inputValue = computed(() => {
  const value = state.value.answersByScreen[screen.value.id]
  return typeof value === 'number' ? String(value) : ''
})

/* ---- Trust / Loader ---- */
const trustText = computed(() =>
  screen.value.kind === 'trust' || screen.value.kind === 'salesTransition' ? screen.value.text : undefined,
)
const trustBenefits = computed(() => (screen.value.kind === 'salesTransition' ? screen.value.benefits : []))
const trustMediaSrc = computed(() => TRUST_MEDIA_BY_ID[screen.value.id])
const trustVideoSrc = computed(() => TRUST_VIDEO_BY_ID[screen.value.id])
const trustBeforeAfter = computed(() => BEFORE_AFTER_BY_ID[screen.value.id])
const trustButtonText = computed(() =>
  screen.value.kind === 'trust' || screen.value.kind === 'salesTransition' ? screen.value.buttonText : undefined,
)
const researchSlides = computed(() => RESEARCH_SLIDES_BY_ID[screen.value.id])

const loaderText = computed(() => (screen.value.kind === 'loader' ? screen.value.text : undefined))
const loaderSteps = computed(() => (screen.value.kind === 'loader' ? screen.value.steps : []))
const loaderButtonText = computed(() => (screen.value.kind === 'loader' ? screen.value.buttonText : undefined))

/* ---- Lead gate ---- */
const leadGateText = computed(() => (screen.value.kind === 'leadGate' ? screen.value.text : undefined))
const leadValue = computed<LeadGateAnswer>(() => {
  const lead = state.value.answersByScreen[screen.value.id]
  return isLead(lead) ? lead : { name: '', email: '', consentAccepted: true }
})
const leadGateIssues = computed(() =>
  currentIssues.value.length > 0 ? currentIssues.value : nextBlocked.value ? guardIssues.value : [],
)

/* ---- Результат ---- */
function buildResultInput(runtime: QuizRuntimeState) {
  const currentWeight = Number(runtime.answersByScreen.current_weight ?? 70)
  const targetWeight = Number(runtime.answersByScreen.target_weight ?? currentWeight)
  const height = Number(runtime.answersByScreen.height ?? 165)
  return {
    ageBucket: getStringAnswer(runtime, 'age'),
    activity: getStringAnswer(runtime, 'activity'),
    currentWeight,
    targetWeight,
    height,
    goalBody: getStringAnswer(runtime, 'goal_body'),
    resultFocus: getStringAnswer(runtime, 'result_focus'),
    zones: getStringArrayAnswer(runtime, 'zones'),
    trainingPlace: getStringAnswer(runtime, 'training_place'),
    experience: getStringAnswer(runtime, 'experience'),
    bestShape: getStringAnswer(runtime, 'best_shape'),
  }
}

const resultData = computed(() => {
  const runtime = state.value
  const lead = runtime.answersByScreen.lead_gate
  const leadObj: LeadGateAnswer = isLead(lead) ? lead : { name: '', email: '', consentAccepted: true }

  const input = buildResultInput(runtime)
  const result = buildPersonalResult(input)
  const name = getFirstName(leadObj.name)
  const titleTemplate = screen.value.kind === 'result' ? screen.value.titleTemplate : undefined
  const title = buildResultTitle(titleTemplate, name, input.currentWeight, input.targetWeight)
  const images = getResultImages({
    currentBodyType: getStringAnswer(runtime, 'body_now'),
    goalBody: getStringAnswer(runtime, 'goal_body'),
    resultFocus: getStringAnswer(runtime, 'result_focus'),
    bmi: result.bmi,
  })

  return {
    title,
    name,
    currentWeight: input.currentWeight,
    targetWeight: input.targetWeight,
    weightDiff: Math.abs(result.weightDifferenceKg),
    weightLoss: result.weightDifferenceKg > 0,
    inputs: buildResultInputs(input),
    calorieNorm: result.calorieNorm,
    protein: result.macros.proteinGrams,
    fat: result.macros.fatGrams,
    carbs: result.macros.carbsGrams,
    bmi: result.bmi,
    bmiLabel: result.bmiLabel,
    programs: recommendResultPrograms(input),
    currentImage: images.currentImage,
    targetImage: images.targetImage,
  }
})

/* ---- Пейволл ---- */
const paywallData = computed(() => {
  const runtime = state.value
  const lead = runtime.answersByScreen.lead_gate
  const leadObj: LeadGateAnswer = isLead(lead) ? lead : { name: '', email: '', consentAccepted: true }

  const input = buildResultInput(runtime)
  const result = buildPersonalResult(input)
  const images = getResultImages({
    currentBodyType: getStringAnswer(runtime, 'body_now'),
    goalBody: getStringAnswer(runtime, 'goal_body'),
    resultFocus: getStringAnswer(runtime, 'result_focus'),
    bmi: result.bmi,
  })

  return {
    name: getFirstName(leadObj.name),
    currentWeight: input.currentWeight,
    targetWeight: input.targetWeight,
    goal: getStringAnswer(runtime, 'result_focus') ?? getStringAnswer(runtime, 'goal_body') ?? 'вашу цель',
    zones: getStringArrayAnswer(runtime, 'zones') ?? [],
    trainingPlace: getStringAnswer(runtime, 'training_place') ?? 'удобный формат',
    programs: recommendResultPrograms(input),
    currentImage: images.currentImage,
    targetImage: images.targetImage,
  }
})

/* ---- Сохранение лида в Chatium ---- */
async function persistLead(status: 'draft' | 'completed') {
  const runtime = state.value
  const lead = runtime.answersByScreen.lead_gate
  if (!isLead(lead)) return

  const input = buildResultInput(runtime)
  const result = buildPersonalResult(input)

  await upsertLead({
    sessionId,
    name: lead.name,
    email: lead.email,
    consentAccepted: lead.consentAccepted,
    answers: runtime.answersByScreen,
    height: input.height,
    currentWeight: input.currentWeight,
    targetWeight: input.targetWeight,
    resultType: result.resultType,
    calorieNorm: result.calorieNorm,
    macros: result.macros,
    utm: runtime.utm,
    status,
  })
}

/* ---- Действия ---- */
async function onNext() {
  const runtimeScreen = screen.value

  if (runtimeScreen.kind === 'leadGate') {
    const guard = canMoveNext(quizFlow, state.value)
    if (guard.length > 0) {
      issues.value = guard
      return
    }
    await persistLead('completed')
  }

  const result = moveNext(quizFlow, state.value)
  state.value = result.state
  issues.value = result.issues
}

function onBack() {
  const result = moveBack(state.value)
  state.value = result.state
  issues.value = []
}

function onSelectSingle(option: string) {
  const runtimeScreen = screen.value
  if (runtimeScreen.kind !== 'single') return

  const saved = saveAnswer(quizFlow, state.value, runtimeScreen.id, option)
  state.value = saved.state
  issues.value = saved.issues

  if (saved.issues.length === 0) {
    setTimeout(() => {
      if (screen.value.id !== runtimeScreen.id) return
      const result = moveNext(quizFlow, state.value)
      state.value = result.state
      issues.value = result.issues
    }, 260)
  }
}

function onToggleMultiple(option: string) {
  const runtimeScreen = screen.value
  if (runtimeScreen.kind !== 'multiple') return

  const current = state.value.answersByScreen[runtimeScreen.id]
  const selected = Array.isArray(current) ? [...current] : []
  const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]

  const saved = saveAnswer(quizFlow, state.value, runtimeScreen.id, next)
  state.value = saved.state
  issues.value = saved.issues
}

function onInputNumber(raw: string) {
  const runtimeScreen = screen.value
  if (runtimeScreen.kind !== 'input') return

  const parsed = Number(raw)
  const nextValue = raw === '' || Number.isNaN(parsed) ? undefined : parsed

  state.value = {
    ...state.value,
    answersByScreen: {
      ...state.value.answersByScreen,
      [runtimeScreen.id]: nextValue,
    },
    updatedAt: new Date().toISOString(),
  }
  issues.value = []
}

function updateLead(partial: Partial<LeadGateAnswer>) {
  const runtimeScreen = screen.value
  if (runtimeScreen.kind !== 'leadGate') return

  const current = state.value.answersByScreen[runtimeScreen.id]
  const lead: LeadGateAnswer = isLead(current) ? current : { name: '', email: '', consentAccepted: true }

  state.value = {
    ...state.value,
    answersByScreen: {
      ...state.value.answersByScreen,
      [runtimeScreen.id]: { ...lead, ...partial },
    },
    updatedAt: new Date().toISOString(),
  }
  issues.value = []
}

function goPaywallFromResult() {
  if (screen.value.kind !== 'result') return
  const paywallIndex = quizFlow.screens.findIndex((item) => item.kind === 'paywall')
  if (paywallIndex < 0) return

  state.value = {
    ...state.value,
    currentScreenIndex: paywallIndex,
    updatedAt: new Date().toISOString(),
  }
  issues.value = []
}

/* ---- Авто-переход на экране загрузки плана ---- */
let loaderTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => `${state.value.currentScreenIndex}:${screen.value.id}`,
  () => {
    if (loaderTimer) {
      clearTimeout(loaderTimer)
      loaderTimer = undefined
    }
    const active = screen.value
    if (active.kind === 'loader' && active.steps.length > 0) {
      const index = state.value.currentScreenIndex
      loaderTimer = setTimeout(() => {
        if (state.value.currentScreenIndex !== index) return
        if (screen.value.kind !== 'loader' || screen.value.id !== active.id) return
        const result = moveNext(quizFlow, state.value)
        state.value = result.state
        issues.value = result.issues
      }, 4200)
    }
  },
  { immediate: true },
)

/* Сохраняем черновик лида, когда он заполнен (на лид-гейте до перехода). */
onMounted(() => {
  if (isLead(state.value.answersByScreen.lead_gate)) {
    void persistLead('draft')
  }
})

/* Очистка черновика после показа пейволла. */
watch(
  () => screen.value.kind,
  (kind) => {
    if (kind === 'paywall') {
      clearQuizState()
    }
  },
)
</script>
