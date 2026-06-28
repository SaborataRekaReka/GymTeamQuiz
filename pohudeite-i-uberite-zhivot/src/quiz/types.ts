// @shared

export type RawScreenType =
  | 'single_choice'
  | 'multi_choice'
  | 'number_input'
  | 'trust'
  | 'sales_transition'
  | 'loader'
  | 'lead_gate'
  | 'personal_result'
  | 'paywall'

export type QuizScreenKind =
  | 'single'
  | 'multiple'
  | 'input'
  | 'trust'
  | 'salesTransition'
  | 'loader'
  | 'leadGate'
  | 'result'
  | 'paywall'

export type InputValueType = 'number' | 'text' | 'email'
export type LeadGateField = 'name' | 'email'

export type ResultType =
  | 'weight_loss_belly'
  | 'tone'
  | 'health_back'
  | 'energy'
  | 'general_shape'

export interface LegalLinks {
  offer: string
  privacy: string
  personal_data: string
}

export interface TariffConfig {
  name: string
  price: number
  old_price: number
  period: string
  renewal?: string
}

export interface RawQuizScreen {
  number: number
  id: string
  type: RawScreenType
  role?: string
  offer?: string
  media?: string
  question?: string
  subtitle?: string
  options?: string[]
  option_icons?: string[]
  multiple?: boolean
  footer_note?: string
  title?: string
  text?: string
  button?: string
  note?: string
  unit?: string
  benefits?: string[]
  progress_type?: 'percent'
  steps?: string[]
  fields?: LeadGateField[]
  consent_required?: boolean
  title_template?: string
  blocks?: string[]
  top_focus?: string
  required_blocks?: string[]
}

export interface RawQuizMap {
  project: string
  goal: string
  screens: RawQuizScreen[]
  legal_links: LegalLinks
  tariffs: TariffConfig[]
  required_saved_fields: string[]
}

export interface BaseQuizScreen {
  order: number
  id: string
  rawType: RawScreenType
  kind: QuizScreenKind
  title?: string
  subtitle?: string
  required: boolean
  notes?: string
}

export interface SingleChoiceScreen extends BaseQuizScreen {
  kind: 'single'
  options: string[]
  offer?: string
  optionIcons?: string[]
}

export interface MultipleChoiceScreen extends BaseQuizScreen {
  kind: 'multiple'
  options: string[]
  optionIcons?: string[]
}

export interface InputScreen extends BaseQuizScreen {
  kind: 'input'
  inputType: InputValueType
  unit?: string
  min?: number
  max?: number
}

export interface TrustScreen extends BaseQuizScreen {
  kind: 'trust'
  text?: string
  media?: string
  buttonText?: string
}

export interface SalesTransitionScreen extends BaseQuizScreen {
  kind: 'salesTransition'
  text?: string
  media?: string
  benefits: string[]
  buttonText?: string
}

export interface LoaderScreen extends BaseQuizScreen {
  kind: 'loader'
  text?: string
  media?: string
  buttonText?: string
  progressType?: 'percent'
  steps: string[]
}

export interface LeadGateScreen extends BaseQuizScreen {
  kind: 'leadGate'
  text?: string
  fields: LeadGateField[]
  consentRequired: boolean
}

export interface ResultScreen extends BaseQuizScreen {
  kind: 'result'
  titleTemplate?: string
  blocks: string[]
}

export interface PaywallScreen extends BaseQuizScreen {
  kind: 'paywall'
  topFocus?: string
  requiredBlocks: string[]
}

export type QuizScreen =
  | SingleChoiceScreen
  | MultipleChoiceScreen
  | InputScreen
  | TrustScreen
  | SalesTransitionScreen
  | LoaderScreen
  | LeadGateScreen
  | ResultScreen
  | PaywallScreen

export interface QuizFlowConfig {
  project: string
  goal: string
  screens: QuizScreen[]
  legalLinks: LegalLinks
  tariffs: TariffConfig[]
  requiredSavedFields: string[]
}

export interface LeadGateAnswer {
  name: string
  email: string
  consentAccepted: boolean
}

export type QuizAnswerValue = string | string[] | number | LeadGateAnswer
export type QuizAnswersByScreen = Partial<Record<string, QuizAnswerValue>>

export interface QuizRuntimeState {
  currentScreenIndex: number
  answersByScreen: QuizAnswersByScreen
  completedScreenIds: string[]
  startedAt: string
  updatedAt: string
  utm: Record<string, string>
}

export interface ValidationIssue {
  screenId: string
  field: string
  message: string
}

export interface ProgressCheckpoint {
  id: string
  progress: number
  title: string
  text: string
}

export interface ProgressCheckpointState {
  checkpoints: ProgressCheckpoint[]
  openedIds: string[]
  activeId?: string
  appearingId?: string
  contextKey: string
}

export interface SaveAnswerResult {
  state: QuizRuntimeState
  saved: boolean
  issues: ValidationIssue[]
}

export interface NavigationResult {
  state: QuizRuntimeState
  moved: boolean
  issues: ValidationIssue[]
}

export interface MacroTargets {
  proteinGrams: number
  fatGrams: number
  carbsGrams: number
}

export interface ResultCalculationInput {
  ageBucket?: string
  activity?: string
  currentWeight: number
  targetWeight: number
  height: number
  goalBody?: string
  resultFocus?: string
  zones?: string[]
  trainingPlace?: string
  experience?: string
  bestShape?: string
}

export interface PersonalResult {
  bmi: number
  bmiLabel: string
  bmr: number
  activityFactor: number
  maintenanceCalories: number
  calorieNorm: number
  macros: MacroTargets
  weightDifferenceKg: number
  resultType: ResultType
  recommendedPrograms: string[]
}

export interface ResultProgram {
  id: string
  title: string
  type: 'Флагман' | 'Марафон' | 'Курс' | 'Бестселлер' | 'Программа'
  description: string
  tags: string[]
  relevanceTags: string[]
  imageUrl: string
  localImage: string
}

export interface ResultInput {
  label: string
  value: string
}

export interface LeadPayload {
  name: string
  email: string
  consentAccepted: boolean
  answersByScreen: QuizAnswersByScreen
  height?: number
  currentWeight?: number
  targetWeight?: number
  resultType?: ResultType
  calorieNorm?: number
  macros?: MacroTargets
  utm: Record<string, string>
  createdAt: string
}

export interface LeadSaveResult {
  status: 'saved' | 'queued'
  leadId: string
  savedAt: string
}
