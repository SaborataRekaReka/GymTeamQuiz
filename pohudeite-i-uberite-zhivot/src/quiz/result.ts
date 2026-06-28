// @shared

import { recommendPrograms } from './programs'
import type { MacroTargets, PersonalResult, ResultCalculationInput, ResultType } from './types'

const DEFAULT_AGE = 35
const DEFAULT_ACTIVITY_FACTOR = 1.35

const ACTIVITY_FACTORS: Record<string, number> = {
  'Почти весь день сижу': 1.2,
  'Хожу по делам, но спорта нет': 1.35,
  'Иногда тренируюсь, нерегулярно': 1.45,
  'Двигаюсь много': 1.6,
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return round(weightKg / (heightM * heightM), 1)
}

export function getBmiLabel(bmi: number): string {
  if (bmi < 18.5) return 'ниже нормы'
  if (bmi < 25) return 'норма'
  if (bmi < 30) return 'выше нормы'
  return 'высокий вес'
}

export function getAgeFromBucket(ageBucket?: string): number {
  if (!ageBucket) return DEFAULT_AGE
  if (ageBucket.includes('18-29')) return 25
  if (ageBucket.includes('30-39')) return 35
  if (ageBucket.includes('40-49')) return 45
  if (ageBucket.includes('50-59')) return 55
  if (ageBucket.includes('60')) return 65
  return DEFAULT_AGE
}

export function getActivityFactor(activity?: string): number {
  if (!activity) return DEFAULT_ACTIVITY_FACTOR
  return ACTIVITY_FACTORS[activity] ?? DEFAULT_ACTIVITY_FACTOR
}

export function calculateBmrFemale(weightKg: number, heightCm: number, ageYears: number): number {
  return round(10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161)
}

export function calculateMaintenanceCalories(bmr: number, activityFactor: number): number {
  return roundToNearest10(bmr * activityFactor)
}

export function calculateCalorieNorm(maintenanceCalories: number, weightDifferenceKg: number): number {
  if (weightDifferenceKg > 0) {
    return Math.max(1200, roundToNearest10(maintenanceCalories * 0.85))
  }
  return Math.max(1200, roundToNearest10(maintenanceCalories))
}

export function calculateMacros(calorieNorm: number, targetWeight: number): MacroTargets {
  const proteinGrams = round(targetWeight * 1.6)
  const fatGrams = round(targetWeight * 0.8)
  const proteinCalories = proteinGrams * 4
  const fatCalories = fatGrams * 9
  const carbCalories = Math.max(0, calorieNorm - proteinCalories - fatCalories)
  const carbsGrams = round(carbCalories / 4)

  return {
    proteinGrams,
    fatGrams,
    carbsGrams,
  }
}

export function calculateWeightDifference(currentWeight: number, targetWeight: number): number {
  return round(currentWeight - targetWeight, 1)
}

export function detectResultType(input: ResultCalculationInput): ResultType {
  const resultFocus = input.resultFocus ?? ''
  const goalBody = input.goalBody ?? ''
  const zones = input.zones ?? []

  if (resultFocus.includes('Минус вес') || zones.some((zone) => zone.includes('Живот и талия'))) return 'weight_loss_belly'
  if (goalBody.includes('Подтянутое') || resultFocus.includes('тонус')) return 'tone'
  if (goalBody.includes('здоровое') || zones.some((zone) => zone.includes('Спина и осанка'))) return 'health_back'
  if (resultFocus.includes('Лёгкость')) return 'energy'

  return 'general_shape'
}

export function buildPersonalResult(input: ResultCalculationInput): PersonalResult {
  const age = getAgeFromBucket(input.ageBucket)
  const activityFactor = getActivityFactor(input.activity)
  const bmr = calculateBmrFemale(input.currentWeight, input.height, age)
  const maintenanceCalories = calculateMaintenanceCalories(bmr, activityFactor)
  const weightDifferenceKg = calculateWeightDifference(input.currentWeight, input.targetWeight)
  const calorieNorm = calculateCalorieNorm(maintenanceCalories, weightDifferenceKg)
  const macros = calculateMacros(calorieNorm, input.targetWeight)
  const bmi = calculateBmi(input.currentWeight, input.height)

  return {
    bmi,
    bmiLabel: getBmiLabel(bmi),
    bmr,
    activityFactor,
    maintenanceCalories,
    calorieNorm,
    macros,
    weightDifferenceKg,
    resultType: detectResultType(input),
    recommendedPrograms: recommendPrograms(input),
  }
}

function round(value: number, precision = 0): number {
  const k = 10 ** precision
  return Math.round(value * k) / k
}

function roundToNearest10(value: number): number {
  return Math.round(value / 10) * 10
}
