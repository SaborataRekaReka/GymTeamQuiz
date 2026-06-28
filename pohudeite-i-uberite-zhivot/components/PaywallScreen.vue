<template>
  <div :class="embedded ? 'quiz-card paywall-card is-embedded' : 'quiz-card paywall-card'">
    <div class="quiz-stack">
      <QuizHeader v-if="!embedded" :progress-percent="progressPercent" :on-back="onBack" :checkpoint-state="checkpointState" />

      <div class="paywall">
        <section class="paywall-hero">
          <div class="paywall-hero-photo">
            <img
              v-if="!isHeroBroken"
              :src="paywallHeroImage"
              alt="Екатерина Усманова"
              loading="lazy"
              decoding="async"
              @error="onHeroImageError"
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
          <div class="paywall-proof-top">
            <img
              v-if="!isProofBroken"
              class="paywall-proof-photo"
              :src="paywallProofImage"
              alt="Екатерина Усманова"
              loading="lazy"
              decoding="async"
              @error="onProofImageError"
            />
            <span v-else class="paywall-proof-photo" aria-hidden="true" />
            <div class="paywall-proof-copy">
              <div class="paywall-proof-count">
                <strong>580 000+</strong>
                <span>женщин занимаются по программам Кати Усмановой</span>
              </div>
              <div class="paywall-facts">
                <span v-for="fact in PAYWALL_FACTS" :key="fact" class="paywall-fact">
                  <span class="paywall-fact-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg></span>
                  <span>{{ fact }}</span>
                </span>
              </div>
            </div>
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
                  <img
                    :src="src"
                    alt="Результат участницы"
                    loading="lazy"
                    decoding="async"
                    data-fallback="0"
                    @dragstart.prevent
                    @error="onGalleryImageError($event, index)"
                  />
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

        <section class="paywall-section paywall-media">
          <h3 class="paywall-h">Подкасты. Статьи в СМИ. Коллаборации со звёздами.</h3>
          <p class="paywall-sub">Тренируйтесь по программам эксперта, которую выбрали 580 000 женщин в России.</p>
          <div class="paywall-media-grid">
            <figure v-for="item in PAYWALL_MEDIA" :key="item.src" class="paywall-media-item">
              <img :src="item.src" :alt="item.alt" loading="lazy" decoding="async" />
              <figcaption class="paywall-media-caption">{{ item.alt }}</figcaption>
            </figure>
          </div>
        </section>

        <section ref="tariffsRef" class="paywall-section">
          <h3 class="paywall-h">Выберите формат доступа</h3>
          <p class="paywall-sub">Подписку можно отключить в личном кабинете.</p>

          <div class="paywall-promo">
            <div class="paywall-promo-row">
              <div class="paywall-promo-main">
                <span class="paywall-promo-label">Применён промокод</span>
                <span class="paywall-promo-code">{{ promoCode }}</span>
              </div>
              <span class="paywall-promo-timer">{{ promoTimerText }}</span>
            </div>
          </div>

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

        <section v-if="!embedded" class="paywall-section">
          <h3 class="paywall-h">Программы, которые подойдут вам</h3>
          <p class="paywall-sub">Мы выбрали их по вашей цели, зонам и формату тренировок.</p>
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
                    <span class="result-program-fallback-icon"><ResultProgramIcon :title="program.title" /></span>
                    <span class="result-program-fallback-title">{{ program.title }}</span>
                  </span>
                </div>
                <div class="result-program-copy">
                  <div class="result-program-badges">
                    <span class="result-program-badge is-type">{{ program.type }}</span>
                    <span v-if="program.relevanceTags[0]" class="result-program-badge">{{ toDisplayProgramTag(program.relevanceTags[0]) }}</span>
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

      <div v-if="!embedded" class="quiz-actions">
        <Button label="Назад" variant="secondary" @click="onBack" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import QuizHeader from './QuizHeader.vue'
import Button from './Button.vue'
import GetCourseForm from './GetCourseForm.vue'
import PaywallIncludeIcon from './PaywallIncludeIcon.vue'
import PaywallSafetyIcon from './PaywallSafetyIcon.vue'
import ResultProgramIcon from './ResultProgramIcon.vue'
import { assetUrl } from '../shared/assets'
import type { LegalLinks, ProgressCheckpointState, ResultProgram, TariffConfig } from '../src/quiz/types'

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
  checkpointState?: ProgressCheckpointState
  embedded?: boolean
  onBack: () => void
}>()

const embedded = computed(() => props.embedded === true)

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

const PAYWALL_MEDIA = [
  { src: 'https://slt.cdn-chatium.io/thumbnail/image_msk_Hji0QlUWTB.600x600.png/s/300x', alt: 'Съёмка на Comedy Club' },
  { src: 'https://slt.cdn-chatium.io/thumbnail/image_msk_KWDtVwLU9a.600x600.png/s/300x', alt: 'Интервью с Екатериной Усманова' },
  { src: 'https://slt.cdn-chatium.io/thumbnail/image_msk_Pws485HQu4.600x600.png/s/300x', alt: 'Подкаст «Мама фитнес-бикини»' },
  { src: 'https://slt.cdn-chatium.io/thumbnail/image_msk_BKU2kRoRq2.600x600.png/s/300x', alt: 'Статья «Бикини, которое приносит миллионы»' },
]

const PAYWALL_GALLERY_BASE = [
  '/assets/quiz/trust/gallery/student-01',
  '/assets/quiz/trust/gallery/student-02',
  '/assets/quiz/trust/gallery/student-03',
  '/assets/quiz/trust/gallery/student-04',
  '/assets/quiz/trust/gallery/student-05',
  '/assets/quiz/trust/gallery/student-06',
  '/assets/quiz/trust/gallery/student-07',
  '/assets/quiz/trust/gallery/student-08',
  '/assets/quiz/trust/gallery/student-09',
  '/assets/quiz/trust/gallery/student-10',
  '/assets/quiz/trust/gallery/student-11',
  '/assets/quiz/trust/gallery/student-12',
  '/assets/quiz/trust/gallery/student-13',
  '/assets/quiz/trust/gallery/student-14',
]

const PAYWALL_GALLERY = PAYWALL_GALLERY_BASE.map((path) => assetUrl(`${path}.webp`))
const PAYWALL_GALLERY_JPG = PAYWALL_GALLERY_BASE.map((path) => assetUrl(`${path}.jpg`))

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
const paywallHeroImage = assetUrl('/assets/quiz/result/usmanova_result.webp')
const paywallProofImage = 'https://slt.cdn-chatium.io/thumbnail/image_msk_YYLWFz4dDJ.1440x960.jpeg/s/1024x'
const paywallGalleryFallbackImage = assetUrl('/assets/quiz/result/usmanova_result.webp')
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

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'A', б: 'B', в: 'V', г: 'G', д: 'D', е: 'E', ё: 'E', ж: 'ZH', з: 'Z', и: 'I',
  й: 'I', к: 'K', л: 'L', м: 'M', н: 'N', о: 'O', п: 'P', р: 'R', с: 'S', т: 'T',
  у: 'U', ф: 'F', х: 'H', ц: 'TS', ч: 'CH', ш: 'SH', щ: 'SCH', ъ: '', ы: 'Y', ь: '',
  э: 'E', ю: 'YU', я: 'YA',
}

function transliterateName(name: string): string {
  return name
    .toLowerCase()
    .split('')
    .map((char) => (char in CYRILLIC_TO_LATIN ? CYRILLIC_TO_LATIN[char] : /[a-z0-9]/.test(char) ? char.toUpperCase() : ''))
    .join('')
}

const promoCode = computed(() => {
  const namePart = transliterateName(safeName.value).slice(0, 12) || 'YOU'
  const day = new Date().getDate()
  return `${namePart}LETO${day}`
})

const PROMO_DURATION_SECONDS = 15 * 60
const promoSecondsLeft = ref(PROMO_DURATION_SECONDS)
let promoTimerId: ReturnType<typeof setInterval> | undefined

const promoTimerText = computed(() => {
  const total = Math.max(0, promoSecondsLeft.value)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
})

onMounted(() => {
  promoTimerId = setInterval(() => {
    if (promoSecondsLeft.value > 0) {
      promoSecondsLeft.value -= 1
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (promoTimerId) clearInterval(promoTimerId)
})
const orientir = computed(() =>
  isLoss.value
    ? `Похудеть до ${target.value} кг и сохранить форму`
    : isGain.value
      ? `Набрать до ${target.value} кг и сохранить форму`
      : `Сохранить вес ${target.value} кг и улучшить форму`,
)

const PROGRAM_TAG_LABELS: Record<string, string> = {
  'для старта': 'Комфортный старт',
  'тонус': 'Тонус',
  'ягодицы': 'Ягодицы',
}

function toDisplayProgramTag(rawTag: string): string {
  const normalized = rawTag.trim().toLowerCase()
  if (!normalized) return ''
  const mapped = PROGRAM_TAG_LABELS[normalized]
  if (mapped) return mapped
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function scrollTo(element: HTMLElement | null) {
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function onSelectTariff(name: string) {
  selectedTariff.value = name
  formOpenKey.value += 1
}

function onHeroImageError(event: Event) {
  const image = event.currentTarget as HTMLImageElement
  if (image.dataset.fallback !== '1') {
    image.dataset.fallback = '1'
    image.src = paywallProofImage
    return
  }
  isHeroBroken.value = true
}

function onProofImageError(event: Event) {
  const image = event.currentTarget as HTMLImageElement
  if (image.dataset.fallback !== '1') {
    image.dataset.fallback = '1'
    image.src = paywallHeroImage
    return
  }
  isProofBroken.value = true
}

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

const showGalleryLeftArrow = ref(false)

function getGallerySnapStep(): number {
  if (!galleryListRef.value) return 0
  const firstCard = galleryListRef.value.querySelector<HTMLElement>('.paywall-gallery-item')
  if (!firstCard) return 0
  const styles = getComputedStyle(galleryListRef.value)
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0')
  return firstCard.offsetWidth + (Number.isFinite(gap) ? gap : 0)
}

function getGalleryIndexBounds(step: number): number {
  if (!galleryListRef.value || step <= 0) return 0
  const maxScroll = Math.max(0, galleryListRef.value.scrollWidth - galleryListRef.value.clientWidth)
  return Math.max(0, Math.round(maxScroll / step))
}

function syncGalleryArrows() {
  if (!galleryListRef.value) return
  showGalleryLeftArrow.value = galleryListRef.value.scrollLeft > 8
}

const galleryDrag = {
  pointerId: undefined as number | undefined,
  startX: 0,
  startY: 0,
  startScrollLeft: 0,
  lastDeltaX: 0,
  active: false,
  rafId: null as number | null,
  nextScrollLeft: 0,
}

function onGalleryPointerDown(event: PointerEvent) {
  const list = galleryListRef.value
  if (!list) return
  if (event.pointerType === 'mouse' && event.button !== 0) return

  galleryDrag.pointerId = event.pointerId
  galleryDrag.startX = event.clientX
  galleryDrag.startY = event.clientY
  galleryDrag.startScrollLeft = list.scrollLeft
  galleryDrag.lastDeltaX = 0
  galleryDrag.active = false

  if (galleryDrag.rafId !== null) {
    cancelAnimationFrame(galleryDrag.rafId)
    galleryDrag.rafId = null
  }
}

function onGalleryPointerMove(event: PointerEvent) {
  const list = galleryListRef.value
  if (!list || galleryDrag.pointerId !== event.pointerId) return

  const deltaX = event.clientX - galleryDrag.startX
  const deltaY = event.clientY - galleryDrag.startY

  if (!galleryDrag.active) {
    const passedThreshold = Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6
    if (!passedThreshold) return

    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      galleryDrag.pointerId = undefined
      return
    }

    galleryDrag.active = true
    list.setPointerCapture(event.pointerId)
    list.classList.add('is-dragging')
  }

  event.preventDefault()
  galleryDrag.lastDeltaX = deltaX
  galleryDrag.nextScrollLeft = galleryDrag.startScrollLeft - deltaX

  if (galleryDrag.rafId !== null) return
  galleryDrag.rafId = requestAnimationFrame(() => {
    galleryDrag.rafId = null
    list.scrollLeft = galleryDrag.nextScrollLeft
    syncGalleryArrows()
  })
}

function snapGalleryToSlide(deltaX: number) {
  const list = galleryListRef.value
  if (!list) return
  const step = getGallerySnapStep()
  if (step <= 0) {
    syncGalleryArrows()
    return
  }

  const currentIndex = Math.round(list.scrollLeft / step)
  const startIndex = Math.round(galleryDrag.startScrollLeft / step)
  const dragThreshold = Math.min(72, step * 0.22)
  const movedEnough = Math.abs(deltaX) >= dragThreshold
  let targetIndex = currentIndex

  if (movedEnough) {
    const direction = deltaX < 0 ? 1 : -1
    targetIndex = startIndex + direction
  }

  const maxIndex = getGalleryIndexBounds(step)
  targetIndex = Math.max(0, Math.min(maxIndex, targetIndex))
  list.scrollTo({ left: targetIndex * step, behavior: 'smooth' })
  setTimeout(syncGalleryArrows, 280)
}

function onGalleryPointerEnd(event: PointerEvent) {
  const list = galleryListRef.value
  if (!list || galleryDrag.pointerId !== event.pointerId) return

  if (galleryDrag.rafId !== null) {
    cancelAnimationFrame(galleryDrag.rafId)
    galleryDrag.rafId = null
  }

  if (galleryDrag.active && list.hasPointerCapture(event.pointerId)) {
    list.releasePointerCapture(event.pointerId)
  }

  list.classList.remove('is-dragging')
  const deltaX = galleryDrag.lastDeltaX
  galleryDrag.pointerId = undefined
  galleryDrag.active = false

  snapGalleryToSlide(deltaX)
}

function scrollGallery(direction: -1 | 1) {
  if (!galleryListRef.value) return
  const step = getGallerySnapStep()
  if (step > 0) {
    const currentIndex = Math.round(galleryListRef.value.scrollLeft / step)
    const maxIndex = getGalleryIndexBounds(step)
    const targetIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction))
    galleryListRef.value.scrollTo({ left: targetIndex * step, behavior: 'smooth' })
    setTimeout(syncGalleryArrows, 280)
    return
  }
  const shift = Math.max(220, Math.round(galleryListRef.value.clientWidth * 0.82))
  galleryListRef.value.scrollBy({ left: shift * direction, behavior: 'smooth' })
  setTimeout(syncGalleryArrows, 280)
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

function onGalleryImageError(event: Event, index: number) {
  const image = event.currentTarget as HTMLImageElement
  const fallbackStage = image.dataset.fallback ?? '0'

  if (fallbackStage === '0') {
    image.dataset.fallback = '1'
    const jpgSource = PAYWALL_GALLERY_JPG[index]
    if (jpgSource && jpgSource !== image.src) {
      image.src = jpgSource
      return
    }
  }

  if (fallbackStage === '0' || fallbackStage === '1') {
    image.dataset.fallback = '2'
    if (paywallGalleryFallbackImage && paywallGalleryFallbackImage !== image.src) {
      image.src = paywallGalleryFallbackImage
      return
    }
  }

  markGalleryBroken(index)
}
</script>