import { jsx } from '@app/html-jsx'
import type { QuizScreen } from '../quiz/types'
import { TrustLayout } from '../ui/quiz-components'

interface ResearchSlide {
  text: string
  source: string
}

const TRUST_MEDIA_BY_ID: Record<string, string> = {
  trust_580k: '/assets/quiz/realistic woman scene/womans.jpeg',
  nutrition_assistant: '/assets/quiz/trust/nutrition-assistant-transition.jpeg',
}

const TRUST_VIDEO_BY_ID: Record<string, string> = {
  trust_soft_training: '/assets/quiz/trust/trust-soft-training.mp4',
}

const RESEARCH_SLIDES_BY_ID: Record<string, ResearchSlide[]> = {
  research_trust: [
    {
      text: 'Регулярная ходьба и щадящие тренировки помогают сбросить часть веса за несколько недель и заметно прибавляют энергии.',
      source: 'JAMA, 2019',
    },
    {
      text: 'Умеренная регулярная физическая активность связана с ростом чувства энергии и снижением усталости по данным мета-анализа.',
      source: 'Psychological Bulletin, 2006',
    },
    {
      text: 'Самоконтроль питания и привычек улучшает удержание результата по весу и делает программу более устойчивой в реальной жизни.',
      source: 'J Am Diet Assoc, 2011',
    },
  ],
}

// @shared
export function TrustScreen(props: {
  screen: QuizScreen
  progressPercent: number
  onNext: () => void
  onBack: () => void
}) {
  const benefits = props.screen.kind === 'salesTransition' ? props.screen.benefits : []
  const text = props.screen.kind === 'trust' || props.screen.kind === 'salesTransition' ? props.screen.text : undefined

  return (
    <TrustLayout
      title={props.screen.title}
      text={text}
      benefits={benefits}
      mediaSrc={TRUST_MEDIA_BY_ID[props.screen.id]}
      mediaVideoSrc={TRUST_VIDEO_BY_ID[props.screen.id]}
      researchSlides={RESEARCH_SLIDES_BY_ID[props.screen.id]}
      progressPercent={props.progressPercent}
      onNext={props.onNext}
      onBack={props.onBack}
    />
  )
}
