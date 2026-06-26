<template>
  <div class="paywall-getcourse-slot">
    <button v-if="!hideTrigger" type="button" :style="openButtonStyle" @click="openModal">
      Открыть форму оплаты
    </button>

    <div v-if="isModalOpen" :style="overlayStyle" @click.self="closeModal">
      <div :style="modalStyle">
        <div :style="modalHeaderStyle">
          <strong :style="modalTitleStyle">Оформление доступа</strong>
          <button type="button" :style="closeButtonStyle" aria-label="Закрыть окно оплаты" @click="closeModal">✕</button>
        </div>

        <div ref="mountRef" />

        <!-- Если форма ещё загружается или недоступна, показываем статус. -->
        <div v-if="status !== 'ready'" class="paywall-getcourse-placeholder" :style="placeholderStyle">
          {{ statusText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  selectedTariffName?: string
  selectedTariffPeriod?: string
  openKey?: number
  hideTrigger?: boolean
}>()

const mountRef = ref<HTMLDivElement | null>(null)
const activeKey = ref<'week1' | 'month1' | 'month6' | null>(null)
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const isModalOpen = ref(false)
let requestToken = 0

const WIDGETS: Record<'week1' | 'month1' | 'month6', { scriptId: string; src: string }> = {
  week1: {
    scriptId: '4f4f90d7aa76c911433ad9f4e0b7ce69d6c58f71',
    src: 'https://usmanovafit.gymteam.ru/pl/lite/widget/script?id=1623294',
  },
  month1: {
    scriptId: '53504276f027a60f19a03dba932241e38dab0996',
    src: 'https://usmanovafit.gymteam.ru/pl/lite/widget/script?id=1576664',
  },
  month6: {
    scriptId: '3ff3df7c6116bc1675c6498d5afe53e52d77d0c0',
    src: 'https://usmanovafit.gymteam.ru/pl/lite/widget/script?id=1576666',
  },
}

const statusText = ref('Загрузка формы оформления заказа...')

const openButtonStyle = {
  width: '100%',
  minHeight: '52px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--primary)',
  background: 'var(--primary)',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
}

const overlayStyle = {
  position: 'fixed' as const,
  inset: '0',
  zIndex: 80,
  background: 'rgba(16, 21, 34, 0.66)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: '12px',
}

const modalStyle = {
  width: 'min(760px, 100%)',
  maxHeight: '90vh',
  overflowY: 'auto' as const,
  background: 'var(--surface)',
  borderRadius: '18px',
  boxShadow: '0 28px 64px rgba(11, 18, 38, 0.26)',
  padding: '14px',
}

const modalHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  marginBottom: '10px',
}

const modalTitleStyle = {
  fontSize: '17px',
  lineHeight: '24px',
  color: 'var(--text-main)',
}

const closeButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '999px',
  border: '1px solid var(--border)',
  background: 'var(--surface-soft)',
  color: 'var(--text-main)',
  fontSize: '20px',
  lineHeight: 1,
  cursor: 'pointer',
}

const placeholderStyle = {
  border: '1px dashed var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '16px',
  color: 'var(--text-muted)',
  fontSize: '14px',
  lineHeight: '20px',
  background: 'var(--surface)',
}

function normalize(text: string | undefined): string {
  return (text ?? '').trim().toLowerCase()
}

function resolveWidgetKey(period: string | undefined, tariffName: string | undefined): 'week1' | 'month1' | 'month6' {
  const normalizedPeriod = normalize(period)
  const normalizedName = normalize(tariffName)

  if (normalizedPeriod.includes('7') || normalizedPeriod.includes('нед')) return 'week1'
  if (normalizedPeriod.includes('6')) return 'month6'
  if (normalizedPeriod.includes('1')) return 'month1'

  if (normalizedName.includes('лёгк') || normalizedName.includes('легк')) return 'week1'
  if (normalizedName.includes('хит')) return 'month6'
  if (normalizedName.includes('популяр')) return 'month1'

  return 'month1'
}

function clearContainer(invalidate = true) {
  if (invalidate) {
    requestToken += 1
  }
  if (!mountRef.value) return
  mountRef.value.innerHTML = ''
}

function hasRenderedWidget(): boolean {
  if (!mountRef.value) return false
  return Boolean(mountRef.value.querySelector('iframe, form'))
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForWidgetRender(timeoutMs = 3500): Promise<boolean> {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    if (hasRenderedWidget()) return true
    await sleep(80)
  }
  return hasRenderedWidget()
}

async function startWidgetWhenReady(scriptId: string, token: number): Promise<void> {
  const fnName = `startWidget${scriptId}`
  const startedAt = Date.now()

  while (Date.now() - startedAt < 5000) {
    if (token !== requestToken || !isModalOpen.value) return

    const starter = (window as Record<string, unknown>)[fnName]
    if (typeof starter === 'function') {
      try {
        ;(starter as () => void)()
      } catch {
        if (token !== requestToken) return
        status.value = 'error'
        statusText.value = 'Не удалось инициализировать форму. Проверьте настройки виджета в GetCourse.'
        return
      }

      const rendered = await waitForWidgetRender()
      if (token !== requestToken) return

      if (!rendered) {
        status.value = 'error'
        statusText.value = 'Форма не отобразилась. Проверьте доступность виджета в GetCourse.'
        return
      }

      status.value = 'ready'
      return
    }

    await sleep(80)
  }

  if (token !== requestToken) return
  status.value = 'error'
  statusText.value = 'Не удалось загрузить функцию запуска формы. Проверьте виджет в GetCourse.'
}

function loadSelectedWidget() {
  if (!mountRef.value || !isModalOpen.value) return

  const token = ++requestToken

  const nextKey = resolveWidgetKey(props.selectedTariffPeriod, props.selectedTariffName)
  if (activeKey.value === nextKey && status.value === 'ready') return

  const widget = WIDGETS[nextKey]
  activeKey.value = nextKey
  status.value = 'loading'
  statusText.value = 'Загрузка формы оформления заказа...'
  clearContainer(false)

  const script = document.createElement('script')
  script.id = widget.scriptId
  script.src = widget.src
  script.async = true
  script.onerror = () => {
    if (token !== requestToken) return

    status.value = 'error'
    statusText.value = 'Не удалось загрузить форму. Проверьте подключение и настройки виджета в GetCourse.'
  }
  mountRef.value.appendChild(script)
  void startWidgetWhenReady(widget.scriptId, token)
}

function setBodyLock(locked: boolean) {
  if (typeof document === 'undefined') return
  document.body.style.overflow = locked ? 'hidden' : ''
}

async function openModal() {
  if (isModalOpen.value) return
  isModalOpen.value = true
  setBodyLock(true)
  await nextTick()
  loadSelectedWidget()
}

function closeModal() {
  isModalOpen.value = false
  setBodyLock(false)
  status.value = 'idle'
  statusText.value = 'Загрузка формы оформления заказа...'
  clearContainer()
}

onMounted(() => {
  if (typeof props.openKey === 'number' && props.openKey > 0) {
    void openModal()
  }
})

watch(
  () => [props.selectedTariffName, props.selectedTariffPeriod],
  () => {
    if (isModalOpen.value) {
      loadSelectedWidget()
    }
  },
)

watch(
  () => props.openKey,
  (next, prev) => {
    if (typeof next !== 'number') return
    if (next === prev) return
    void openModal()
  },
)

onBeforeUnmount(() => {
  setBodyLock(false)
  clearContainer()
})
</script>
