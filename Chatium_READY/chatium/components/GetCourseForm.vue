<template>
  <div ref="containerRef" class="paywall-getcourse-slot">
    <!-- Если форма GetCourse ещё не подключена в index.tsx, показываем заглушку. -->
    <div v-if="!moved" class="paywall-getcourse-placeholder" :style="placeholderStyle">
      Здесь будет форма оформления заказа
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Переносит (НЕ клонирует) скрытый узел #gcPaywallForm из index.tsx
 * в видимую область пейволла. При уходе с экрана возвращает узел обратно,
 * чтобы iframe формы GetCourse не перезагружался.
 */
const containerRef = ref<HTMLDivElement | null>(null)
const moved = ref(false)

const placeholderStyle = {
  border: '1px dashed var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '16px',
  color: 'var(--text-muted)',
  fontSize: '14px',
  lineHeight: '20px',
  background: 'var(--surface)',
}

onMounted(() => {
  const form = document.getElementById('gcPaywallForm')
  if (form && containerRef.value && form.children.length > 0) {
    containerRef.value.appendChild(form)
    form.style.display = 'block'
    moved.value = true
  }
})

onBeforeUnmount(() => {
  const form = document.getElementById('gcPaywallForm')
  const storage = document.getElementById('allGetcourseForms')
  if (form && storage) {
    storage.appendChild(form)
    form.style.display = 'none'
  }
})
</script>
