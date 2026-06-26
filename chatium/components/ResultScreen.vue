<template>
  <div class="quiz-card result-page">
    <div class="quiz-stack">
      <QuizHeader :progress-percent="progressPercent" :on-back="onBack" />

      <div class="result-screen">
        <section class="result-showcase">
          <div class="result-showcase-main">
            <header class="result-intro">
              <h2 class="result-title" :aria-label="title">
                <span class="result-title-main">{{ resultTitleMain }}</span>
                <span class="result-title-line">с <strong>{{ currentWeight }}</strong> до <strong>{{ targetWeight }}</strong> кг</span>
              </h2>
              <p class="result-lead">Мы собрали ориентир по тренировкам и питанию на основе ваших ответов.</p>
            </header>

            <section class="result-hero">
              <h3 class="result-hero-title">Ваш путь к цели</h3>
              <div class="result-journey">
                <div class="result-journey-stat is-current">
                  <span class="result-journey-caption">Сейчас</span>
                  <span class="result-journey-weight">{{ currentWeight }}<span class="result-journey-unit">кг</span></span>
                </div>
                <div class="result-journey-stat is-target">
                  <span class="result-journey-caption">Цель</span>
                  <span class="result-journey-weight">{{ targetWeight }}<span class="result-journey-unit">кг</span></span>
                </div>

                <img class="result-journey-arc" src="/assets/quiz/result/duga.svg" alt="" loading="lazy" decoding="async" aria-hidden="true" />

                <div class="result-journey-figures" aria-hidden="true">
                  <span class="result-journey-figure is-current">
                    <img
                      v-if="!isCurrentImageBroken"
                      class="result-journey-image"
                      :src="currentImage"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      @error="isCurrentImageBroken = true"
                    />
                    <span :class="isCurrentImageBroken ? 'result-journey-placeholder' : 'result-journey-placeholder is-hidden'">
                      <span class="result-journey-silhouette is-current" />
                    </span>
                  </span>
                  <span class="result-journey-figure is-target">
                    <img
                      v-if="!isTargetImageBroken"
                      class="result-journey-image"
                      :src="targetImage"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      @error="isTargetImageBroken = true"
                    />
                    <span :class="isTargetImageBroken ? 'result-journey-placeholder' : 'result-journey-placeholder is-hidden'">
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
                  <span v-if="hasWeightDiff" class="result-journey-goal-value">{{ goalDeltaPrefix }}{{ weightDiff }}<span class="result-journey-goal-unit">кг</span></span>
                  <span v-else class="result-journey-goal-note">сохранить форму</span>
                </div>
              </div>
            </section>
          </div>

          <aside class="result-showcase-aside" aria-hidden="true">
            <img class="result-showcase-photo" src="/assets/quiz/result/usmanova_result.webp" alt="" loading="lazy" decoding="async" />
          </aside>
        </section>

        <section v-if="inputs.length > 0" class="result-card">
          <h3 class="result-card-title">Ваши вводные</h3>
          <p class="result-card-note">На их основе мы собрали персональный план.</p>
          <div class="result-inputs">
            <div v-for="item in inputs" :key="item.label" class="result-input-chip">
              <span class="result-input-icon" aria-hidden="true">
                <ResultInputIcon :label="item.label" />
              </span>
              <span class="result-input-label">{{ item.label }}</span>
              <span class="result-input-value">{{ item.value }}</span>
            </div>
          </div>
        </section>

        <div class="result-metrics-grid">
          <section class="result-card result-nutrition-card">
            <div class="result-card-heading">
              <span class="result-card-icon is-plate" aria-hidden="true" />
              <h3 class="result-card-title">Ориентир по питанию</h3>
            </div>
            <span class="result-nutrition-decor" aria-hidden="true" />
            <div class="result-calories">
              <span class="result-calories-value">{{ calorieNorm }}</span>
              <span class="result-calories-unit">ккал в день</span>
            </div>
            <div class="result-macros">
              <div class="result-macro is-protein">
                <span class="result-macro-label">Белки</span>
                <span class="result-macro-value">{{ protein }} г</span>
              </div>
              <div class="result-macro is-fat">
                <span class="result-macro-label">Жиры</span>
                <span class="result-macro-value">{{ fat }} г</span>
              </div>
              <div class="result-macro is-carbs">
                <span class="result-macro-label">Углеводы</span>
                <span class="result-macro-value">{{ carbs }} г</span>
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
              <span class="result-bmi-value">{{ bmi }}</span>
              <span class="result-bmi-status">{{ bmiLabel }}</span>
            </div>
            <div class="result-bmi-scale" aria-hidden="true">
              <div class="result-bmi-track" />
              <span class="result-bmi-marker" :style="{ left: `${bmiMarker.toFixed(1)}%` }" />
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
              ref="programsListRef"
              class="result-programs-list"
              @scroll="syncProgramsArrows"
              @dragstart.prevent
              @pointerdown="onProgramsPointerDown"
              @pointermove="onProgramsPointerMove"
              @pointerup="onProgramsPointerEnd"
              @pointercancel="onProgramsPointerEnd"
            >
              <article v-for="program in programs" :key="program.id" class="result-program" :draggable="false">
                <div class="result-program-image-wrap" aria-hidden="true">
                  <img
                    v-if="!isProgramImageBroken(program.id)"
                    class="result-program-image"
                    :src="program.localImage"
                    :alt="program.title"
                    :draggable="false"
                    loading="lazy"
                    decoding="async"
                    data-fallback="0"
                    @dragstart.prevent
                    @error="onProgramImageError($event, program)"
                  />
                  <span :class="isProgramImageBroken(program.id) ? 'result-program-fallback' : 'result-program-fallback is-hidden'">
                    <span class="result-program-fallback-icon">
                      <ResultProgramIcon :title="program.title" />
                    </span>
                    <span class="result-program-fallback-title">{{ program.title }}</span>
                  </span>
                </div>

                <div class="result-program-copy">
                  <div class="result-program-badges">
                    <span class="result-program-badge is-type">{{ program.type }}</span>
                  </div>
                  <h4 class="result-program-title">{{ program.title }}</h4>
                  <p class="result-program-reason">{{ program.description }}</p>
                </div>
              </article>
            </div>
            <button
              type="button"
              :class="showProgramsLeftArrow ? 'result-programs-arrow is-left is-visible' : 'result-programs-arrow is-left'"
              aria-label="Прокрутить программы влево"
              @click="scrollPrograms(-1)"
            >
              <span class="result-programs-arrow-icon" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="result-programs-arrow"
              aria-label="Прокрутить программы вправо"
              @click="scrollPrograms(1)"
            >
              <span class="result-programs-arrow-icon" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>

      <div class="quiz-sticky-cta">
        <div class="quiz-actions">
          <Button label="Открыть доступ к программам" @click="onOpenPaywall" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import QuizHeader from './QuizHeader.vue'
import Button from './Button.vue'
import ResultInputIcon from './ResultInputIcon.vue'
import ResultProgramIcon from './ResultProgramIcon.vue'
import type { ResultInput, ResultProgram } from '../../src/quiz/types'

const props = defineProps<{
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
}>()

const bmiMarker = computed(() => Math.max(4, Math.min(96, ((props.bmi - 15) / 25) * 100)))
const hasWeightDiff = computed(() => props.weightDiff > 0)
const goalDeltaPrefix = computed(() => (props.weightLoss ? '-' : '+'))
const displayName = computed(() => props.name || 'Ваш план')
const resultTitleMain = computed(() => (props.name ? `${displayName.value}, вот ваш план:` : 'Ваш план:'))

const isCurrentImageBroken = ref(false)
const isTargetImageBroken = ref(false)

const brokenProgramImages = reactive<Record<string, boolean>>({})
const isProgramImageBroken = (id: string) => Boolean(brokenProgramImages[id])

function onProgramImageError(event: Event, program: ResultProgram) {
  const image = event.currentTarget as HTMLImageElement
  if (image.dataset.fallback !== '1') {
    image.dataset.fallback = '1'
    image.src = program.imageUrl
    return
  }
  brokenProgramImages[program.id] = true
}

const programsListRef = ref<HTMLDivElement | null>(null)
const showProgramsLeftArrow = ref(false)

function syncProgramsArrows() {
  if (!programsListRef.value) return
  showProgramsLeftArrow.value = programsListRef.value.scrollLeft > 8
}

function getProgramsSnapStep(): number {
  if (!programsListRef.value) return 0
  const firstCard = programsListRef.value.querySelector<HTMLElement>('.result-program')
  if (!firstCard) return 0
  const styles = getComputedStyle(programsListRef.value)
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0')
  return firstCard.offsetWidth + (Number.isFinite(gap) ? gap : 0)
}

function getProgramsIndexBounds(step: number): number {
  if (!programsListRef.value || step <= 0) return 0
  const maxScroll = Math.max(0, programsListRef.value.scrollWidth - programsListRef.value.clientWidth)
  return Math.max(0, Math.round(maxScroll / step))
}

const programsDrag = {
  pointerId: undefined as number | undefined,
  startX: 0,
  startY: 0,
  startScrollLeft: 0,
  lastDeltaX: 0,
  active: false,
  rafId: null as number | null,
  nextScrollLeft: 0,
}

function onProgramsPointerDown(event: PointerEvent) {
  const list = programsListRef.value
  if (!list) return
  if (event.pointerType === 'mouse' && event.button !== 0) return

  programsDrag.pointerId = event.pointerId
  programsDrag.startX = event.clientX
  programsDrag.startY = event.clientY
  programsDrag.startScrollLeft = list.scrollLeft
  programsDrag.lastDeltaX = 0
  programsDrag.active = false

  if (programsDrag.rafId !== null) {
    cancelAnimationFrame(programsDrag.rafId)
    programsDrag.rafId = null
  }
}

function onProgramsPointerMove(event: PointerEvent) {
  const list = programsListRef.value
  if (!list || programsDrag.pointerId !== event.pointerId) return

  const deltaX = event.clientX - programsDrag.startX
  const deltaY = event.clientY - programsDrag.startY

  if (!programsDrag.active) {
    const passedThreshold = Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6
    if (!passedThreshold) return

    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      programsDrag.pointerId = undefined
      return
    }

    programsDrag.active = true
    list.setPointerCapture(event.pointerId)
    list.classList.add('is-dragging')
  }

  event.preventDefault()
  programsDrag.lastDeltaX = deltaX
  programsDrag.nextScrollLeft = programsDrag.startScrollLeft - deltaX

  if (programsDrag.rafId !== null) return
  programsDrag.rafId = requestAnimationFrame(() => {
    programsDrag.rafId = null
    list.scrollLeft = programsDrag.nextScrollLeft
    syncProgramsArrows()
  })
}

function snapProgramsToSlide(deltaX: number) {
  const list = programsListRef.value
  if (!list) return
  const step = getProgramsSnapStep()
  if (step <= 0) {
    syncProgramsArrows()
    return
  }

  const currentIndex = Math.round(list.scrollLeft / step)
  const startIndex = Math.round(programsDrag.startScrollLeft / step)
  const dragThreshold = Math.min(72, step * 0.22)
  const movedEnough = Math.abs(deltaX) >= dragThreshold
  let targetIndex = currentIndex

  if (movedEnough) {
    const direction = deltaX < 0 ? 1 : -1
    targetIndex = startIndex + direction
  }

  const maxIndex = getProgramsIndexBounds(step)
  targetIndex = Math.max(0, Math.min(maxIndex, targetIndex))
  list.scrollTo({ left: targetIndex * step, behavior: 'smooth' })
  setTimeout(syncProgramsArrows, 280)
}

function onProgramsPointerEnd(event: PointerEvent) {
  const list = programsListRef.value
  if (!list || programsDrag.pointerId !== event.pointerId) return

  if (programsDrag.rafId !== null) {
    cancelAnimationFrame(programsDrag.rafId)
    programsDrag.rafId = null
  }

  if (programsDrag.active && list.hasPointerCapture(event.pointerId)) {
    list.releasePointerCapture(event.pointerId)
  }

  list.classList.remove('is-dragging')
  const deltaX = programsDrag.lastDeltaX
  programsDrag.pointerId = undefined
  programsDrag.active = false

  snapProgramsToSlide(deltaX)
}

function scrollPrograms(direction: -1 | 1) {
  if (!programsListRef.value) return
  const step = getProgramsSnapStep()
  if (step > 0) {
    const currentIndex = Math.round(programsListRef.value.scrollLeft / step)
    const maxIndex = getProgramsIndexBounds(step)
    const targetIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction))
    programsListRef.value.scrollTo({ left: targetIndex * step, behavior: 'smooth' })
    setTimeout(syncProgramsArrows, 280)
    return
  }
  const shift = Math.max(220, Math.round(programsListRef.value.clientWidth * 0.82))
  programsListRef.value.scrollBy({ left: shift * direction, behavior: 'smooth' })
  setTimeout(syncProgramsArrows, 280)
}
</script>
