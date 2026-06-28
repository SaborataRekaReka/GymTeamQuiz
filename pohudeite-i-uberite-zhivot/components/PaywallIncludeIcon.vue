<template>
  <svg v-if="index === 0" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5z" /><path d="M9 9h7M9 13h7M9 17h4" /></svg>
  <svg v-else-if="index === 1" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19l5-5 4 4 5-9" /><circle cx="10" cy="14" r="1" /><circle cx="14" cy="18" r="1" /></svg>
  <svg v-else-if="index === 2" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7a5 5 0 0 0 10 0V3" /><path d="M12 15v6" /><path d="M8 21h8" /></svg>
  <svg v-else-if="index === 3" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
  <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" /></svg>
</template>

<script setup lang="ts">
defineProps<{ index: number }>()
</script>