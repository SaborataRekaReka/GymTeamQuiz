export type ScreenType =
  | 'single'
  | 'multiple'
  | 'number'
  | 'trust'
  | 'loader'
  | 'leadGate'
  | 'finalLoader'
  | 'result'
  | 'paywall'

export type QuizAnswerValue = string | string[] | number | boolean | undefined

export interface QuizState {
  age?: string
  bodyNow?: string
  goalBody?: string
  zones?: string[]
  cellulite?: string
  bestShape?: string
  activity?: string
  sleep?: string
  resultFocus?: string
  currentWeight?: number
  height?: number
  targetWeight?: number
  experience?: string
  place?: string
  reward?: string[]
  name?: string
  email?: string
  consentAccepted?: boolean
  utm?: Record<string, string>
  createdAt?: string
}

export interface QuizResult {
  bmi: number
  bmiLabel: string
  calories: number
  proteinGrams: number
  fatGrams: number
  carbsGrams: number
  estimatedDays: number
  resultType: string
  recommendedPrograms: string[]
}
