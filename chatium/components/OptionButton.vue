<template>
  <button
    type="button"
    :aria-pressed="selected"
    :class="['quiz-option-button', { 'is-selected': selected }]"
    :style="rootStyle"
    @click="$emit('click')"
  >
    <span
      v-if="hasIcon && isSvgIcon"
      class="quiz-option-illus"
      :style="{ '--opt-icon': `url(${icon})` }"
      aria-hidden="true"
    />
    <img v-if="hasIcon && !isSvgIcon" class="quiz-option-photo" :src="icon" alt="" aria-hidden="true" />

    <span class="quiz-option-text">{{ label }}</span>

    <span class="quiz-option-icon" :style="iconStyle">
      <span v-if="selected" class="quiz-option-check-icon" aria-hidden="true" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  selected: boolean
  icon?: string
}>()

defineEmits<{ click: [] }>()

const hasIcon = computed(() => Boolean(props.icon))
const isSvgIcon = computed(() => hasIcon.value && props.icon!.toLowerCase().endsWith('.svg'))

const rootStyle = computed(() => ({
  width: '100%',
  textAlign: 'left' as const,
  minHeight: '72px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '14px',
  border: props.selected ? '1px solid var(--border-strong)' : '1px solid var(--border)',
  background: props.selected ? 'var(--primary-soft)' : 'var(--surface)',
  borderRadius: 'var(--radius-lg)',
  padding: '16px 18px',
  fontSize: '17px',
  lineHeight: '23px',
  fontWeight: 650,
  cursor: 'pointer',
  transition: 'transform 80ms ease, border 120ms ease, background 120ms ease',
}))

const iconStyle = computed(() => ({
  borderColor: props.selected ? 'var(--primary)' : 'var(--border)',
  color: props.selected ? 'var(--primary)' : 'var(--text-soft)',
}))
</script>
