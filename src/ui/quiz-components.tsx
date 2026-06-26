import { jsx } from '@app/html-jsx'
import { createSignal } from 'solid-js'
import type { QuizAnswersByScreen, QuizScreen, ResultInput, ResultProgram, TariffConfig, ValidationIssue } from '../quiz/types'
import {
  Accordion,
  Badge,
  BrandHero,
  Button,
  Card,
  Checkbox,
  ConsentFooter,
  ErrorText,
  Input,
  LegalLinks,
  OfferEyebrow,
  OptionButton,
  QuizHeader,
  Stack,
  StickyCta,
  Subtitle,
  Title,
} from './primitives'

const BMI_ICON_SRC = '/assets/icons/fitness_icons/Fitness-icons/SVG/scale.svg'

function parseNumericValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const numeric = Number(value)
    if (Number.isFinite(numeric)) {
      return numeric
    }
  }

  return undefined
}

function bmiLabel(value: number) {
  if (value < 18.5) return 'ниже нормы'
  if (value < 25) return 'в норме'
  if (value < 30) return 'выше нормы'
  return 'значительно выше нормы'
}

function buildBmiCard(screenId: string, inputValue: string, answersByScreen: QuizAnswersByScreen) {
  let currentWeight = parseNumericValue(answersByScreen.current_weight)
  let height = parseNumericValue(answersByScreen.height)

  if (screenId === 'current_weight') {
    currentWeight = parseNumericValue(inputValue)
  }

  if (screenId === 'height') {
    height = parseNumericValue(inputValue)
  }

  if (screenId === 'target_weight') {
    currentWeight = parseNumericValue(inputValue) ?? currentWeight
  }

  const hasMetrics = Boolean(currentWeight && height && currentWeight > 0 && height > 0)
  if (!hasMetrics) {
    return {
      title: 'Рассчитываем ИМТ',
      text: 'ИМТ помогает точнее подобрать безопасный темп, нагрузку и питание под вас.',
    }
  }

  const bmiValue = Number((currentWeight! / Math.pow(height! / 100, 2)).toFixed(1))
  return {
    title: `ИМТ: ${bmiValue} (${bmiLabel(bmiValue)})`,
    text: 'Это ориентир для персонального плана: учитываем его, чтобы комфортно двигаться к цели.',
  }
}

function inputPlaceholderByScreenId(screenId: string) {
  if (screenId === 'current_weight') return '72'
  if (screenId === 'height') return '168'
  if (screenId === 'target_weight') return '60'
  return '0'
}

export interface QuestionViewModel {
  screen: QuizScreen
  selectedSingle?: string
  selectedMultiple: string[]
  inputValue: string
  answersByScreen: QuizAnswersByScreen
  progressPercent: number
  issues: ValidationIssue[]
  legalLinks: { offer: string; privacy: string; personal_data: string }
  onSelect: (option: string) => void
  onToggle: (option: string) => void
  onInput: (value: string) => void
  onNext: () => void
  onBack: () => void
}

export function QuestionLayout(model: QuestionViewModel) {
  const screen = model.screen
  const optionList = screen.kind === 'single' || screen.kind === 'multiple' ? screen.options : []
  const optionIcons = (screen.kind === 'single' || screen.kind === 'multiple') && screen.optionIcons ? screen.optionIcons : []
  const stickyAction = screen.kind === 'multiple' || screen.kind === 'input'
  const offerText = screen.kind === 'single' ? screen.offer : undefined
  const isStart = screen.id === 'age'
  const isAgeScale = screen.kind === 'single' && screen.id === 'age'
  const isGoalCards = screen.kind === 'single' && screen.id === 'result_focus'
  const isPlainSingle = screen.kind === 'single' && !isAgeScale && !isGoalCards
  const showInputHintCard = screen.kind === 'input'
  const inputBmiCard = showInputHintCard
    ? buildBmiCard(screen.id, model.inputValue, model.answersByScreen)
    : undefined

  return (
    <Card>
      <Stack>
        <QuizHeader
          progressPercent={model.progressPercent}
          onBack={model.onBack}
        />
        {offerText ? <OfferEyebrow text={offerText} /> : null}
        {isStart ? <BrandHero /> : null}
        {screen.title ? <Title text={screen.title} /> : null}
        {screen.subtitle ? <Subtitle text={screen.subtitle} /> : null}

        {isAgeScale ? (
          <div class="quiz-age-scale">
            {optionList.map((option) => (
              <button
                type="button"
                class={`quiz-age-chip${model.selectedSingle === option ? ' is-selected' : ''}`}
                aria-pressed={model.selectedSingle === option}
                onClick={() => model.onSelect(option)}
              >
                <span class="quiz-age-chip-value">{option}</span>
                <span class="quiz-age-chip-unit">лет</span>
              </button>
            ))}
          </div>
        ) : null}

        {isGoalCards ? (
          <div class="quiz-goal-grid">
            {optionList.map((option, index) => (
              <button
                type="button"
                class={`quiz-goal-card${model.selectedSingle === option ? ' is-selected' : ''}`}
                aria-pressed={model.selectedSingle === option}
                onClick={() => model.onSelect(option)}
              >
                {optionIcons[index] ? (
                  <span
                    class="quiz-goal-card-icon"
                    style={{ '--opt-icon': `url(${optionIcons[index]})` }}
                    aria-hidden="true"
                  />
                ) : null}
                <span class="quiz-goal-card-text">{option}</span>
              </button>
            ))}
          </div>
        ) : null}

        <div class="quiz-option-list">
        {isPlainSingle
          ? optionList.map((option, index) => (
              <OptionButton
                label={option}
                icon={optionIcons[index]}
                selected={model.selectedSingle === option}
                onClick={() => model.onSelect(option)}
              />
            ))
          : null}

        {screen.kind === 'multiple'
          ? optionList.map((option, index) => (
              <OptionButton
                label={option}
                icon={optionIcons[index]}
                selected={model.selectedMultiple.includes(option)}
                onClick={() => model.onToggle(option)}
              />
            ))
          : null}

        {screen.kind === 'input' ? (
          <div class="quiz-metric-section">
            <div class="quiz-metric-input-wrap">
              <label class="quiz-metric-input" aria-label={screen.title ?? 'Введите значение'}>
                <input
                  class="quiz-metric-value"
                  type="number"
                  inputmode="numeric"
                  placeholder={inputPlaceholderByScreenId(screen.id)}
                  value={model.inputValue}
                  onInput={(event: Event) => model.onInput((event.currentTarget as HTMLInputElement).value)}
                />
                {screen.unit ? <span class="quiz-metric-unit">{screen.unit}</span> : null}
              </label>
              <span class="quiz-metric-divider" />
            </div>

            {showInputHintCard ? (
              <div class="quiz-bmi-card">
                <span class="quiz-bmi-icon" style={{ '--bmi-icon': `url(${BMI_ICON_SRC})` }} aria-hidden="true" />
                <div class="quiz-bmi-content">
                  <p class="quiz-bmi-title">{inputBmiCard?.title}</p>
                  <p class="quiz-bmi-text">{inputBmiCard?.text}</p>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        </div>

        {model.issues.map((issue) => (
          <ErrorText text={issue.message} />
        ))}

        {isStart ? (
          <ConsentFooter
            offer={model.legalLinks.offer}
            privacy={model.legalLinks.privacy}
            personalData={model.legalLinks.personal_data}
          />
        ) : null}

        {stickyAction ? (
          <StickyCta>
            <div class="quiz-actions">
              <Button label="Продолжить" onClick={model.onNext} />
            </div>
          </StickyCta>
        ) : screen.kind === 'single' ? null : (
          <div class="quiz-actions">
            <Button label="Продолжить" onClick={model.onNext} />
          </div>
        )}
      </Stack>
    </Card>
  )
}

export function TrustLayout(props: {
  title?: string
  text?: string
  benefits?: string[]
  mediaSrc?: string
  mediaVideoSrc?: string
  researchSlides?: Array<{
    text: string
    source: string
  }>
  progressPercent: number
  onNext: () => void
  onBack: () => void
}) {
  const [researchSlideIndex, setResearchSlideIndex] = createSignal(0)
  const slides = props.researchSlides ?? []
  const hasResearchSlides = slides.length > 0

  const goResearchSlide = (index: number) => {
    if (!hasResearchSlides) return
    const next = Math.max(0, Math.min(index, slides.length - 1))
    setResearchSlideIndex(next)
  }
  const currentResearchSlide = hasResearchSlides ? slides[researchSlideIndex()] : undefined

  return (
    <Card>
      <div class={hasResearchSlides ? 'quiz-transition-screen is-research' : 'quiz-transition-screen'}>
        <Stack>
          <QuizHeader
            progressPercent={props.progressPercent}
            onBack={props.onBack}
          />
          {props.mediaVideoSrc ? (
            <video
              class="quiz-trust-video"
              src={props.mediaVideoSrc}
              autoplay
              muted
              loop
              playsinline
              preload="metadata"
            />
          ) : props.mediaSrc ? <img class="quiz-trust-photo" src={props.mediaSrc} alt="" aria-hidden="true" /> : null}
          {props.title ? <Title text={props.title} /> : null}
          {props.text && !hasResearchSlides ? <Subtitle text={props.text} /> : null}

          {hasResearchSlides ? (
            <div class="quiz-research-slider">
              <div class="quiz-research-stage">
                <button
                  type="button"
                  class="quiz-research-nav"
                  aria-label="Предыдущий слайд"
                  disabled={researchSlideIndex() === 0}
                  onClick={() => goResearchSlide(researchSlideIndex() - 1)}
                >
                  <span class="quiz-research-nav-icon" aria-hidden="true" />
                </button>

                <div class="quiz-research-copy">
                  <p class="quiz-research-text">{currentResearchSlide?.text}</p>
                  <p class="quiz-research-source">{currentResearchSlide?.source}</p>
                </div>

                <button
                  type="button"
                  class="quiz-research-nav is-next"
                  aria-label="Следующий слайд"
                  disabled={researchSlideIndex() === slides.length - 1}
                  onClick={() => goResearchSlide(researchSlideIndex() + 1)}
                >
                  <span class="quiz-research-nav-icon" aria-hidden="true" />
                </button>
              </div>

              <div class="quiz-research-dots">
                {slides.map((_, index) => (
                  <button
                    type="button"
                    class={index === researchSlideIndex() ? 'quiz-research-dot is-active' : 'quiz-research-dot'}
                    aria-label={`Слайд ${index + 1}`}
                    onClick={() => goResearchSlide(index)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div class="quiz-benefit-list" role="list">
              {props.benefits?.map((item, index) => (
                <p class="quiz-benefit-item" role="listitem" style={{ '--benefit-delay': `${index * 220}ms` }}>
                  <span class="quiz-benefit-check" aria-hidden="true" />
                  <span class="quiz-benefit-text">{item}</span>
                </p>
              ))}
            </div>
          )}

          <div class="quiz-actions">
            <Button label="Продолжить" onClick={props.onNext} />
          </div>
        </Stack>
      </div>
    </Card>
  )
}

export function LoaderLayout(props: {
  title?: string
  text?: string
  steps: string[]
  buttonText?: string
  progressPercent: number
  onNext: () => void
  onBack: () => void
}) {
  const hasPlanSteps = props.steps.length > 0

  return (
    <Card>
      <Stack>
        <QuizHeader
          progressPercent={props.progressPercent}
          onBack={props.onBack}
        />
        {props.title ? <Title text={props.title} /> : null}
        {props.text ? <Subtitle text={props.text} /> : null}

        {hasPlanSteps ? (
          <div class="quiz-plan-loader" aria-label="Сбор персонального плана">
            <div class="quiz-plan-indicator" aria-hidden="true">
              <span class="quiz-plan-ring" />
              <span class="quiz-plan-core">
                <span class="quiz-plan-percent">
                  <span class="quiz-plan-percent-value is-one">24%</span>
                  <span class="quiz-plan-percent-value is-two">57%</span>
                  <span class="quiz-plan-percent-value is-three">86%</span>
                  <span class="quiz-plan-percent-value is-four">100%</span>
                </span>
              </span>
            </div>

            <div class="quiz-plan-status-list">
              {props.steps.map((step, index) => (
                <div
                  class={index === props.steps.length - 1 ? 'quiz-plan-status is-last' : 'quiz-plan-status'}
                  style={{ '--step-delay': `${index * 1000}ms` }}
                >
                  <span class="quiz-plan-status-dot" aria-hidden="true" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div class="quiz-hero">
            <Subtitle text="Анализируем ваши ответы и готовим персональные рекомендации" />
          </div>
        )}

        {!hasPlanSteps ? (
          <div class="quiz-actions">
            <Button label={props.buttonText ?? 'Продолжить'} onClick={props.onNext} />
          </div>
        ) : null}
      </Stack>
    </Card>
  )
}

export function LeadGateLayout(props: {
  title?: string
  text?: string
  name: string
  email: string
  consentAccepted: boolean
  legalLinks: { offer: string; privacy: string; personal_data: string }
  progressPercent: number
  issues: ValidationIssue[]
  onNameInput: (value: string) => void
  onEmailInput: (value: string) => void
  onConsentToggle: (checked: boolean) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Card>
      <div class="quiz-lead-gate-enter">
        <Stack>
          <QuizHeader
            progressPercent={props.progressPercent}
            onBack={props.onBack}
          />
          {props.title ? <Title text={props.title} /> : null}
          {props.text ? <Subtitle text={props.text} /> : null}

          <Input
            value={props.name}
            placeholder="Ваше имя"
            autoComplete="name"
            name="name"
            onInput={props.onNameInput}
          />
          <Input
            type="email"
            value={props.email}
            placeholder="Ваша почта"
            autoComplete="email"
            name="email"
            onInput={props.onEmailInput}
          />

          <Checkbox
            checked={props.consentAccepted}
            label="Я согласна на обработку персональных данных"
            onToggle={props.onConsentToggle}
          />

          <LegalLinks
            offer={props.legalLinks.offer}
            privacy={props.legalLinks.privacy}
            personalData={props.legalLinks.personal_data}
          />

          {props.issues.map((issue) => (
            <ErrorText text={issue.message} />
          ))}

          <StickyCta>
            <div class="quiz-actions">
              <Button label="Открыть результат" onClick={props.onNext} />
            </div>
          </StickyCta>
        </Stack>
      </div>
    </Card>
  )
}

export function ResultLayout(props: {
  title: string
  name: string
  currentImage: string
  targetImage: string
  currentWeight: number
  targetWeight: number
  weightDiff: number
  weightLoss: boolean
  inputs: ResultInput[]
  calorieNorm: number
  protein: number
  fat: number
  carbs: number
  bmi: number
  bmiLabel: string
  programs: ResultProgram[]
  progressPercent: number
  onOpenPaywall: () => void
  onBack: () => void
}) {
  const bmiMarker = Math.max(4, Math.min(96, ((props.bmi - 15) / 25) * 100))
  const [isCurrentImageBroken, setIsCurrentImageBroken] = createSignal(false)
  const [isTargetImageBroken, setIsTargetImageBroken] = createSignal(false)
  const hasWeightDiff = props.weightDiff > 0
  const goalDeltaPrefix = props.weightLoss ? '-' : '+'
  const displayName = props.name || 'Ваш план'
  const resultTitleMain = props.name ? `${displayName}, вот ваш план:` : 'Ваш план:'
  const [brokenProgramImages, setBrokenProgramImages] = createSignal<Record<string, boolean>>({})
  const [showProgramsLeftArrow, setShowProgramsLeftArrow] = createSignal(false)
  const isProgramImageBroken = (id: string) => Boolean(brokenProgramImages()[id])
  const markProgramImageBroken = (id: string) => {
    setBrokenProgramImages((prev) => ({ ...prev, [id]: true }))
  }
  let programsListRef: HTMLDivElement | undefined
  let dragPointerId: number | undefined
  let dragStartX = 0
  let dragStartScrollLeft = 0

  const syncProgramsArrows = () => {
    if (!programsListRef) return
    setShowProgramsLeftArrow(programsListRef.scrollLeft > 8)
  }

  const scrollProgramsLeft = () => {
    if (!programsListRef) return
    const shift = Math.max(220, Math.round(programsListRef.clientWidth * 0.82))
    programsListRef.scrollBy({ left: -shift, behavior: 'smooth' })
    setTimeout(syncProgramsArrows, 280)
  }

  const scrollProgramsRight = () => {
    if (!programsListRef) return
    const shift = Math.max(220, Math.round(programsListRef.clientWidth * 0.82))
    programsListRef.scrollBy({ left: shift, behavior: 'smooth' })
    setTimeout(syncProgramsArrows, 280)
  }

  const onProgramsPointerDown = (event: PointerEvent) => {
    if (!programsListRef) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    event.preventDefault()

    dragPointerId = event.pointerId
    dragStartX = event.clientX
    dragStartScrollLeft = programsListRef.scrollLeft
    programsListRef.setPointerCapture(event.pointerId)
    programsListRef.classList.add('is-dragging')
  }

  const onProgramsPointerMove = (event: PointerEvent) => {
    if (!programsListRef || dragPointerId !== event.pointerId) return
    event.preventDefault()
    const deltaX = event.clientX - dragStartX
    programsListRef.scrollLeft = dragStartScrollLeft - deltaX
    syncProgramsArrows()
  }

  const onProgramsPointerEnd = (event: PointerEvent) => {
    if (!programsListRef || dragPointerId !== event.pointerId) return
    if (programsListRef.hasPointerCapture(event.pointerId)) {
      programsListRef.releasePointerCapture(event.pointerId)
    }
    programsListRef.classList.remove('is-dragging')
    dragPointerId = undefined
    syncProgramsArrows()
  }

  return (
    <Card class="result-page">
      <Stack>
        <QuizHeader
          progressPercent={props.progressPercent}
          onBack={props.onBack}
        />

        <div class="result-screen">
          <section class="result-showcase">
            <div class="result-showcase-main">
              <header class="result-intro">
                <h2 class="result-title" aria-label={props.title}>
                  <span class="result-title-main">{resultTitleMain}</span>
                  <span class="result-title-line">с <strong>{props.currentWeight}</strong> до <strong>{props.targetWeight}</strong> кг</span>
                </h2>
                <p class="result-lead">Мы собрали ориентир по тренировкам и питанию на основе ваших ответов.</p>
              </header>

              <section class="result-hero">
                <h3 class="result-hero-title">Ваш путь к цели</h3>
                <div class="result-journey">
                  <div class="result-journey-stat is-current">
                    <span class="result-journey-caption">Сейчас</span>
                    <span class="result-journey-weight">{props.currentWeight}<span class="result-journey-unit">кг</span></span>
                  </div>
                  <div class="result-journey-stat is-target">
                    <span class="result-journey-caption">Цель</span>
                    <span class="result-journey-weight">{props.targetWeight}<span class="result-journey-unit">кг</span></span>
                  </div>

                  <img class="result-journey-arc" src="/assets/quiz/result/duga.svg" alt="" loading="lazy" decoding="async" aria-hidden="true" />

                  <div class="result-journey-figures" aria-hidden="true">
                    <span class="result-journey-figure is-current">
                      {!isCurrentImageBroken() ? (
                        <img
                          class="result-journey-image"
                          src={props.currentImage}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          onError={() => setIsCurrentImageBroken(true)}
                        />
                      ) : null}
                      <span class={isCurrentImageBroken() ? 'result-journey-placeholder' : 'result-journey-placeholder is-hidden'}>
                        <span class="result-journey-silhouette is-current" />
                      </span>
                    </span>
                    <span class="result-journey-figure is-target">
                      {!isTargetImageBroken() ? (
                        <img
                          class="result-journey-image"
                          src={props.targetImage}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          onError={() => setIsTargetImageBroken(true)}
                        />
                      ) : null}
                      <span class={isTargetImageBroken() ? 'result-journey-placeholder' : 'result-journey-placeholder is-hidden'}>
                        <span class="result-journey-silhouette is-target" />
                      </span>
                    </span>
                  </div>

                  <svg class="result-journey-arrow" viewBox="0 0 100 60" aria-hidden="true">
                    <path d="M 12 39 C 33 21, 57 21, 80 28" fill="none" stroke="currentColor" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M 74 20 L 92 28 L 74 36" fill="none" stroke="currentColor" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <div class="result-journey-goal">
                    <span class="result-journey-goal-label">Цель:</span>
                    {hasWeightDiff ? (
                      <span class="result-journey-goal-value">{goalDeltaPrefix}{props.weightDiff}<span class="result-journey-goal-unit">кг</span></span>
                    ) : (
                      <span class="result-journey-goal-note">сохранить форму</span>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <aside class="result-showcase-aside" aria-hidden="true">
              <img class="result-showcase-photo" src="/assets/quiz/result/usmanova_result.png" alt="" loading="lazy" decoding="async" />
            </aside>
          </section>

          {props.inputs.length > 0 ? (
            <section class="result-card">
              <h3 class="result-card-title">Ваши вводные</h3>
              <p class="result-card-note">На их основе мы собрали персональный план.</p>
              <div class="result-inputs">
                {props.inputs.map((item) => (
                  <div class="result-input-chip">
                    <span class="result-input-icon" aria-hidden="true">
                      <ResultInputIcon label={item.label} />
                    </span>
                    <span class="result-input-label">{item.label}</span>
                    <span class="result-input-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div class="result-metrics-grid">
            <section class="result-card result-nutrition-card">
              <div class="result-card-heading">
                <span class="result-card-icon is-plate" aria-hidden="true" />
                <h3 class="result-card-title">Ориентир по питанию</h3>
              </div>
              <span class="result-nutrition-decor" aria-hidden="true" />
              <div class="result-calories">
                <span class="result-calories-value">{props.calorieNorm}</span>
                <span class="result-calories-unit">ккал в день</span>
              </div>
              <div class="result-macros">
                <div class="result-macro is-protein">
                  <span class="result-macro-label">Белки</span>
                  <span class="result-macro-value">{props.protein} г</span>
                </div>
                <div class="result-macro is-fat">
                  <span class="result-macro-label">Жиры</span>
                  <span class="result-macro-value">{props.fat} г</span>
                </div>
                <div class="result-macro is-carbs">
                  <span class="result-macro-label">Углеводы</span>
                  <span class="result-macro-value">{props.carbs} г</span>
                </div>
              </div>
              <p class="result-card-note">Это ориентир для старта. Точные значения можно корректировать по самочувствию и динамике.</p>
            </section>

            <section class="result-card result-bmi-card">
              <div class="result-card-heading">
                <span class="result-card-icon is-bmi" aria-hidden="true" />
                <h3 class="result-card-title">Индекс массы тела</h3>
              </div>
              <div class="result-bmi-summary">
                <span class="result-bmi-value">{props.bmi}</span>
                <span class="result-bmi-status">{props.bmiLabel}</span>
              </div>
              <div class="result-bmi-scale" aria-hidden="true">
                <div class="result-bmi-track" />
                <span class="result-bmi-marker" style={{ left: `${bmiMarker.toFixed(1)}%` }} />
              </div>
              <div class="result-bmi-legend">
                <span>Низкий</span>
                <span>Норма</span>
                <span>Выше</span>
                <span>Высокий</span>
              </div>
              <p class="result-card-note">Используем этот показатель как ориентир для подбора комфортной нагрузки.</p>
            </section>
          </div>

          <section class="result-programs">
            <h3 class="result-card-title">Подборка программ для вас</h3>
            <p class="result-programs-subtitle">Мы выбрали программы под вашу цель, зоны и формат тренировок.</p>
            <div class="result-programs-carousel">
              <div
                class="result-programs-list"
                ref={(element: HTMLDivElement) => {
                  programsListRef = element
                  syncProgramsArrows()
                }}
                onScroll={syncProgramsArrows}
                onPointerDown={onProgramsPointerDown}
                onPointerMove={onProgramsPointerMove}
                onPointerUp={onProgramsPointerEnd}
                onPointerCancel={onProgramsPointerEnd}
                onPointerLeave={onProgramsPointerEnd}
              >
              {props.programs.map((program) => (
                <article class="result-program" draggable={false}>
                  <div class="result-program-image-wrap" aria-hidden="true">
                    {!isProgramImageBroken(program.id) ? (
                      <img
                        class="result-program-image"
                        src={program.localImage}
                        alt={program.title}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        data-fallback="0"
                        onDragStart={(event: DragEvent) => event.preventDefault()}
                        onError={(event: Event) => {
                          const image = event.currentTarget as HTMLImageElement
                          if (image.dataset.fallback !== '1') {
                            image.dataset.fallback = '1'
                            image.src = program.imageUrl
                            return
                          }

                          markProgramImageBroken(program.id)
                        }}
                      />
                    ) : null}

                    <span class={isProgramImageBroken(program.id) ? 'result-program-fallback' : 'result-program-fallback is-hidden'}>
                      <span class="result-program-fallback-icon">
                        <ResultProgramIcon title={program.title} />
                      </span>
                      <span class="result-program-fallback-title">{program.title}</span>
                    </span>
                  </div>

                  <div class="result-program-copy">
                    <div class="result-program-badges">
                      <span class="result-program-badge is-type">{program.type}</span>
                    </div>
                    <h4 class="result-program-title">{program.title}</h4>
                    <p class="result-program-reason">{program.description}</p>
                  </div>
                </article>
              ))}
              </div>
              <button
                type="button"
                class={showProgramsLeftArrow() ? 'result-programs-arrow is-left is-visible' : 'result-programs-arrow is-left'}
                aria-label="Прокрутить программы влево"
                onClick={scrollProgramsLeft}
              >
                <span class="result-programs-arrow-icon" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="result-programs-arrow"
                aria-label="Прокрутить программы вправо"
                onClick={scrollProgramsRight}
              >
                <span class="result-programs-arrow-icon" aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>

        <StickyCta>
          <div class="quiz-actions">
            <Button label="Открыть доступ к программам" onClick={props.onOpenPaywall} />
          </div>
        </StickyCta>
      </Stack>
    </Card>
  )
}

function ResultInputIcon(props: { label: string }) {
  if (props.label === 'Цель') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    )
  }

  if (props.label === 'Зоны') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3c2 2 6 2 8 0" />
        <path d="M7 5c1 4 1 10-1 16" />
        <path d="M17 5c-1 4-1 10 1 16" />
        <path d="M8 13c2 1 6 1 8 0" />
      </svg>
    )
  }

  if (props.label === 'Формат') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11l8-7 8 7" />
        <path d="M6 10v10h12V10" />
        <path d="M10 20v-6h4v6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 20V10" />
      <path d="M12 20V5" />
      <path d="M18 20v-8" />
      <path d="M4 20h16" />
    </svg>
  )
}

function ResultProgramIcon(props: { title: string }) {
  if (props.title.includes('Живот') || props.title.includes('талия')) {
    return (
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <path d="M22 8c3 3 9 3 12 0" />
        <path d="M20 12c2 9 2 22-3 34" />
        <path d="M36 12c-2 9-2 22 3 34" />
        <path d="M20 31c5 3 11 3 16 0" />
      </svg>
    )
  }

  if (props.title.includes('Ягодицы') || props.title.includes('ног')) {
    return (
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <path d="M18 16c4 8 4 22-2 32" />
        <path d="M38 16c-4 8-4 22 2 32" />
        <path d="M18 22c6 6 14 6 20 0" />
        <path d="M22 38c4 3 8 3 12 0" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 56 56" aria-hidden="true">
      <path d="M17 36l22-22" />
      <path d="M13 32l11 11" />
      <path d="M32 13l11 11" />
      <path d="M9 36l11 11" />
      <path d="M36 9l11 11" />
    </svg>
  )
}

const PAYWALL_INCLUDES = [
  { title: 'Программы Кати Усмановой', text: 'Тренировки для дома и зала под разные цели: стройность, тонус, живот, талия, ягодицы и всё тело.' },
  { title: 'Маршрут под вашу цель', text: 'Начните с программ, которые подходят под ваши ответы в квизе.' },
  { title: 'Помощник по питанию', text: 'Помогает проще ориентироваться в питании без жёстких диет и сложных таблиц.' },
  { title: 'Каталог тренировок', text: 'Можно менять направление и постепенно подключать новые программы.' },
  { title: 'Бережный старт', text: 'Подходит, если вы начинаете с нуля или возвращаетесь после перерыва.' },
]

const PAYWALL_FACTS = [
  'Вице-чемпионка мира и чемпионка России по фитнес-бикини',
  'Профессиональный тренер с опытом более 15 лет',
  'Автор первых в России масштабных марафонов стройности',
  'Программы для дома и зала, подход без перегруза',
]

const PAYWALL_GALLERY = [
  '/assets/quiz/trust/gallery/student-01.jpg',
  '/assets/quiz/trust/gallery/student-02.jpg',
  '/assets/quiz/trust/gallery/student-03.jpg',
  '/assets/quiz/trust/gallery/student-04.jpg',
  '/assets/quiz/trust/gallery/student-05.jpg',
  '/assets/quiz/trust/gallery/student-06.jpg',
  '/assets/quiz/trust/gallery/student-07.jpg',
  '/assets/quiz/trust/gallery/student-08.jpg',
  '/assets/quiz/trust/gallery/student-09.jpg',
  '/assets/quiz/trust/gallery/student-10.jpg',
  '/assets/quiz/trust/gallery/student-11.jpg',
  '/assets/quiz/trust/gallery/student-12.jpg',
  '/assets/quiz/trust/gallery/student-13.jpg',
  '/assets/quiz/trust/gallery/student-14.jpg',
]

const PAYWALL_SAFETY = [
  { title: 'Безопасная оплата', text: 'Платёж проходит через защищённую форму.' },
  { title: 'Доступ после оплаты', text: 'После оформления вы получите доступ к программам.' },
  { title: 'Подписку можно отключить', text: 'Отключение доступно в личном кабинете.' },
  { title: 'Юридические документы', text: 'Оферта и правила обработки данных доступны ниже.' },
]

const PAYWALL_FAQ = [
  { q: 'Что входит в подписку?', a: 'В подписку входят программы Кати Усмановой, каталог тренировок и помощник по питанию.' },
  { q: 'Подойдёт ли мне, если я начинаю с нуля?', a: 'Да. Можно начать с мягких программ и постепенно привыкать к нагрузке.' },
  { q: 'Где проходят тренировки?', a: 'В подписке есть программы для дома и зала. Подборка учитывает выбранный вами формат.' },
  { q: 'Как работает автопродление?', a: 'После пробного периода или оплаченного срока подписка продлевается автоматически по условиям выбранного тарифа.' },
  { q: 'Можно ли отключить подписку?', a: 'Да. Подписку можно отключить в личном кабинете.' },
  { q: 'Когда я получу доступ?', a: 'После оплаты доступ открывается через систему оформления заказа.' },
  { q: 'Что делать, если нагрузка покажется сложной?', a: 'Начинайте с мягких программ и выбирайте посильный темп. План используется как ориентир, а не как жёсткое обязательство.' },
]

const PAYWALL_TARIFF_NOTE: Record<string, string> = {
  'Лёгкий старт': 'Подходит, чтобы попробовать программы и начать без долгого обязательства.',
  'Популярно': 'Оптимальный вариант, чтобы втянуться и пройти первые программы.',
  'Хит продаж': 'Для спокойной работы над результатом без спешки.',
}

function PaywallIncludeIcon(props: { index: number }) {
  if (props.index === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5z" /><path d="M9 9h7M9 13h7M9 17h4" /></svg>
    )
  }
  if (props.index === 1) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19l5-5 4 4 5-9" /><circle cx="10" cy="14" r="1" /><circle cx="14" cy="18" r="1" /></svg>
    )
  }
  if (props.index === 2) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7a5 5 0 0 0 10 0V3" /><path d="M12 15v6" /><path d="M8 21h8" /></svg>
    )
  }
  if (props.index === 3) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" /></svg>
  )
}

function PaywallSafetyIcon(props: { index: number }) {
  if (props.index === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V8a4 4 0 0 1 8 0v2" /><circle cx="12" cy="15" r="1" /></svg>
    )
  }
  if (props.index === 1) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
    )
  }
  if (props.index === 2) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 16h5" /></svg>
  )
}

export function PaywallLayout(props: {
  topFocus?: string
  requiredBlocks: string[]
  tariffs: TariffConfig[]
  legalLinks: { offer: string; privacy: string; personal_data: string }
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
  getCourseEmbedBlock: unknown
  onBack: () => void
}) {
  const [selectedTariff, setSelectedTariff] = createSignal<string>('Популярно')
  const [brokenProgramImages, setBrokenProgramImages] = createSignal<Record<string, boolean>>({})
  const [brokenGallery, setBrokenGallery] = createSignal<Record<number, boolean>>({})
  const [showGalleryLeftArrow, setShowGalleryLeftArrow] = createSignal(false)
  const [isHeroBroken, setIsHeroBroken] = createSignal(false)
  const [isProofBroken, setIsProofBroken] = createSignal(false)

  let tariffsRef: HTMLElement | undefined
  let formRef: HTMLElement | undefined
  let programsListRef: HTMLDivElement | undefined
  let galleryListRef: HTMLDivElement | undefined

  const safeName = props.name && props.name.trim() ? props.name.trim() : ''
  const current = Number.isFinite(props.currentWeight) && props.currentWeight > 0 ? props.currentWeight : 0
  const target = Number.isFinite(props.targetWeight) && props.targetWeight > 0 ? props.targetWeight : current
  const isLoss = current > 0 && target < current
  const isGain = current > 0 && target > current

  const heading = safeName ? `${safeName}, ваш план готов` : 'Ваш план готов'
  const orientir = isLoss
    ? `Похудеть до ${target} кг и сохранить форму`
    : isGain
      ? `Набрать до ${target} кг и сохранить форму`
      : `Сохранить вес ${target} кг и улучшить форму`

  const scrollTo = (element?: HTMLElement) => {
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const onSelectTariff = (name: string) => {
    setSelectedTariff(name)
    scrollTo(formRef)
  }
  const scrollPrograms = (direction: -1 | 1) => {
    if (!programsListRef) return
    const shift = Math.max(220, Math.round(programsListRef.clientWidth * 0.82))
    programsListRef.scrollBy({ left: shift * direction, behavior: 'smooth' })
  }
  const getGallerySnapStep = (): number => {
    if (!galleryListRef) return 0
    const firstCard = galleryListRef.querySelector<HTMLElement>('.paywall-gallery-item')
    if (!firstCard) return 0

    const styles = getComputedStyle(galleryListRef)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0')
    return firstCard.offsetWidth + (Number.isFinite(gap) ? gap : 0)
  }
  const syncGalleryArrows = () => {
    if (!galleryListRef) return
    setShowGalleryLeftArrow(galleryListRef.scrollLeft > 8)
  }
  const scrollGallery = (direction: -1 | 1) => {
    if (!galleryListRef) return

    const step = getGallerySnapStep()
    if (step > 0) {
      const currentIndex = Math.round(galleryListRef.scrollLeft / step)
      const targetIndex = Math.max(0, currentIndex + direction)
      galleryListRef.scrollTo({ left: targetIndex * step, behavior: 'auto' })
      setTimeout(syncGalleryArrows, 240)
      return
    }

    const shift = Math.max(220, Math.round(galleryListRef.clientWidth * 0.82))
    galleryListRef.scrollBy({ left: shift * direction, behavior: 'smooth' })
    setTimeout(syncGalleryArrows, 240)
  }
  const isProgramImageBroken = (id: string) => Boolean(brokenProgramImages()[id])
  const markProgramImageBroken = (id: string) => {
    setBrokenProgramImages((prev) => ({ ...prev, [id]: true }))
  }
  const isGalleryBroken = (index: number) => Boolean(brokenGallery()[index])
  const markGalleryBroken = (index: number) => {
    setBrokenGallery((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <Card>
      <Stack>
        <QuizHeader progressPercent={props.progressPercent} onBack={props.onBack} />

        <div class="paywall">
          <section class="paywall-hero">
            <div class="paywall-hero-photo">
              {!isHeroBroken() ? (
                <img
                  src="/assets/quiz/result/usmanova_result.png"
                  alt="Екатерина Усманова"
                  loading="lazy"
                  decoding="async"
                  onError={() => setIsHeroBroken(true)}
                />
              ) : null}
            </div>
            <div class="paywall-hero-copy">
              <h2 class="paywall-hero-title">{heading}</h2>
              <p class="paywall-hero-sub">Получите доступ к программам Кати Усмановой, помощнику по питанию и тренировкам, которые подходят под вашу цель.</p>
              <p class="paywall-hero-orientir">
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    display: 'inline-flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'border-radius': '999px',
                    background: 'rgba(255,255,255,0.82)',
                    color: 'var(--primary)',
                    'flex-shrink': 0,
                  }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" style={{ width: '12px', height: '12px', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }}>
                    <circle cx="12" cy="12" r="7" />
                    <circle cx="12" cy="12" r="2.5" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                  </svg>
                </span>
                <span>{orientir}</span>
              </p>
              <div class="paywall-chips">
                <span class="paywall-chip">Программы</span>
                <span class="paywall-chip">Питание</span>
                <span class="paywall-chip">Под вашу цель</span>
              </div>
              <button type="button" class="paywall-cta" onClick={() => scrollTo(tariffsRef)}>Выбрать доступ</button>
            </div>
          </section>

          <section class="paywall-section paywall-proof">
            <h3 class="paywall-h">С Катей уже тренируются сотни тысяч женщин</h3>
            <div class="paywall-proof-top">
              {!isProofBroken() ? (
                <img class="paywall-proof-photo" src="/assets/quiz/hero/hero.jpg" alt="Екатерина Усманова" loading="lazy" decoding="async" onError={() => setIsProofBroken(true)} />
              ) : <span class="paywall-proof-photo" aria-hidden="true" />}
              <div class="paywall-proof-count">
                <strong>580 000+</strong>
                <span>женщин занимаются по программам Кати Усмановой</span>
              </div>
            </div>
            <div class="paywall-facts">
              {PAYWALL_FACTS.map((fact) => (
                <span class="paywall-fact">
                  <span class="paywall-fact-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg></span>
                  <span>{fact}</span>
                </span>
              ))}
            </div>
            <div class="paywall-gallery-head">Результаты участниц</div>
            <p class="paywall-gallery-hint">Реальные фотографии участниц программ Кати Усмановой.</p>
            <div class="result-programs-carousel">
              <div
                class="paywall-gallery"
                ref={(element: HTMLDivElement) => {
                  galleryListRef = element
                  syncGalleryArrows()
                }}
                onScroll={syncGalleryArrows}
              >
                {PAYWALL_GALLERY.map((src, index) => (
                  !isGalleryBroken(index) ? (
                    <div class="paywall-gallery-item">
                      <span class="paywall-gallery-badge">До и после</span>
                      <img src={src} alt="Результат участницы" loading="lazy" decoding="async" onError={() => markGalleryBroken(index)} />
                    </div>
                  ) : null
                ))}
              </div>
              <button
                type="button"
                class={showGalleryLeftArrow() ? 'result-programs-arrow is-left is-visible' : 'result-programs-arrow is-left'}
                aria-label="Прокрутить истории влево"
                onClick={() => scrollGallery(-1)}
              >
                <span class="result-programs-arrow-icon" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="result-programs-arrow"
                aria-label="Прокрутить истории вправо"
                onClick={() => scrollGallery(1)}
              >
                <span class="result-programs-arrow-icon" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section class="paywall-section" ref={(element: HTMLElement) => { tariffsRef = element }}>
            <h3 class="paywall-h">Выберите формат доступа</h3>
            <p class="paywall-sub">Подписку можно отключить в личном кабинете.</p>
            <div class="paywall-tariffs">
              {props.tariffs.map((tariff) => {
                const isPopular = tariff.name === 'Популярно'
                const isHit = tariff.name === 'Хит продаж'
                return (
                  <div class={`paywall-tariff${isPopular ? ' is-popular' : ''}${selectedTariff() === tariff.name ? ' is-selected' : ''}`}>
                    <div class="paywall-tariff-head">
                      <span class="paywall-tariff-name">{tariff.name}</span>
                      {isPopular ? <span class="paywall-badge is-soft">Рекомендуем</span> : null}
                      {isHit ? <span class="paywall-badge">Хит продаж</span> : null}
                    </div>
                    <div class="paywall-tariff-price">
                      <span class="paywall-price-now">{tariff.price} руб</span>
                      <span class="paywall-price-old">{tariff.old_price} руб</span>
                    </div>
                    <div class="paywall-tariff-period">Период: {tariff.period}</div>
                    {tariff.renewal ? <div class="paywall-tariff-renewal">{tariff.renewal}</div> : null}
                    {PAYWALL_TARIFF_NOTE[tariff.name] ? <div class="paywall-tariff-note">{PAYWALL_TARIFF_NOTE[tariff.name]}</div> : null}
                    <button type="button" class="paywall-tariff-btn" onClick={() => onSelectTariff(tariff.name)}>Выбрать тариф</button>
                  </div>
                )
              })}
            </div>
          </section>

          <section class="paywall-section">
            <h3 class="paywall-h">Что входит в доступ</h3>
            <p class="paywall-sub">Внутри программы и инструменты, которые помогут начать по вашему маршруту.</p>
            <div class="paywall-includes">
              {PAYWALL_INCLUDES.map((item, index) => (
                <article class="paywall-include">
                  <span class="paywall-include-icon" aria-hidden="true"><PaywallIncludeIcon index={index} /></span>
                  <div>
                    <h4 class="paywall-include-title">{item.title}</h4>
                    <p class="paywall-include-text">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section class="paywall-section">
            <h3 class="paywall-h">Программы, которые подойдут вам</h3>
            <p class="paywall-sub">Мы выбрали их по вашей цели, зонам и формату тренировок.</p>
            <div class="result-programs-carousel">
              <div class="result-programs-list" ref={(element: HTMLDivElement) => { programsListRef = element }}>
                {props.programs.map((program) => (
                  <article class="result-program" draggable={false}>
                    <div class="result-program-image-wrap" aria-hidden="true">
                      {!isProgramImageBroken(program.id) ? (
                        <img
                          class="result-program-image"
                          src={program.localImage}
                          alt={program.title}
                          draggable={false}
                          loading="lazy"
                          decoding="async"
                          data-fallback="0"
                          onError={(event: Event) => {
                            const image = event.currentTarget as HTMLImageElement
                            if (image.dataset.fallback !== '1') {
                              image.dataset.fallback = '1'
                              image.src = program.imageUrl
                              return
                            }
                            markProgramImageBroken(program.id)
                          }}
                        />
                      ) : null}
                      <span class={isProgramImageBroken(program.id) ? 'result-program-fallback' : 'result-program-fallback is-hidden'}>
                        <span class="result-program-fallback-icon"><ResultProgramIcon title={program.title} /></span>
                        <span class="result-program-fallback-title">{program.title}</span>
                      </span>
                    </div>
                    <div class="result-program-copy">
                      <div class="result-program-badges">
                        <span class="result-program-badge is-type">{program.type}</span>
                      </div>
                      <h4 class="result-program-title">{program.title}</h4>
                      <p class="result-program-reason">{program.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              <button type="button" class="result-programs-arrow is-left is-visible" aria-label="Прокрутить программы влево" onClick={() => scrollPrograms(-1)}>
                <span class="result-programs-arrow-icon" aria-hidden="true" />
              </button>
              <button type="button" class="result-programs-arrow" aria-label="Прокрутить программы вправо" onClick={() => scrollPrograms(1)}>
                <span class="result-programs-arrow-icon" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section class="paywall-section" ref={(element: HTMLElement) => { formRef = element }}>
            <h3 class="paywall-h">Оформление доступа</h3>
            <p class="paywall-sub">Заполните форму ниже, чтобы перейти к оплате.</p>
            {props.getCourseEmbedBlock}
          </section>

          <section class="paywall-section">
            <h3 class="paywall-h">Оплата и доступ безопасны</h3>
            <div class="paywall-safety">
              {PAYWALL_SAFETY.map((item, index) => (
                <div class="paywall-safe">
                  <span class="paywall-safe-icon" aria-hidden="true"><PaywallSafetyIcon index={index} /></span>
                  <h4 class="paywall-safe-title">{item.title}</h4>
                  <p class="paywall-safe-text">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section class="paywall-section">
            <h3 class="paywall-h">Частые вопросы</h3>
            <div class="paywall-faq">
              {PAYWALL_FAQ.map((item) => (
                <details class="paywall-faq-item">
                  <summary>{item.q}</summary>
                  <div class="paywall-faq-answer">{item.a}</div>
                </details>
              ))}
            </div>
          </section>

          <footer class="paywall-footer">
            <div class="paywall-requisites">
              <strong>ООО «Онлайн Фитнес»</strong>
              <span>ИНН 7734434533 · КПП 773401001 · ОГРН 1207700175209</span>
              <span>Москва, улица Щукинская, дом 2</span>
              <span>Служба заботы: help@usmanovasport.ru</span>
            </div>
            <LegalLinks
              offer={props.legalLinks.offer}
              privacy={props.legalLinks.privacy}
              personalData={props.legalLinks.personal_data}
            />
          </footer>
        </div>

        <div class="quiz-actions">
          <Button label="Назад" variant="secondary" onClick={props.onBack} />
        </div>
      </Stack>
    </Card>
  )
}
