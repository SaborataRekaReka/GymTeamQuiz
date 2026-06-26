import { jsx } from '@app/html-jsx'
import type { PersonalResult, ResultInput, ResultProgram } from '../quiz/types'
import { ResultLayout } from '../ui/quiz-components'

// @shared
export function ResultScreen(props: {
  title: string
  name: string
  result: PersonalResult
  inputs: ResultInput[]
  programs: ResultProgram[]
  currentImage: string
  targetImage: string
  currentWeight: number
  targetWeight: number
  progressPercent: number
  onOpenPaywall: () => void
  onBack: () => void
}) {
  return (
    <ResultLayout
      title={props.title}
      name={props.name}
      currentWeight={props.currentWeight}
      targetWeight={props.targetWeight}
      weightDiff={Math.abs(props.result.weightDifferenceKg)}
      weightLoss={props.result.weightDifferenceKg > 0}
      inputs={props.inputs}
      calorieNorm={props.result.calorieNorm}
      protein={props.result.macros.proteinGrams}
      fat={props.result.macros.fatGrams}
      carbs={props.result.macros.carbsGrams}
      bmi={props.result.bmi}
      bmiLabel={props.result.bmiLabel}
      programs={props.programs}
      currentImage={props.currentImage}
      targetImage={props.targetImage}
      progressPercent={props.progressPercent}
      onOpenPaywall={props.onOpenPaywall}
      onBack={props.onBack}
    />
  )
}
