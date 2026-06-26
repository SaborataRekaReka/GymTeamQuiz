<template>
  <div class="quiz-card">
    <div :class="hasResearchSlides ? 'quiz-transition-screen is-research' : 'quiz-transition-screen'">
      <div class="quiz-stack">
        <QuizHeader :progress-percent="progressPercent" :on-back="onBack" />

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
        <img v-else-if="mediaSrc" class="quiz-trust-photo" :src="mediaSrc" alt="" loading="lazy" decoding="async" aria-hidden="true" />

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

interface ResearchSlide {
  text: string
  source: string
}

const props = defineProps<{
  title?: string
  text?: string
  benefits?: string[]
  mediaSrc?: string
  mediaVideoSrc?: string
  researchSlides?: ResearchSlide[]
  progressPercent: number
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
</script>
