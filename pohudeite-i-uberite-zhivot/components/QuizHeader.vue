<template>
  <div class="quiz-header">
    <div class="quiz-header-logo-row" aria-hidden="true">
      <img class="quiz-header-logo" :src="assetUrl('/assets/brand/usmanova-fit-logo.png')" alt="" />
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

      <div ref="progressRef" class="quiz-progress" aria-label="progress">
        <span v-for="(seg, index) in segments" :key="index" class="quiz-progress-segment">
          <span class="quiz-progress-segment-fill" :style="{ transform: `scaleX(${seg})` }" />
        </span>

        <button
          v-for="checkpoint in visibleCheckpoints"
          :key="checkpoint.id"
          type="button"
          :class="checkpoint.buttonClass"
          :style="{ left: `${checkpoint.progress}%` }"
          :aria-label="checkpoint.title"
          @pointerdown.stop
          @touchstart.stop.prevent="onCheckpointTouchStart(checkpoint.id)"
          @mouseenter="onCheckpointHover(checkpoint.id)"
          @mouseleave="onCheckpointLeave"
          @focus="onCheckpointFocus(checkpoint.id)"
          @blur="onCheckpointBlur"
          @click.stop.prevent="onCheckpointClick(checkpoint.id)"
        >
          <span class="quiz-progress-checkpoint-dot" aria-hidden="true" />
        </button>

        <div
          v-if="openTooltip"
          :class="openTooltip.alignClass"
          class="quiz-progress-tooltip"
          :style="{ left: `${openTooltip.progress}%` }"
          role="status"
          aria-live="polite"
          @pointerdown.stop
        >
          <p class="quiz-progress-tooltip-title">{{ openTooltip.title }}</p>
          <p class="quiz-progress-tooltip-text">{{ openTooltip.text }}</p>
        </div>
      </div>

      <span class="quiz-header-percent">{{ roundedProgressPercent }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { assetUrl } from '../shared/assets'
import type { ProgressCheckpointState } from '../src/quiz/types'

const props = defineProps<{
  progressPercent: number
  onBack?: () => void
  checkpointState?: ProgressCheckpointState
}>()

const SEGMENT_COUNT = 5

const progressRef = ref<HTMLElement | null>(null)
const openTooltipId = ref<string>()
const supportsHover = ref(false)
let pointerEventsSupported = false
let suppressClickUntil = 0
let closeTimerId: ReturnType<typeof setTimeout> | undefined

const emptyCheckpointState: ProgressCheckpointState = {
  checkpoints: [],
  openedIds: [],
  contextKey: 'default',
}

const checkpointState = computed(() => props.checkpointState ?? emptyCheckpointState)

const segments = computed(() => {
  const filled = (props.progressPercent / 100) * SEGMENT_COUNT
  return Array.from({ length: SEGMENT_COUNT }, (_, index) =>
    Math.max(0, Math.min(1, filled - index)),
  )
})

const roundedProgressPercent = computed(() =>
  Math.max(0, Math.min(100, Math.round(props.progressPercent))),
)

const visibleCheckpoints = computed(() => {
  const opened = new Set(checkpointState.value.openedIds)
  return checkpointState.value.checkpoints
    .filter((checkpoint) => opened.has(checkpoint.id))
    .map((checkpoint) => {
      const stateClass =
        checkpoint.id === checkpointState.value.appearingId
          ? 'is-appearing'
          : checkpoint.id === checkpointState.value.activeId
            ? 'is-active'
            : 'is-completed'

      return {
        ...checkpoint,
        buttonClass: `quiz-progress-checkpoint ${stateClass}`,
        alignClass:
          checkpoint.progress <= 20
            ? 'is-left'
            : checkpoint.progress >= 80
              ? 'is-right'
              : 'is-center',
      }
    })
})

const openTooltip = computed(() =>
  visibleCheckpoints.value.find((checkpoint) => checkpoint.id === openTooltipId.value),
)

function clearCloseTimer() {
  if (closeTimerId) {
    clearTimeout(closeTimerId)
    closeTimerId = undefined
  }
}

function openCheckpointTooltip(id: string, autoClose: boolean) {
  openTooltipId.value = id
  clearCloseTimer()
  if (!autoClose) return
  closeTimerId = setTimeout(() => {
    if (openTooltipId.value === id) openTooltipId.value = undefined
  }, 3200)
}

function closeCheckpointTooltip() {
  openTooltipId.value = undefined
  clearCloseTimer()
}

function onCheckpointHover(id: string) {
  if (!supportsHover.value) return
  openCheckpointTooltip(id, false)
}

function onCheckpointLeave() {
  if (!supportsHover.value) return
  closeCheckpointTooltip()
}

function onCheckpointFocus(id: string) {
  openCheckpointTooltip(id, false)
}

function onCheckpointBlur() {
  if (!supportsHover.value) return
  closeCheckpointTooltip()
}

function onCheckpointTap(id: string) {
  if (openTooltipId.value === id) {
    closeCheckpointTooltip()
    return
  }
  openCheckpointTooltip(id, true)
}

function onCheckpointTouchStart(id: string) {
  suppressClickUntil = Date.now() + 700
  onCheckpointTap(id)
}

function onCheckpointClick(id: string) {
  if (Date.now() < suppressClickUntil) return
  onCheckpointTap(id)
}

function onPressOutside(event: Event) {
  if (!openTooltipId.value || !progressRef.value) return
  const target = event.target as Node | null
  if (!target || progressRef.value.contains(target)) return
  closeCheckpointTooltip()
}

watch(
  () => checkpointState.value.contextKey,
  () => {
    closeCheckpointTooltip()
  },
)

watch(
  () => checkpointState.value.appearingId,
  (appearingId, previousId) => {
    if (!appearingId || appearingId === previousId) return
    openCheckpointTooltip(appearingId, true)
  },
)

onBeforeUnmount(() => {
  clearCloseTimer()
  if (pointerEventsSupported) {
    document.removeEventListener('pointerdown', onPressOutside)
    return
  }
  document.removeEventListener('mousedown', onPressOutside)
  document.removeEventListener('touchstart', onPressOutside)
})

onMounted(() => {
  supportsHover.value = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  pointerEventsSupported = typeof window !== 'undefined' && 'PointerEvent' in window
  if (pointerEventsSupported) {
    document.addEventListener('pointerdown', onPressOutside)
    return
  }
  document.addEventListener('mousedown', onPressOutside)
  document.addEventListener('touchstart', onPressOutside)
})
</script>