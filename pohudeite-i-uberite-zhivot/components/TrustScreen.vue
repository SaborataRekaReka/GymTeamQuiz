<template>
  <div class="quiz-card">
    <div :class="hasResearchSlides ? 'quiz-transition-screen is-research' : 'quiz-transition-screen'">
      <div class="quiz-stack">
        <QuizHeader :progress-percent="progressPercent" :on-back="onBack" :checkpoint-state="checkpointState" />

        <video
          v-if="mediaVideoSrc"
          class="quiz-trust-video"
          :src="mediaVideoSrc"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
        />
        <div v-else-if="mediaSrc" :class="mediaFallbackSrc ? 'quiz-trust-photo-grid' : 'quiz-trust-photo-single'">
          <img
            :key="mediaSrc"
            class="quiz-trust-photo"
            :src="mediaSrc"
            alt=""
            aria-hidden="true"
            @error="onTrustImageError"
          />
          <img
            v-if="mediaFallbackSrc"
            :key="mediaFallbackSrc"
            class="quiz-trust-photo"
            :src="mediaFallbackSrc"
            alt=""
            aria-hidden="true"
            @error="onTrustImageError"
          />
        </div>

        <h1 v-if="title" class="quiz-title">{{ title }}</h1>
        <p v-if="text && !hasResearchSlides" class="quiz-subtitle">{{ text }}</p>

        <div v-if="hasResearchSlides" class="quiz-research-slider">
          <div class="quiz-research-stage">
            <button
              type="button"
              class="quiz-research-nav"
              aria-label="Предыдущий слайд"
              :disabled="researchSlideIndex === 0"
              @click="goResearchSlide(researchSlideIndex - 1)"
            >
              <span class="quiz-research-nav-icon" aria-hidden="true" />
            </button>

            <div class="quiz-research-copy">
              <p class="quiz-research-text">{{ currentResearchSlide?.text }}</p>
              <p class="quiz-research-source">{{ currentResearchSlide?.source }}</p>
            </div>

            <button
              type="button"
              class="quiz-research-nav is-next"
              aria-label="Следующий слайд"
              :disabled="researchSlideIndex === slides.length - 1"
              @click="goResearchSlide(researchSlideIndex + 1)"
            >
              <span class="quiz-research-nav-icon" aria-hidden="true" />
            </button>
          </div>

          <div class="quiz-research-dots">
            <button
              v-for="(_, index) in slides"
              :key="index"
              type="button"
              :class="index === researchSlideIndex ? 'quiz-research-dot is-active' : 'quiz-research-dot'"
              :aria-label="`Слайд ${index + 1}`"
              @click="goResearchSlide(index)"
            />
          </div>
        </div>

        <div v-else class="quiz-benefit-list" role="list">
          <p
            v-for="(item, index) in benefits"
            :key="item"
            class="quiz-benefit-item"
            role="listitem"
            :style="{ '--benefit-delay': `${index * 220}ms` }"
          >
            <span class="quiz-benefit-check" aria-hidden="true" />
            <span class="quiz-benefit-text">{{ item }}</span>
          </p>
        </div>

        <div class="quiz-actions">
          <Button label="Продолжить" @click="onNext" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import QuizHeader from './QuizHeader.vue'
import Button from './Button.vue'
import type { ProgressCheckpointState } from '../src/quiz/types'

interface ResearchSlide {
  text: string
  source: string
}

const props = defineProps<{
  title?: string
  text?: string
  benefits?: string[]
  mediaSrc?: string
  mediaFallbackSrc?: string
  mediaVideoSrc?: string
  researchSlides?: ResearchSlide[]
  progressPercent: number
  checkpointState?: ProgressCheckpointState
  onNext: () => void
  onBack: () => void
}>()

const slides = computed(() => props.researchSlides ?? [])
const hasResearchSlides = computed(() => slides.value.length > 0)

const researchSlideIndex = ref(0)

function goResearchSlide(index: number) {
  if (!hasResearchSlides.value) return
  researchSlideIndex.value = Math.max(0, Math.min(index, slides.value.length - 1))
}

const currentResearchSlide = computed(() =>
  hasResearchSlides.value ? slides.value[researchSlideIndex.value] : undefined,
)

function onTrustImageError(event: Event) {
  const image = event.currentTarget as HTMLImageElement
  image.style.display = 'none'
}
</script>

<style scoped>
.quiz-trust-photo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quiz-trust-photo-single {
  display: block;
}
</style>