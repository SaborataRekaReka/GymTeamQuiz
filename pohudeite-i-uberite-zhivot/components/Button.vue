<template>
  <button
    type="button"
    :disabled="disabled"
    :style="buttonStyle"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}>()

defineEmits<{ click: [] }>()

const buttonStyle = computed(() => {
  const primary = props.variant !== 'secondary'
  return {
    width: '100%',
    minHeight: '56px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid transparent',
    background: primary ? 'var(--primary)' : 'var(--primary-soft)',
    color: primary ? '#fff' : 'var(--primary)',
    padding: '14px 16px',
    fontSize: '17px',
    lineHeight: '22px',
    fontWeight: 700,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.6 : 1,
    transition: 'background 120ms ease',
  }
})
</script>