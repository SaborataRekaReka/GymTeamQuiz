import { jsx } from '@app/html-jsx'

// @shared
export function GetCourseEmbedBlock() {
  // TODO: Chatium integration. Insert real GetCourse order form embed HTML here.
  return (
    <div
      style={{
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        color: 'var(--text-muted)',
        fontSize: '14px',
        lineHeight: '20px',
        background: 'var(--surface)',
      }}
    >
      Здесь будет форма оформления заказа
    </div>
  )
}
