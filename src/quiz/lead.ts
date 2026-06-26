import type { LeadPayload, LeadSaveResult } from './types'

function generateLeadId(): string {
  const random = Math.random().toString(36).slice(2, 10)
  return `lead_${Date.now()}_${random}`
}

export async function saveLead(payload: LeadPayload): Promise<LeadSaveResult> {
  // TODO: Chatium integration. Save lead via Chatium API / Heap.
  // Example target fields: name, email, answers, weight, height, target weight, result type, calories, macros, UTM, date.
  void payload

  return {
    status: 'queued',
    leadId: generateLeadId(),
    savedAt: new Date().toISOString(),
  }
}
