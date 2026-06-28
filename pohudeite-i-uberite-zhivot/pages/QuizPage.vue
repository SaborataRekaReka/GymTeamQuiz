<template>
  <QuestionScreen
    v-if="screen.kind === 'single' || screen.kind === 'multiple' || screen.kind === 'input'"
    :screen="screen"
    :checkpoint-state="checkpointState"
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
    :checkpoint-state="checkpointState"
    :text="trustText"
    :benefits="trustBenefits"
    :media-src="trustMediaSrc"
    :media-fallback-src="trustMediaSecondarySrc"
    :media-video-src="trustVideoSrc"
    :research-slides="researchSlides"
    :progress-percent="progressPercent"
    :on-next="onNext"
    :on-back="onBack"
  />

  <LoaderScreen
    v-else-if="screen.kind === 'loader'"
    :title="screen.title"
    :checkpoint-state="checkpointState"
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
    :checkpoint-state="checkpointState"
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

  <template v-else-if="screen.kind === 'result'">
    <ResultScreen
      :title="resultData.title"
      :checkpoint-state="checkpointState"
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
      :show-open-paywall-cta="false"
      :on-open-paywall="goPaywallFromResult"
      :on-back="onBack"
    />

    <PaywallScreen
      :embedded="true"
      :checkpoint-state="checkpointState"
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
      :required-blocks="paywallRequiredBlocks"
      :progress-percent="progressPercent"
      :on-back="onBack"
    />
  </template>

  <PaywallScreen
    v-else-if="screen.kind === 'paywall'"
    :embedded="false"
    :checkpoint-state="checkpointState"
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import QuestionScreen from '../components/QuestionScreen.vue'
import TrustScreen from '../components/TrustScreen.vue'
import LoaderScreen from '../components/LoaderScreen.vue'
import LeadGateScreen from '../components/LeadGateScreen.vue'
import ResultScreen from '../components/ResultScreen.vue'
import PaywallScreen from '../components/PaywallScreen.vue'

import { quizFlow } from '../src/quiz/screens'
import {
  calculateProgressPercent,
  canMoveNext,
  createInitialState,
  getCurrentScreen,
  moveBack,
  moveNext,
  saveAnswer,
} from '../src/quiz/state'
import { buildPersonalResult } from '../src/quiz/result'
import { buildResultInputs, recommendResultPrograms } from '../src/quiz/programs'
import { getResultImages } from '../src/quiz/resultImages'
import type {
  LeadGateAnswer,
  ProgressCheckpoint,
  ProgressCheckpointState,
  QuizRuntimeState,
  QuizScreen,
  ValidationIssue,
} from '../src/quiz/types'

import { resolveUtm } from '../shared/utm'
import { assetUrl } from '../shared/assets'
import { clearQuizState, getOrCreateSessionId, loadQuizState, saveQuizState } from '../shared/quizPersist'
import { upsertLead } from '../shared/saveLead'

const TRUST_MEDIA_BY_ID: Record<string, string> = {
  trust_580k: 'https://slt.cdn-chatium.io/thumbnail/image_msk_FDCege2z1M.1080x720.jpeg/s/1024x',
  nutrition_assistant: 'https://fs.chatium.ru/get/image_msk_eNJKQZBKK4.1400x700.webp',
}
const TRUST_MEDIA_SECONDARY_BY_ID: Record<string, string> = {
  trust_580k: 'https://slt.cdn-chatium.io/thumbnail/image_msk_YYLWFz4dDJ.1440x960.jpeg/s/1024x',
}
const TRUST_VIDEO_BY_ID: Record<string, string> = {
  trust_soft_training: 'https://slt.cdn-chatium.io/get/video_msk_iNy38f49rL.d13.640x360.mp4',
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

const CHECKPOINT_ORDER = ['goal', 'zones', 'format', 'load', 'plan'] as const
type CheckpointId = (typeof CHECKPOINT_ORDER)[number]

const CHECKPOINT_PROGRESS_BY_ID: Record<CheckpointId, number> = {
  goal: 18,
  zones: 35,
  format: 55,
  load: 72,
  plan: 92,
}

const CHECKPOINT_TITLE_BY_ID: Record<CheckpointId, string> = {
  goal: 'Цель определена',
  zones: 'Акценты добавлены',
  format: 'Формат учтен',
  load: 'Нагрузка настроена',
  plan: 'План готов',
}

const CHECKPOINT_DEFAULT_TEXT_BY_ID: Record<CheckpointId, string> = {
  goal: 'Учли, к какому результату вы хотите прийти.',
  zones: 'Добавили зоны, на которые стоит сделать упор.',
  format: 'Подберем программы под ваш удобный формат.',
  load: 'Учли уровень, чтобы начать без перегруза.',
  plan: 'Готовим результат, питание и подборку программ.',
}

const sessionId = getOrCreateSessionId()
const utm = resolveUtm() as Record<string, string>
const state = ref<QuizRuntimeState>(loadQuizState() ?? createInitialState(utm))
const issues = ref<ValidationIssue[]>([])
const isLeadGateValidationActive = ref(false)
const openedCheckpointIds = ref<CheckpointId[]>([])
const appearingCheckpointId = ref<CheckpointId>()
const isCheckpointStateReady = ref(false)
let checkpointPulseTimer: ReturnType<typeof setTimeout> | undefined
const paywallRequiredBlocks =
  quizFlow.screens.find((item) => item.kind === 'paywall' && 'requiredBlocks' in item)?.requiredBlocks ?? []

const screenIndexById = Object.fromEntries(quizFlow.screens.map((item, index) => [item.id, index])) as Record<string, number>
const totalScreenCount = Object.keys(screenIndexById).length
const resultScreenIndex = screenIndexById.result ?? -1
const paywallScreenIndex = screenIndexById.paywall ?? -1
const planLoaderIndex = screenIndexById.plan_loader ?? -1

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

function hasMeaningfulAnswer(runtime: QuizRuntimeState, screenId: string): boolean {
  const value = runtime.answersByScreen[screenId]
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'number') return Number.isFinite(value)
  if (value && typeof value === 'object') return true
  return false
}

function isAfterScreen(runtime: QuizRuntimeState, screenId: string): boolean {
  const index = screenIndexById[screenId]
  if (index === undefined) return false
  return runtime.currentScreenIndex > index
}

function canOpenCheckpoint(id: CheckpointId, runtime: QuizRuntimeState, reachedByAnswers: boolean): boolean {
  if (!reachedByAnswers) return false
  const total = totalScreenCount
  if (total <= 0) return false
  const progress = ((runtime.currentScreenIndex + 1) / total) * 100
  const clampedProgress = Math.max(0, Math.min(100, progress))
  return clampedProgress >= CHECKPOINT_PROGRESS_BY_ID[id]
}

function formatCheckpointText(id: CheckpointId, runtime: QuizRuntimeState): string {
  if (id === 'plan') {
    const resultIndex = resultScreenIndex
    const paywallIndex = paywallScreenIndex
    const readyFromIndex =
      resultIndex >= 0 && paywallIndex >= 0
        ? Math.min(resultIndex, paywallIndex)
        : resultIndex >= 0
          ? resultIndex
          : paywallIndex

    if (readyFromIndex >= 0 && runtime.currentScreenIndex >= readyFromIndex) {
      return 'План готов: вес, питание и подборка программ уже перед вами.'
    }
  }

  if (id === 'zones') {
    const zones = getStringArrayAnswer(runtime, 'zones') ?? []
    const firstZone = zones[0]
    if (zones.length === 1 && firstZone) return `Добавили акцент: ${firstZone.toLowerCase()}.`
    if (zones.length > 1 && firstZone) return `Добавили акценты: ${firstZone.toLowerCase()} и еще ${zones.length - 1}.`
  }

  if (id === 'format') {
    const format = getStringAnswer(runtime, 'training_place')
    if (format === 'Дома') return 'Подберем программы для дома.'
    if (format === 'В зале') return 'Подберем программы для зала.'
    if (format === 'И дома, и в зале') return 'Учли формат: и дома, и в зале.'
    if (format === 'На улице') return 'Учли формат: на улице.'
  }

  if (id === 'load') {
    const experience = getStringAnswer(runtime, 'experience')
    const activity = getStringAnswer(runtime, 'activity')
    if (experience === 'Новичок, начинаю с нуля') return 'Начнем мягко, без перегруза.'
    if (experience === 'Тренируюсь регулярно' || activity === 'Двигаюсь много') return 'Можно подобрать более динамичный старт.'
  }

  return CHECKPOINT_DEFAULT_TEXT_BY_ID[id]
}

const checkpointDefinitions = computed<ProgressCheckpoint[]>(() => {
  const runtime = state.value
  return CHECKPOINT_ORDER.map((id) => ({
    id,
    progress: CHECKPOINT_PROGRESS_BY_ID[id],
    title: CHECKPOINT_TITLE_BY_ID[id],
    text: formatCheckpointText(id, runtime),
  }))
})

const reachedCheckpointIds = computed<CheckpointId[]>(() => {
  const runtime = state.value
  const reached: CheckpointId[] = []

  const goalReachedByAnswers = hasMeaningfulAnswer(runtime, 'goal_body') || isAfterScreen(runtime, 'goal_body')
  if (canOpenCheckpoint('goal', runtime, goalReachedByAnswers)) reached.push('goal')

  const zonesReachedByAnswers = hasMeaningfulAnswer(runtime, 'zones') || isAfterScreen(runtime, 'zones')
  if (canOpenCheckpoint('zones', runtime, zonesReachedByAnswers)) reached.push('zones')

  const formatReachedByAnswers = hasMeaningfulAnswer(runtime, 'training_place') || isAfterScreen(runtime, 'training_place')
  if (canOpenCheckpoint('format', runtime, formatReachedByAnswers)) reached.push('format')

  const loadReachedByAnswers = hasMeaningfulAnswer(runtime, 'experience') || isAfterScreen(runtime, 'experience')
  if (canOpenCheckpoint('load', runtime, loadReachedByAnswers)) reached.push('load')

  const planReachedByAnswers = planLoaderIndex >= 0 && runtime.currentScreenIndex >= planLoaderIndex
  if (canOpenCheckpoint('plan', runtime, planReachedByAnswers)) reached.push('plan')

  return reached
})

const activeCheckpointId = computed<CheckpointId | undefined>(() => {
  const reached = reachedCheckpointIds.value
  return reached[reached.length - 1]
})

const checkpointContextKey = computed(() => `${state.value.currentScreenIndex}:${screen.value.id}`)

const checkpointState = computed<ProgressCheckpointState>(() => ({
  checkpoints: checkpointDefinitions.value,
  openedIds: openedCheckpointIds.value,
  activeId: activeCheckpointId.value,
  appearingId: appearingCheckpointId.value,
  contextKey: checkpointContextKey.value,
}))

watch(
  reachedCheckpointIds,
  (reached) => {
    if (!isCheckpointStateReady.value) {
      openedCheckpointIds.value = [...reached]
      isCheckpointStateReady.value = true
      return
    }

    const newlyOpened = reached.filter((id) => !openedCheckpointIds.value.includes(id))
    if (newlyOpened.length === 0) return

    openedCheckpointIds.value = [...openedCheckpointIds.value, ...newlyOpened]
    const latest = newlyOpened[newlyOpened.length - 1]
    if (!latest) return
    appearingCheckpointId.value = latest

    if (checkpointPulseTimer) clearTimeout(checkpointPulseTimer)
    checkpointPulseTimer = setTimeout(() => {
      if (appearingCheckpointId.value === latest) {
        appearingCheckpointId.value = undefined
      }
    }, 1400)
  },
  { immediate: true },
)
function buildResultTitle(template: string | undefined, name: string, currentWeight: number, targetWeight: number): string {
  const base = template ?? '{Имя}, вот ваш план: с {вес} до {целевой вес}'
  return base
    .replace('{Имя}', name || 'Ваш план')
    .replace('{вес}', String(currentWeight))
    .replace('{целевой вес}', String(targetWeight))
}

const screen = computed<QuizScreen>(() => getCurrentScreen(quizFlow, state.value))
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

const trustText = computed(() =>
  screen.value.kind === 'trust' || screen.value.kind === 'salesTransition' ? screen.value.text : undefined,
)
const trustBenefits = computed(() => (screen.value.kind === 'salesTransition' ? screen.value.benefits : []))
const trustMediaSrc = computed(() => {
  const path = TRUST_MEDIA_BY_ID[screen.value.id]
  return path ? assetUrl(path) : undefined
})
const trustMediaSecondarySrc = computed(() => {
  const path = TRUST_MEDIA_SECONDARY_BY_ID[screen.value.id]
  return path ? assetUrl(path) : undefined
})
const trustVideoSrc = computed(() => {
  const path = TRUST_VIDEO_BY_ID[screen.value.id]
  return path ? assetUrl(path) : undefined
})
const researchSlides = computed(() => RESEARCH_SLIDES_BY_ID[screen.value.id])

const loaderText = computed(() => (screen.value.kind === 'loader' ? screen.value.text : undefined))
const loaderSteps = computed(() => (screen.value.kind === 'loader' ? screen.value.steps : []))
const loaderButtonText = computed(() => (screen.value.kind === 'loader' ? screen.value.buttonText : undefined))

const leadGateText = computed(() => (screen.value.kind === 'leadGate' ? screen.value.text : undefined))
const leadValue = computed<LeadGateAnswer>(() => {
  const lead = state.value.answersByScreen[screen.value.id]
  return isLead(lead) ? lead : { name: '', email: '', consentAccepted: true }
})
const leadGateIssues = computed(() =>
  currentIssues.value.length > 0
    ? currentIssues.value
    : isLeadGateValidationActive.value && nextBlocked.value
      ? guardIssues.value
      : [],
)

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

async function onNext() {
  const runtimeScreen = screen.value

  if (runtimeScreen.kind === 'leadGate') {
    isLeadGateValidationActive.value = true
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
  isLeadGateValidationActive.value = false
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

watch(
  () => screen.value.kind,
  (kind) => {
    if (kind !== 'leadGate') {
      isLeadGateValidationActive.value = false
    }
  },
)

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

onMounted(() => {
  if (isLead(state.value.answersByScreen.lead_gate)) {
    void persistLead('draft')
  }
})

onBeforeUnmount(() => {
  if (checkpointPulseTimer) {
    clearTimeout(checkpointPulseTimer)
    checkpointPulseTimer = undefined
  }
})

watch(
  () => screen.value.kind,
  (kind) => {
    if (kind === 'paywall') {
      clearQuizState()
    }
  },
)
</script>