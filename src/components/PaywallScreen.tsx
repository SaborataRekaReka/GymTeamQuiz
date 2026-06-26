import { jsx } from '@app/html-jsx'
import type { LegalLinks, PaywallScreen as PaywallScreenType, ResultProgram, TariffConfig } from '../quiz/types'
import { PaywallLayout } from '../ui/quiz-components'
import { GetCourseEmbedBlock } from './GetCourseEmbedBlock'

// @shared
export function PaywallScreen(props: {
  screen: PaywallScreenType
  tariffs: TariffConfig[]
  legalLinks: LegalLinks
  name: string
  currentWeight: number
  targetWeight: number
  goal: string
  zones: string[]
  trainingPlace: string
  programs: ResultProgram[]
  currentImage: string
  targetImage: string
  progressPercent: number
  onBack: () => void
}) {
  return (
    <PaywallLayout
      topFocus={props.screen.topFocus}
      requiredBlocks={props.screen.requiredBlocks}
      tariffs={props.tariffs}
      legalLinks={props.legalLinks}
      name={props.name}
      currentWeight={props.currentWeight}
      targetWeight={props.targetWeight}
      goal={props.goal}
      zones={props.zones}
      trainingPlace={props.trainingPlace}
      programs={props.programs}
      currentImage={props.currentImage}
      targetImage={props.targetImage}
      progressPercent={props.progressPercent}
      getCourseEmbedBlock={<GetCourseEmbedBlock />}
      onBack={props.onBack}
    />
  )
}
