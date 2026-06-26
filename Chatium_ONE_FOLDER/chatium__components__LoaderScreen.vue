<template>
  <div class="quiz-card">
    <div class="quiz-stack">
      <QuizHeader :progress-percent="progressPercent" :on-back="onBack" />

      <h1 v-if="title" class="quiz-title">{{ title }}</h1>
      <p v-if="text" class="quiz-subtitle">{{ text }}</p>

      <div v-if="hasPlanSteps" class="quiz-plan-loader" aria-label="Сбор персонального плана">
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
          <div
            v-for="(step, index) in steps"
            :key="step"
            :class="index === steps.length - 1 ? 'quiz-plan-status is-last' : 'quiz-plan-status'"
            :style="{ '--step-delay': `${index * 1000}ms` }"
          >
            <span class="quiz-plan-status-dot" aria-hidden="true" />
            <span>{{ step }}</span>
          </div>
        </div>
      </div>

      <div v-else class="quiz-hero">
        <p class="quiz-subtitle">Анализируем ваши ответы и готовим персональные рекомендации</p>
      </div>

      <div v-if="!hasPlanSteps" class="quiz-actions">
        <Button :label="buttonText || 'Продолжить'" @click="onNext" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import QuizHeader from './QuizHeader.vue'
import Button from './Button.vue'

const props = defineProps<{
  title?: string
  text?: string
  steps: string[]
  buttonText?: string
  progressPercent: number
  onNext: () => void
  onBack: () => void
}>()

const hasPlanSteps = computed(() => props.steps.length > 0)
</script>
