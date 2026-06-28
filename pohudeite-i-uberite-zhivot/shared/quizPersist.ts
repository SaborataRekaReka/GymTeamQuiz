// @shared

import type { QuizRuntimeState } from '../src/quiz/types'

const STATE_STORAGE_KEY = 'quiz_state_v1'
const SESSION_STORAGE_KEY = 'quiz_session_id'

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return `srv_${Date.now()}`
  }

  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (existing) return existing
  } catch {
    // ignore
  }

  const generated =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, generated)
  } catch {
    // ignore
  }

  return generated
}

export function loadQuizState(): QuizRuntimeState | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STATE_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as QuizRuntimeState
  } catch {
    return null
  }
}

export function saveQuizState(state: QuizRuntimeState): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function clearQuizState(): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(STATE_STORAGE_KEY)
  } catch {
    // ignore
  }
}
