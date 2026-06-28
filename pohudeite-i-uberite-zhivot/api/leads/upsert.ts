import Leads from '../../tables/leads.table'

export const leadsUpsertRoute = app
  .post('/')
  .body((s) => ({
    sessionId: s.string(),
    name: s.string().optional(),
    email: s.string().optional(),
    consentAccepted: s.boolean().optional(),
    answers: s.any().optional(),
    height: s.number().optional(),
    currentWeight: s.number().optional(),
    targetWeight: s.number().optional(),
    resultType: s.string().optional(),
    calorieNorm: s.number().optional(),
    macros: s.any().optional(),
    utm: s.any().optional(),
    status: s.string().optional(),
  }))
  .handle(async (ctx, req) => {
    const { sessionId, ...fields } = req.body

    if (!sessionId || !sessionId.trim()) {
      return { ok: false, error: 'sessionId is required' }
    }

    const existing = await Leads.findOneBy(ctx, { sessionId })

    const lead = existing
      ? await Leads.update(ctx, { id: existing.id, ...fields, status: fields.status ?? existing.status })
      : await Leads.create(ctx, { sessionId, status: fields.status ?? 'draft', ...fields })

    return { ok: true, leadId: lead.id, created: !existing }
  })
