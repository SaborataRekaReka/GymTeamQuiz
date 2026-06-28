<template>
  <svg v-if="label === 'Цель'" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
  <svg v-else-if="label === 'Зоны'" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 3c2 2 6 2 8 0" />
    <path d="M7 5c1 4 1 10-1 16" />
    <path d="M17 5c-1 4-1 10 1 16" />
    <path d="M8 13c2 1 6 1 8 0" />
  </svg>
  <svg v-else-if="label === 'Формат'" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 11l8-7 8 7" />
    <path d="M6 10v10h12V10" />
    <path d="M10 20v-6h4v6" />
  </svg>
  <svg v-else viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 20V10" />
    <path d="M12 20V5" />
    <path d="M18 20v-8" />
    <path d="M4 20h16" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
</script>