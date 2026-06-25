import type { QuizResult, QuizState } from './types'

const DEFAULT_AGE = 35
const DEFAULT_ACTIVITY_FACTOR = 1.25
const DEFAULT_DAILY_DEFICIT = 450
const KCAL_PER_KG = 7700

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return round(weightKg / (heightM * heightM), 1)
}

export function getBmiLabel(bmi: number): string {
  if (bmi < 18.5) return 'ниже нормы'
  if (bmi < 25) return 'норма'
  if (bmi < 30) return 'выше нормы'
  return 'заметно выше нормы'
}

export function calculateCalories(state: QuizState): number {
  const weight = state.currentWeight ?? 70
  const height = state.height ?? 165
  const age = parseAgeBucket(state.age) ?? DEFAULT_AGE
  // Mifflin St Jeor, female: 10w + 6.25h - 5a - 161
  const bmr = 10 * weight + 6.25 * height - 5 * age - 161
  return Math.max(1200, Math.round(bmr * DEFAULT_ACTIVITY_FACTOR - DEFAULT_DAILY_DEFICIT))
}

export function calculateMacros(calories: number, weightKg: number) {
  const proteinGrams = Math.round(weightKg * 1.6)
  const fatGrams = Math.round(weightKg * 0.8)
  const caloriesFromProtein = proteinGrams * 4
  const caloriesFromFat = fatGrams * 9
  const carbsGrams = Math.max(80, Math.round((calories - caloriesFromProtein - caloriesFromFat) / 4))
  return { proteinGrams, fatGrams, carbsGrams }
}

export function estimateDays(state: QuizState): number {
  const current = state.currentWeight ?? 70
  const target = state.targetWeight ?? current
  const kgToLose = Math.max(0, current - target)
  if (kgToLose === 0) return 21
  return Math.max(21, Math.round((kgToLose * KCAL_PER_KG) / DEFAULT_DAILY_DEFICIT))
}

export function getResultType(state: QuizState): string {
  const focus = state.resultFocus ?? state.goalBody ?? ''
  if (focus.includes('живот') || state.zones?.some((z) => z.includes('Живот'))) return 'акцент на живот и талию'
  if (focus.includes('тонус') || state.goalBody?.includes('тонус')) return 'акцент на тонус и подтянутость'
  if (focus.includes('энергия')) return 'акцент на лёгкость и энергию'
  if (state.zones?.some((z) => z.includes('Спина'))) return 'акцент на спину и осанку'
  return 'мягкое снижение веса'
}

export function getRecommendedPrograms(state: QuizState): string[] {
  const programs = new Set<string>()
  programs.add('Стартовая программа Кати Усмановой')

  if (state.zones?.some((z) => z.includes('Живот'))) programs.add('Плоский живот и талия')
  if (state.zones?.some((z) => z.includes('Ягодицы'))) programs.add('Ягодицы и ноги')
  if (state.zones?.some((z) => z.includes('Спина'))) programs.add('Здоровая спина и осанка')
  if (state.place === 'Дома') programs.add('Домашние тренировки без сложного инвентаря')
  if (state.experience?.includes('Новичок')) programs.add('Мягкий старт для новичков')

  return [...programs].slice(0, 5)
}

export function buildResult(state: QuizState): QuizResult {
  const currentWeight = state.currentWeight ?? 70
  const height = state.height ?? 165
  const bmi = calculateBmi(currentWeight, height)
  const calories = calculateCalories(state)
  const macros = calculateMacros(calories, currentWeight)

  return {
    bmi,
    bmiLabel: getBmiLabel(bmi),
    calories,
    ...macros,
    estimatedDays: estimateDays(state),
    resultType: getResultType(state),
    recommendedPrograms: getRecommendedPrograms(state),
  }
}

function parseAgeBucket(age?: string): number | undefined {
  if (!age) return undefined
  if (age.includes('18-29')) return 24
  if (age.includes('30-39')) return 35
  if (age.includes('40-49')) return 45
  if (age.includes('50-59')) return 55
  if (age.includes('60')) return 62
  return undefined
}

function round(value: number, precision = 0): number {
  const k = 10 ** precision
  return Math.round(value * k) / k
}
