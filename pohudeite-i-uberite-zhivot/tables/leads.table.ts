// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TPohudeiteIUberiteZhivotQuizLeads8I8 = Heap.Table(
  't_pohudeite_i_uberite_zhivot_quiz_leads_8I8',
  {
    sessionId: Heap.Optional(Heap.String({ customMeta: { title: 'Session ID' } })),
    name: Heap.Optional(Heap.String({ customMeta: { title: 'Имя' } })),
    email: Heap.Optional(Heap.String({ customMeta: { title: 'Email' } })),
    consentAccepted: Heap.Optional(Heap.Boolean({ customMeta: { title: 'Согласие на обработку данных' } })),
    answers: Heap.Optional(Heap.Any()),
    height: Heap.Optional(Heap.Number({ customMeta: { title: 'Рост' } })),
    currentWeight: Heap.Optional(Heap.Number({ customMeta: { title: 'Текущий вес' } })),
    targetWeight: Heap.Optional(Heap.Number({ customMeta: { title: 'Целевой вес' } })),
    resultType: Heap.Optional(Heap.String({ customMeta: { title: 'Тип результата' } })),
    calorieNorm: Heap.Optional(Heap.Number({ customMeta: { title: 'Норма калорий' } })),
    macros: Heap.Optional(Heap.Any()),
    utm: Heap.Optional(Heap.Any()),
    status: Heap.Optional(Heap.String({ customMeta: { title: 'Статус (draft/completed)' } })),
  },
  { customMeta: { title: 'Лиды квиза' } },
)

// declaration merging: allows using table-related types via default import
export declare namespace TPohudeiteIUberiteZhivotQuizLeads8I8 {
  export type T = typeof TPohudeiteIUberiteZhivotQuizLeads8I8.T
  export type JsonT = typeof TPohudeiteIUberiteZhivotQuizLeads8I8.JsonT
  export type PropsT = typeof TPohudeiteIUberiteZhivotQuizLeads8I8.PropsT
  export type PatchT = typeof TPohudeiteIUberiteZhivotQuizLeads8I8.PatchT
  export type CreateInputT = typeof TPohudeiteIUberiteZhivotQuizLeads8I8.CreateInputT
}

export default TPohudeiteIUberiteZhivotQuizLeads8I8

export type TPohudeiteIUberiteZhivotQuizLeads8I8Row = TPohudeiteIUberiteZhivotQuizLeads8I8.T
export type TPohudeiteIUberiteZhivotQuizLeads8I8RowJson = TPohudeiteIUberiteZhivotQuizLeads8I8.JsonT
