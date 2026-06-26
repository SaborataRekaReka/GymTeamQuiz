<template>
  <div class="quiz-card">
    <div class="quiz-stack">
      <QuizHeader :progress-percent="progressPercent" :on-back="onBack" />

      <p v-if="offerText" class="quiz-offer">{{ offerText }}</p>

      <div v-if="isStart" class="quiz-brand">
        <img class="quiz-brand-photo" src="/assets/quiz/hero/hero.webp" alt="Екатерина Усманова" loading="eager" decoding="async" fetchpriority="high" />
      </div>

      <h1 v-if="screen.title" class="quiz-title">{{ screen.title }}</h1>
      <p v-if="screen.subtitle" class="quiz-subtitle">{{ screen.subtitle }}</p>

      <!-- Возрастная шкала -->
      <div v-if="isAgeScale" class="quiz-age-scale">
        <button
          v-for="option in optionList"
          :key="option"
          type="button"
          :class="['quiz-age-chip', { 'is-selected': selectedSingle === option }]"
          :aria-pressed="selectedSingle === option"
          @click="onSelect(option)"
        >
          <span class="quiz-age-chip-value">{{ option }}</span>
          <span v-if="!/[а-яё]/i.test(option)" class="quiz-age-chip-unit">лет</span>
        </button>
      </div>

      <!-- Карточки целей -->
      <div v-if="isGoalCards" class="quiz-goal-grid">
        <button
          v-for="(option, index) in optionList"
          :key="option"
          type="button"
          :class="['quiz-goal-card', { 'is-selected': selectedSingle === option }]"
          :aria-pressed="selectedSingle === option"
          @click="onSelect(option)"
        >
          <span
            v-if="optionIcons[index]"
            class="quiz-goal-card-icon"
            :style="{ '--opt-icon': `url(${optionIcons[index]})` }"
            aria-hidden="true"
          />
          <span class="quiz-goal-card-text">{{ option }}</span>
        </button>
      </div>

      <div class="quiz-option-list">
        <!-- Обычный одиночный выбор -->
        <template v-if="isPlainSingle">
          <OptionButton
            v-for="(option, index) in optionList"
            :key="option"
            :label="option"
            :icon="optionIcons[index]"
            :selected="selectedSingle === option"
            @click="onSelect(option)"
          />
        </template>

        <!-- Множественный выбор -->
        <template v-if="screen.kind === 'multiple'">
          <OptionButton
            v-for="(option, index) in optionList"
            :key="option"
            :label="option"
            :icon="optionIcons[index]"
            :selected="selectedMultiple.includes(option)"
            @click="onToggle(option)"
          />
        </template>

        <!-- Числовой ввод -->
        <div v-if="screen.kind === 'input'" class="quiz-metric-section">
          <div class="quiz-metric-input-wrap">
            <label class="quiz-metric-input" :aria-label="screen.title || 'Введите значение'">
              <input
                class="quiz-metric-value"
                type="number"
                inputmode="numeric"
                :placeholder="inputPlaceholder"
                :value="inputValue"
                @input="onInput(($event.target as HTMLInputElement).value)"
              />
              <span v-if="screen.unit" class="quiz-metric-unit">{{ screen.unit }}</span>
            </label>
            <span class="quiz-metric-divider" />
          </div>

          <div class="quiz-bmi-card">
            <span class="quiz-bmi-icon" :style="{ '--bmi-icon': `url(${BMI_ICON_SRC})` }" aria-hidden="true" />
            <div class="quiz-bmi-content">
              <p class="quiz-bmi-title">{{ bmiCard.title }}</p>
              <p class="quiz-bmi-text">{{ bmiCard.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-for="issue in issues" :key="issue.field" class="quiz-error">{{ issue.message }}</div>

      <div v-if="isStart" class="quiz-consent">
        <span>Продолжая, вы соглашаетесь с обработкой персональных данных.</span>
        <div class="quiz-legal">
          <a class="quiz-legal-link" :href="legalLinks.offer" target="_blank" rel="noreferrer">Оферта</a>
          {{ ' · ' }}
          <a class="quiz-legal-link" :href="legalLinks.privacy" target="_blank" rel="noreferrer">Политика конфиденциальности</a>
          {{ ' · ' }}
          <a class="quiz-legal-link" :href="legalLinks.personal_data" target="_blank" rel="noreferrer">Согласие на обработку персональных данных</a>
        </div>
      </div>

      <div v-if="stickyAction" class="quiz-sticky-cta">
        <div class="quiz-actions">
          <Button label="Продолжить" @click="onNext" />
        </div>
      </div>
      <div v-else-if="screen.kind !== 'single'" class="quiz-actions">
        <Button label="Продолжить" @click="onNext" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import QuizHeader from './QuizHeader.vue'
import OptionButton from './OptionButton.vue'
import Button from './Button.vue'
import type { LegalLinks, QuizAnswersByScreen, QuizScreen, ValidationIssue } from '../../src/quiz/types'

const props = defineProps<{
  screen: QuizScreen
  selectedSingle?: string
  selectedMultiple: string[]
  inputValue: string
  answersByScreen: QuizAnswersByScreen
  progressPercent: number
  issues: ValidationIssue[]
  legalLinks: LegalLinks
  onSelect: (option: string) => void
  onToggle: (option: string) => void
  onInput: (value: string) => void
  onNext: () => void
  onBack: () => void
}>()

const BMI_ICON_SRC = '/assets/icons/fitness_icons/Fitness-icons/SVG/scale.svg'

const optionList = computed(() =>
  props.screen.kind === 'single' || props.screen.kind === 'multiple' ? props.screen.options : [],
)
const optionIcons = computed(() =>
  (props.screen.kind === 'single' || props.screen.kind === 'multiple') && props.screen.optionIcons
    ? props.screen.optionIcons
    : [],
)
const stickyAction = computed(() => props.screen.kind === 'multiple' || props.screen.kind === 'input')
const offerText = computed(() => (props.screen.kind === 'single' ? props.screen.offer : undefined))
const isStart = computed(() => props.screen.id === 'age')
const isAgeScale = computed(() => props.screen.kind === 'single' && props.screen.id === 'age')
const isGoalCards = computed(() => props.screen.kind === 'single' && props.screen.id === 'result_focus')
const isPlainSingle = computed(() => props.screen.kind === 'single' && !isAgeScale.value && !isGoalCards.value)

const inputPlaceholder = computed(() => {
  if (props.screen.id === 'current_weight') return '72'
  if (props.screen.id === 'height') return '168'
  if (props.screen.id === 'target_weight') return '60'
  return '0'
})

function parseNumericValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const numeric = Number(value)
    if (Number.isFinite(numeric)) return numeric
  }
  return undefined
}

function bmiLabel(value: number): string {
  if (value < 18.5) return 'ниже нормы'
  if (value < 25) return 'в норме'
  if (value < 30) return 'выше нормы'
  return 'значительно выше нормы'
}

const bmiCard = computed(() => {
  let currentWeight = parseNumericValue(props.answersByScreen.current_weight)
  let height = parseNumericValue(props.answersByScreen.height)

  if (props.screen.id === 'current_weight') currentWeight = parseNumericValue(props.inputValue)
  if (props.screen.id === 'height') height = parseNumericValue(props.inputValue)
  if (props.screen.id === 'target_weight') currentWeight = parseNumericValue(props.inputValue) ?? currentWeight

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
})
</script>
