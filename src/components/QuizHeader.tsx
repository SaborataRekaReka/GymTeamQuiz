import { jsx } from '@app/html-jsx'
import { QuizHeader as PrimitiveQuizHeader } from '../ui/primitives'

// @shared
export function QuizHeader(props: {
  progressPercent: number
  onBack?: () => void
}) {
  return (
    <PrimitiveQuizHeader
      progressPercent={props.progressPercent}
      onBack={props.onBack}
    />
  )
}
