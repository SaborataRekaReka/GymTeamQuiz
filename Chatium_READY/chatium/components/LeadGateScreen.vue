<template>
  <div class="quiz-card">
    <div class="quiz-lead-gate-enter">
      <div class="quiz-stack">
        <QuizHeader :progress-percent="progressPercent" :on-back="onBack" />

        <h1 v-if="title" class="quiz-title">{{ title }}</h1>
        <p v-if="text" class="quiz-subtitle">{{ text }}</p>

        <label :style="fieldWrapStyle">
          <div :style="fieldBoxStyle">
            <input
              type="text"
              name="name"
              autocomplete="name"
              placeholder="Ваше имя"
              :value="value.name"
              :style="inputStyle"
              @input="onNameInput(($event.target as HTMLInputElement).value)"
            />
          </div>
        </label>

        <label :style="fieldWrapStyle">
          <div :style="fieldBoxStyle">
            <input
              type="email"
              name="email"
              autocomplete="email"
              placeholder="Ваша почта"
              :value="value.email"
              :style="inputStyle"
              @input="onEmailInput(($event.target as HTMLInputElement).value)"
            />
          </div>
        </label>

        <label :style="checkboxWrapStyle">
          <input
            type="checkbox"
            :checked="value.consentAccepted"
            :style="checkboxStyle"
            @change="onConsentToggle(($event.target as HTMLInputElement).checked)"
          />
          <span>Я согласна на обработку персональных данных</span>
        </label>

        <div class="quiz-legal">
          <a class="quiz-legal-link" :href="legalLinks.offer" target="_blank" rel="noreferrer">Оферта</a>
          {{ ' · ' }}
          <a class="quiz-legal-link" :href="legalLinks.privacy" target="_blank" rel="noreferrer">Политика конфиденциальности</a>
          {{ ' · ' }}
          <a class="quiz-legal-link" :href="legalLinks.personal_data" target="_blank" rel="noreferrer">Согласие на обработку персональных данных</a>
        </div>

        <div v-for="issue in issues" :key="issue.field" class="quiz-error">{{ issue.message }}</div>

        <div class="quiz-sticky-cta">
          <div class="quiz-actions">
            <Button label="Открыть результат" @click="onNext" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import QuizHeader from './QuizHeader.vue'
import Button from './Button.vue'
import type { LeadGateAnswer, LegalLinks, ValidationIssue } from '../../src/quiz/types'

const props = defineProps<{
  title?: string
  text?: string
  value: LeadGateAnswer
  legalLinks: LegalLinks
  progressPercent: number
  issues: ValidationIssue[]
  onNameInput: (value: string) => void
  onEmailInput: (value: string) => void
  onConsentToggle: (checked: boolean) => void
  onNext: () => void
  onBack: () => void
}>()

const fieldWrapStyle = { display: 'flex', flexDirection: 'column' as const, gap: '6px' }
const fieldBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--surface)',
  minHeight: '56px',
  padding: '0 16px',
}
const inputStyle = {
  border: 'none',
  outline: 'none',
  width: '100%',
  fontSize: '17px',
  background: 'transparent',
}
const checkboxWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '12px',
  lineHeight: '16px',
  color: 'var(--text-muted)',
}
const checkboxStyle = computed(() => ({
  width: '16px',
  height: '16px',
  margin: 0,
  flexShrink: 0,
  cursor: 'pointer',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  border: '1px solid var(--primary)',
  borderRadius: '999px',
  background: props.value.consentAccepted ? 'var(--primary)' : '#FFF',
  boxShadow: props.value.consentAccepted ? 'inset 0 0 0 4px #FFF' : 'none',
}))
</script>
