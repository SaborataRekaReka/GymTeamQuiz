import type { LeadPayload, LeadSaveResult } from './types'

function generateLeadId(): string {
  const random = Math.random().toString(36).slice(2, 10)
  return `lead_${Date.now()}_${random}`
}

export async function saveLead(payload: LeadPayload): Promise<LeadSaveResult> {
  // TODO: Chatium integration. Replace with Chatium database insert/update operation.
  const leadId = generateLeadId()

  // TODO: Chatium integration. Persist payload into Chatium storage.
  void payload

  return {
    status: 'queued',
    leadId,
    savedAt: new Date().toISOString(),
  }
}
