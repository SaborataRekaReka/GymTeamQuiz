import { jsx } from '@app/html-jsx'
import type { LegalLinks, QuizRuntimeState, QuizScreen, ValidationIssue } from '../quiz/types'
import { QuestionLayout } from '../ui/quiz-components'

// @shared
export function QuestionScreen(props: {
  screen: QuizScreen
  state: QuizRuntimeState
  progressPercent: number
  issues: ValidationIssue[]
  legalLinks: LegalLinks
  onSelect: (option: string) => void
  onToggle: (option: string) => void
  onInput: (value: string) => void
  onNext: () => void
  onBack: () => void
}) {
  const value = props.state.answersByScreen[props.screen.id]

  return (
    <QuestionLayout
      screen={props.screen}
      selectedSingle={typeof value === 'string' ? value : undefined}
      selectedMultiple={Array.isArray(value) ? (value as string[]) : []}
      inputValue={typeof value === 'number' ? String(value) : ''}
      answersByScreen={props.state.answersByScreen}
      progressPercent={props.progressPercent}
      issues={props.issues}
      legalLinks={props.legalLinks}
      onSelect={props.onSelect}
      onToggle={props.onToggle}
      onInput={props.onInput}
      onNext={props.onNext}
      onBack={props.onBack}
    />
  )
}
