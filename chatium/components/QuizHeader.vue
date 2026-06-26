<template>
  <div class="quiz-header">
    <div class="quiz-header-logo-row" aria-hidden="true">
      <img class="quiz-header-logo" src="/assets/brand/usmanova-fit-logo.png" alt="" loading="lazy" decoding="async" />
    </div>

    <div class="quiz-header-progress-row">
      <button
        v-if="onBack"
        type="button"
        aria-label="Назад"
        class="quiz-header-back"
        @click="onBack"
      >
        <span class="quiz-header-back-icon" aria-hidden="true" />
      </button>
      <span v-else class="quiz-header-back-placeholder" />

      <div class="quiz-progress" aria-label="progress">
        <span v-for="(seg, index) in segments" :key="index" class="quiz-progress-segment">
          <span class="quiz-progress-segment-fill" :style="{ transform: `scaleX(${seg})` }" />
        </span>
      </div>
      <span class="quiz-header-percent">{{ percentLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  progressPercent: number
  onBack?: () => void
}>()

const SEGMENT_COUNT = 5

const percentLabel = computed(() => `${Math.round(props.progressPercent)}%`)

const segments = computed(() => {
  const filled = (props.progressPercent / 100) * SEGMENT_COUNT
  return Array.from({ length: SEGMENT_COUNT }, (_, index) =>
    Math.max(0, Math.min(1, filled - index)),
  )
})
</script>
