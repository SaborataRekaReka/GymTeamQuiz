/**
 * Клиентская отправка лида в серверный API-роут upsert.
 *
 * ВНИМАНИЕ ПО ПЛАТФОРМЕ:
 * Путь '/api/leads/upsert' зависит от того, как Chatium монтирует
 * файл chatium/api/leads/upsert.ts. Уточните точный URL у Chatium.
 */
import type { LeadPayload } from '../../src/quiz/types'

export interface LeadUpsertBody {
  sessionId: string
  name?: string
  email?: string
  consentAccepted?: boolean
  answers?: LeadPayload['answersByScreen']
  height?: number
  currentWeight?: number
  targetWeight?: number
  resultType?: string
  calorieNorm?: number
  macros?: LeadPayload['macros']
  utm?: Record<string, string>
  status?: 'draft' | 'completed'
}

const UPSERT_URL = '/api/leads/upsert'

export async function upsertLead(body: LeadUpsertBody): Promise<{ ok: boolean; leadId?: string }> {
  if (typeof fetch === 'undefined') {
    return { ok: false }
  }

  try {
    const response = await fetch(UPSERT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return { ok: false }
    }

    const data = (await response.json()) as { ok?: boolean; leadId?: string }
    return { ok: Boolean(data.ok), leadId: data.leadId }
  } catch {
    return { ok: false }
  }
}
