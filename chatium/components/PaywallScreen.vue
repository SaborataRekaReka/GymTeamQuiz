<template>
  <div class="quiz-card">
    <div class="quiz-stack">
      <QuizHeader :progress-percent="progressPercent" :on-back="onBack" />

      <div class="paywall">
        <section class="paywall-hero">
          <div class="paywall-hero-photo">
            <img
              v-if="!isHeroBroken"
              src="/assets/quiz/result/usmanova_result.webp"
              alt="Екатерина Усманова"
              loading="lazy"
              decoding="async"
              @error="isHeroBroken = true"
            />
          </div>
          <div class="paywall-hero-copy">
            <h2 class="paywall-hero-title">{{ heading }}</h2>
            <p class="paywall-hero-sub">Получите доступ к программам Кати Усмановой, помощнику по питанию и тренировкам, которые подходят под вашу цель.</p>
            <p class="paywall-hero-orientir">
              <span :style="orientirIconWrapStyle" aria-hidden="true">
                <svg viewBox="0 0 24 24" :style="orientirSvgStyle">
                  <circle cx="12" cy="12" r="7" />
                  <circle cx="12" cy="12" r="2.5" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                </svg>
              </span>
              <span>{{ orientir }}</span>
            </p>
            <div class="paywall-chips">
              <span class="paywall-chip">Программы</span>
              <span class="paywall-chip">Питание</span>
              <span class="paywall-chip">Под вашу цель</span>
            </div>
            <button type="button" class="paywall-cta" @click="scrollTo(tariffsRef)">Выбрать доступ</button>
          </div>
        </section>

        <section class="paywall-section paywall-proof">
          <h3 class="paywall-h">С Катей уже тренируются сотни тысяч женщин</h3>
          <div class="paywall-proof-top">
            <img
              v-if="!isProofBroken"
              class="paywall-proof-photo"
              src="/assets/quiz/hero/hero.webp"
              alt="Екатерина Усманова"
              loading="lazy"
              decoding="async"
              @error="isProofBroken = true"
            />
            <span v-else class="paywall-proof-photo" aria-hidden="true" />
            <div class="paywall-proof-count">
              <strong>580 000+</strong>
              <span>женщин занимаются по программам Кати Усмановой</span>
            </div>
          </div>
          <div class="paywall-facts">
            <span v-for="fact in PAYWALL_FACTS" :key="fact" class="paywall-fact">
              <span class="paywall-fact-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg></span>
              <span>{{ fact }}</span>
            </span>
          </div>
          <div class="paywall-gallery-head">Результаты участниц</div>
          <p class="paywall-gallery-hint">Реальные фотографии участниц программ Кати Усмановой.</p>
          <div class="result-programs-carousel">
            <div
              ref="galleryListRef"
              class="paywall-gallery"
              @scroll="syncGalleryArrows"
              @dragstart.prevent
              @pointerdown="onGalleryPointerDown"
              @pointermove="onGalleryPointerMove"
              @pointerup="onGalleryPointerEnd"
              @pointercancel="onGalleryPointerEnd"
            >
              <template v-for="(src, index) in PAYWALL_GALLERY" :key="src">
                <div v-if="!isGalleryBroken(index)" class="paywall-gallery-item">
                  <span class="paywall-gallery-badge">До и после</span>
                  <img :src="src" alt="Результат участницы" loading="lazy" decoding="async" @error="markGalleryBroken(index)" />
                </div>
              </template>
            </div>
            <button
              type="button"
              :class="showGalleryLeftArrow ? 'result-programs-arrow is-left is-visible' : 'result-programs-arrow is-left'"
              aria-label="Прокрутить истории влево"
              @click="scrollGallery(-1)"
            >
              <span class="result-programs-arrow-icon" aria-hidden="true" />
            </button>
            <button type="button" class="result-programs-arrow" aria-label="Прокрутить истории вправо" @click="scrollGallery(1)">
              <span class="result-programs-arrow-icon" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section ref="tariffsRef" class="paywall-section">
          <h3 class="paywall-h">Выберите формат доступа</h3>
          <p class="paywall-sub">Подписку можно отключить в личном кабинете.</p>
          <div class="paywall-tariffs">
            <div
              v-for="tariff in tariffs"
              :key="tariff.name"
              :class="['paywall-tariff', { 'is-popular': tariff.name === 'Популярно', 'is-selected': selectedTariff === tariff.name }]"
            >
              <div class="paywall-tariff-head">
                <span class="paywall-tariff-name">{{ tariff.name }}</span>
                <span v-if="tariff.name === 'Популярно'" class="paywall-badge is-soft">Рекомендуем</span>
                <span v-if="tariff.name === 'Хит продаж'" class="paywall-badge">Хит продаж</span>
              </div>
              <div class="paywall-tariff-price">
                <span class="paywall-price-now">{{ tariff.price }} руб</span>
                <span class="paywall-price-old">{{ tariff.old_price }} руб</span>
              </div>
              <div class="paywall-tariff-period">Период: {{ tariff.period }}</div>
              <div v-if="tariff.renewal" class="paywall-tariff-renewal">{{ tariff.renewal }}</div>
              <div v-if="PAYWALL_TARIFF_NOTE[tariff.name]" class="paywall-tariff-note">{{ PAYWALL_TARIFF_NOTE[tariff.name] }}</div>
              <button type="button" class="paywall-tariff-btn" @click="onSelectTariff(tariff.name)">Выбрать тариф</button>
            </div>
          </div>
        </section>

        <section class="paywall-section">
          <h3 class="paywall-h">Что входит в доступ</h3>
          <p class="paywall-sub">Внутри программы и инструменты, которые помогут начать по вашему маршруту.</p>
          <div class="paywall-includes">
            <article v-for="(item, index) in PAYWALL_INCLUDES" :key="item.title" class="paywall-include">
              <span class="paywall-include-icon" aria-hidden="true"><PaywallIncludeIcon :index="index" /></span>
              <div>
                <h4 class="paywall-include-title">{{ item.title }}</h4>
                <p class="paywall-include-text">{{ item.text }}</p>
              </div>
            </article>
          </div>
        </section>

        <section class="paywall-section">
          <h3 class="paywall-h">Программы, которые подойдут вам</h3>
          <p class="paywall-sub">Мы выбрали их по вашей цели, зонам и формату тренировок.</p>
          <div class="result-programs-carousel">
            <div
              ref="programsListRef"
              class="result-programs-list"
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
                    @error="onProgramImageError($event, program)"
                  />
                  <span :class="isProgramImageBroken(program.id) ? 'result-program-fallback' : 'result-program-fallback is-hidden'">
                    <span class="result-program-fallback-icon"><ResultProgramIcon :title="program.title" /></span>
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
            <button type="button" class="result-programs-arrow is-left is-visible" aria-label="Прокрутить программы влево" @click="scrollPrograms(-1)">
              <span class="result-programs-arrow-icon" aria-hidden="true" />
            </button>
            <button type="button" class="result-programs-arrow" aria-label="Прокрутить программы вправо" @click="scrollPrograms(1)">
              <span class="result-programs-arrow-icon" aria-hidden="true" />
            </button>
          </div>
        </section>

        <GetCourseForm
          :selected-tariff-name="selectedTariff"
          :selected-tariff-period="selectedTariffPeriod"
          :open-key="formOpenKey"
          hide-trigger
        />

        <section class="paywall-section">
          <h3 class="paywall-h">Оплата и доступ безопасны</h3>
          <div class="paywall-safety">
            <div v-for="(item, index) in PAYWALL_SAFETY" :key="item.title" class="paywall-safe">
              <span class="paywall-safe-icon" aria-hidden="true"><PaywallSafetyIcon :index="index" /></span>
              <h4 class="paywall-safe-title">{{ item.title }}</h4>
              <p class="paywall-safe-text">{{ item.text }}</p>
            </div>
          </div>
        </section>

        <section class="paywall-section">
          <h3 class="paywall-h">Частые вопросы</h3>
          <div class="paywall-faq">
            <details v-for="item in PAYWALL_FAQ" :key="item.q" class="paywall-faq-item">
              <summary>{{ item.q }}</summary>
              <div class="paywall-faq-answer">{{ item.a }}</div>
            </details>
          </div>
        </section>

        <footer class="paywall-footer">
          <div class="paywall-requisites">
            <strong>ООО «Онлайн Фитнес»</strong>
            <span>ИНН 7734434533 · КПП 773401001 · ОГРН 1207700175209</span>
            <span>Москва, улица Щукинская, дом 2</span>
            <span>Служба заботы: help@usmanovasport.ru</span>
          </div>
          <div class="quiz-legal">
            <a class="quiz-legal-link" :href="legalLinks.offer" target="_blank" rel="noreferrer">Оферта</a>
            {{ ' · ' }}
            <a class="quiz-legal-link" :href="legalLinks.privacy" target="_blank" rel="noreferrer">Политика конфиденциальности</a>
            {{ ' · ' }}
            <a class="quiz-legal-link" :href="legalLinks.personal_data" target="_blank" rel="noreferrer">Согласие на обработку персональных данных</a>
          </div>
        </footer>
      </div>

      <div class="quiz-actions">
        <Button label="Назад" variant="secondary" @click="onBack" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import QuizHeader from './QuizHeader.vue'
import Button from './Button.vue'
import GetCourseForm from './GetCourseForm.vue'
import PaywallIncludeIcon from './PaywallIncludeIcon.vue'
import PaywallSafetyIcon from './PaywallSafetyIcon.vue'
import ResultProgramIcon from './ResultProgramIcon.vue'
import type { LegalLinks, ResultProgram, TariffConfig } from '../../src/quiz/types'

const props = defineProps<{
  topFocus?: string
  requiredBlocks: string[]
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
}>()

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
  '/assets/quiz/trust/gallery/student-01.webp',
  '/assets/quiz/trust/gallery/student-02.webp',
  '/assets/quiz/trust/gallery/student-03.webp',
  '/assets/quiz/trust/gallery/student-04.webp',
  '/assets/quiz/trust/gallery/student-05.webp',
  '/assets/quiz/trust/gallery/student-06.webp',
  '/assets/quiz/trust/gallery/student-07.webp',
  '/assets/quiz/trust/gallery/student-08.webp',
  '/assets/quiz/trust/gallery/student-09.webp',
  '/assets/quiz/trust/gallery/student-10.webp',
  '/assets/quiz/trust/gallery/student-11.webp',
  '/assets/quiz/trust/gallery/student-12.webp',
  '/assets/quiz/trust/gallery/student-13.webp',
  '/assets/quiz/trust/gallery/student-14.webp',
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

const orientirIconWrapStyle = {
  width: '18px',
  height: '18px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.82)',
  color: 'var(--primary)',
  flexShrink: 0,
}
const orientirSvgStyle = {
  width: '12px',
  height: '12px',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const selectedTariff = ref(props.tariffs.find((tariff) => tariff.name === 'Популярно')?.name ?? props.tariffs[0]?.name ?? '')
const selectedTariffPeriod = computed(
  () => props.tariffs.find((tariff) => tariff.name === selectedTariff.value)?.period ?? '',
)
const formOpenKey = ref(0)
const isHeroBroken = ref(false)
const isProofBroken = ref(false)

const tariffsRef = ref<HTMLElement | null>(null)
const programsListRef = ref<HTMLDivElement | null>(null)
const galleryListRef = ref<HTMLDivElement | null>(null)

const safeName = computed(() => (props.name && props.name.trim() ? props.name.trim() : ''))
const current = computed(() => (Number.isFinite(props.currentWeight) && props.currentWeight > 0 ? props.currentWeight : 0))
const target = computed(() =>
  Number.isFinite(props.targetWeight) && props.targetWeight > 0 ? props.targetWeight : current.value,
)
const isLoss = computed(() => current.value > 0 && target.value < current.value)
const isGain = computed(() => current.value > 0 && target.value > current.value)

const heading = computed(() => (safeName.value ? `${safeName.value}, ваш план готов` : 'Ваш план готов'))
const orientir = computed(() =>
  isLoss.value
    ? `Похудеть до ${target.value} кг и сохранить форму`
    : isGain.value
      ? `Набрать до ${target.value} кг и сохранить форму`
      : `Сохранить вес ${target.value} кг и улучшить форму`,
)

function scrollTo(element: HTMLElement | null) {
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function onSelectTariff(name: string) {
  selectedTariff.value = name
  formOpenKey.value += 1
}

const showGalleryLeftArrow = ref(false)
interface CarouselDragState {
  pointerId?: number
  startX: number
  startY: number
  startScrollLeft: number
  startIndex: number
  lastDeltaX: number
  active: boolean
  rafId: number | null
  nextScrollLeft: number
  itemSelector: string
}

function createDragState(itemSelector: string): CarouselDragState {
  return {
    pointerId: undefined,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    startIndex: 0,
    lastDeltaX: 0,
    active: false,
    rafId: null,
    nextScrollLeft: 0,
    itemSelector,
  }
}

const programsDrag = createDragState('.result-program')
const galleryDrag = createDragState('.paywall-gallery-item')

function getSnapStep(list: HTMLElement, itemSelector: string): number {
  const firstCard = list.querySelector<HTMLElement>(itemSelector)
  if (!firstCard) return 0
  const styles = getComputedStyle(list)
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0')
  return firstCard.offsetWidth + (Number.isFinite(gap) ? gap : 0)
}

function getScrollIndexBounds(list: HTMLElement, step: number): number {
  if (step <= 0) return 0
  const maxScroll = Math.max(0, list.scrollWidth - list.clientWidth)
  return Math.max(0, Math.round(maxScroll / step))
}

function snapCarouselToSlide(list: HTMLElement, state: CarouselDragState, afterScroll?: () => void) {
  const step = getSnapStep(list, state.itemSelector)
  if (step <= 0) {
    if (afterScroll) afterScroll()
    return
  }

  const currentIndex = Math.round(list.scrollLeft / step)
  const dragThreshold = Math.min(72, step * 0.22)
  const movedEnough = Math.abs(state.lastDeltaX) >= dragThreshold
  let targetIndex = currentIndex

  if (movedEnough) {
    const direction = state.lastDeltaX < 0 ? 1 : -1
    targetIndex = state.startIndex + direction
  }

  const maxIndex = getScrollIndexBounds(list, step)
  targetIndex = Math.max(0, Math.min(maxIndex, targetIndex))

  list.scrollTo({ left: targetIndex * step, behavior: 'smooth' })
  setTimeout(() => {
    if (afterScroll) afterScroll()
  }, 280)
}

function onCarouselPointerDown(event: PointerEvent, list: HTMLElement, state: CarouselDragState) {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  state.pointerId = event.pointerId
  state.startX = event.clientX
  state.startY = event.clientY
  state.startScrollLeft = list.scrollLeft
  const step = getSnapStep(list, state.itemSelector)
  state.startIndex = step > 0 ? Math.round(list.scrollLeft / step) : 0
  state.lastDeltaX = 0
  state.active = false

  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId)
    state.rafId = null
  }
}

function onCarouselPointerMove(
  event: PointerEvent,
  list: HTMLElement,
  state: CarouselDragState,
  afterScroll?: () => void,
) {
  if (state.pointerId !== event.pointerId) return

  const deltaX = event.clientX - state.startX
  const deltaY = event.clientY - state.startY

  if (!state.active) {
    const passedThreshold = Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6
    if (!passedThreshold) return

    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      state.pointerId = undefined
      return
    }

    state.active = true
    list.setPointerCapture(event.pointerId)
    list.classList.add('is-dragging')
  }

  event.preventDefault()
  state.lastDeltaX = deltaX
  state.nextScrollLeft = state.startScrollLeft - deltaX

  if (state.rafId !== null) return
  state.rafId = requestAnimationFrame(() => {
    state.rafId = null
    list.scrollLeft = state.nextScrollLeft
    if (afterScroll) afterScroll()
  })
}

function onCarouselPointerEnd(
  event: PointerEvent,
  list: HTMLElement,
  state: CarouselDragState,
  afterEnd?: () => void,
) {
  if (state.pointerId !== event.pointerId) return

  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId)
    state.rafId = null
  }

  if (state.active && list.hasPointerCapture(event.pointerId)) {
    list.releasePointerCapture(event.pointerId)
  }

  list.classList.remove('is-dragging')
  state.pointerId = undefined
  state.active = false

  snapCarouselToSlide(list, state, afterEnd)
}

function getProgramsSnapStep(): number {
  if (!programsListRef.value) return 0
  return getSnapStep(programsListRef.value, '.result-program')
}

function onProgramsPointerDown(event: PointerEvent) {
  if (!programsListRef.value) return
  onCarouselPointerDown(event, programsListRef.value, programsDrag)
}

function onProgramsPointerMove(event: PointerEvent) {
  if (!programsListRef.value) return
  onCarouselPointerMove(event, programsListRef.value, programsDrag)
}

function onProgramsPointerEnd(event: PointerEvent) {
  if (!programsListRef.value) return
  onCarouselPointerEnd(event, programsListRef.value, programsDrag)
}

function scrollPrograms(direction: -1 | 1) {
  if (!programsListRef.value) return
  const step = getProgramsSnapStep()
  if (step > 0) {
    const currentIndex = Math.round(programsListRef.value.scrollLeft / step)
    const maxIndex = getScrollIndexBounds(programsListRef.value, step)
    const targetIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction))
    programsListRef.value.scrollTo({ left: targetIndex * step, behavior: 'smooth' })
    return
  }

  const shift = Math.max(220, Math.round(programsListRef.value.clientWidth * 0.82))
  programsListRef.value.scrollBy({ left: shift * direction, behavior: 'smooth' })
}

function getGallerySnapStep(): number {
  if (!galleryListRef.value) return 0
  return getSnapStep(galleryListRef.value, '.paywall-gallery-item')
}
function syncGalleryArrows() {
  if (!galleryListRef.value) return
  showGalleryLeftArrow.value = galleryListRef.value.scrollLeft > 8
}

function onGalleryPointerDown(event: PointerEvent) {
  if (!galleryListRef.value) return
  onCarouselPointerDown(event, galleryListRef.value, galleryDrag)
}

function onGalleryPointerMove(event: PointerEvent) {
  if (!galleryListRef.value) return
  onCarouselPointerMove(event, galleryListRef.value, galleryDrag, syncGalleryArrows)
}

function onGalleryPointerEnd(event: PointerEvent) {
  if (!galleryListRef.value) return
  onCarouselPointerEnd(event, galleryListRef.value, galleryDrag, syncGalleryArrows)
}

function scrollGallery(direction: -1 | 1) {
  if (!galleryListRef.value) return
  const step = getGallerySnapStep()
  if (step > 0) {
    const currentIndex = Math.round(galleryListRef.value.scrollLeft / step)
    const maxIndex = getScrollIndexBounds(galleryListRef.value, step)
    const targetIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction))
    galleryListRef.value.scrollTo({ left: targetIndex * step, behavior: 'smooth' })
    setTimeout(syncGalleryArrows, 240)
    return
  }
  const shift = Math.max(220, Math.round(galleryListRef.value.clientWidth * 0.82))
  galleryListRef.value.scrollBy({ left: shift * direction, behavior: 'smooth' })
  setTimeout(syncGalleryArrows, 240)
}

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

const brokenGallery = reactive<Record<number, boolean>>({})
const isGalleryBroken = (index: number) => Boolean(brokenGallery[index])
function markGalleryBroken(index: number) {
  brokenGallery[index] = true
}
</script>
