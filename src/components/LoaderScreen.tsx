import { jsx } from '@app/html-jsx'
import type { LoaderScreen as LoaderScreenType } from '../quiz/types'
import { LoaderLayout } from '../ui/quiz-components'

// @shared
export function LoaderScreen(props: {
  screen: LoaderScreenType
  progressPercent: number
  onNext: () => void
  onBack: () => void
}) {
  return (
    <LoaderLayout
      title={props.screen.title}
      text={props.screen.text}
      steps={props.screen.steps}
      buttonText={props.screen.buttonText}
      progressPercent={props.progressPercent}
      onNext={props.onNext}
      onBack={props.onBack}
    />
  )
}
