// @shared

import type { LeadPayload } from '../src/quiz/types'
import { leadsUpsertRoute } from '../api/leads/upsert'

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

export async function upsertLead(body: LeadUpsertBody): Promise<{ ok: boolean; leadId?: string }> {
  if (typeof fetch === 'undefined') {
    return { ok: false }
  }

  try {
    const response = await fetch(leadsUpsertRoute.url(), {
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
