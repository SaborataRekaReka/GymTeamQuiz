<template>
  <svg v-if="isBelly" viewBox="0 0 56 56" aria-hidden="true">
    <path d="M22 8c3 3 9 3 12 0" />
    <path d="M20 12c2 9 2 22-3 34" />
    <path d="M36 12c-2 9-2 22 3 34" />
    <path d="M20 31c5 3 11 3 16 0" />
  </svg>
  <svg v-else-if="isGlutes" viewBox="0 0 56 56" aria-hidden="true">
    <path d="M18 16c4 8 4 22-2 32" />
    <path d="M38 16c-4 8-4 22 2 32" />
    <path d="M18 22c6 6 14 6 20 0" />
    <path d="M22 38c4 3 8 3 12 0" />
  </svg>
  <svg v-else viewBox="0 0 56 56" aria-hidden="true">
    <path d="M17 36l22-22" />
    <path d="M13 32l11 11" />
    <path d="M32 13l11 11" />
    <path d="M9 36l11 11" />
    <path d="M36 9l11 11" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ title: string }>()

const isBelly = computed(() => props.title.includes('Живот') || props.title.includes('талия'))
const isGlutes = computed(() => props.title.includes('Ягодицы') || props.title.includes('ног'))
</script>
