import { jsx } from '@app/html-jsx'
import type { LeadGateAnswer, LeadGateScreen as LeadGateScreenType, LegalLinks, ValidationIssue } from '../quiz/types'
import { LeadGateLayout } from '../ui/quiz-components'

// @shared
export function LeadGateScreen(props: {
  screen: LeadGateScreenType
  value: LeadGateAnswer
  legalLinks: LegalLinks
  progressPercent: number
  issues: ValidationIssue[]
  onNameInput: (value: string) => void
  onEmailInput: (value: string) => void
  onConsentToggle: (checked: boolean) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <LeadGateLayout
      title={props.screen.title}
      text={props.screen.text}
      name={props.value.name}
      email={props.value.email}
      consentAccepted={props.value.consentAccepted}
      legalLinks={props.legalLinks}
      progressPercent={props.progressPercent}
      issues={props.issues}
      onNameInput={props.onNameInput}
      onEmailInput={props.onEmailInput}
      onConsentToggle={props.onConsentToggle}
      onNext={props.onNext}
      onBack={props.onBack}
    />
  )
}
