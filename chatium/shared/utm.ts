/**
 * Безопасное чтение UTM-меток из URL по белому списку.
 * Используется в браузере (Vue onMounted), не на сервере.
 */
export interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

const ALLOWED_UTM_KEYS: Array<keyof UtmParams> = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
]

const MAX_UTM_LENGTH = 200

function sanitizeUtmValue(value: string): string {
  // Обрезаем длину и оставляем только безопасные символы.
  return value.replace(/[^\w\-.: %|/]/giu, '').slice(0, MAX_UTM_LENGTH)
}

export function readUtmFromUrl(): UtmParams {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  const result: UtmParams = {}

  for (const key of ALLOWED_UTM_KEYS) {
    const raw = params.get(key)
    if (raw && raw.trim()) {
      result[key] = sanitizeUtmValue(raw.trim())
    }
  }

  return result
}

const UTM_STORAGE_KEY = 'quiz_utm'

/**
 * UTM фиксируется при первом визите и не перезаписывается на последующих переходах.
 */
export function resolveUtm(): UtmParams {
  if (typeof window === 'undefined') return {}

  try {
    const stored = window.localStorage.getItem(UTM_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as UtmParams
    }
  } catch {
    // ignore
  }

  const fresh = readUtmFromUrl()

  try {
    if (Object.keys(fresh).length > 0) {
      window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fresh))
    }
  } catch {
    // ignore
  }

  return fresh
}
