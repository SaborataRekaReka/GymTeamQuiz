import { jsx } from '@app/html-jsx'

export function Card(props: { children?: unknown; class?: string }) {
  return <div class={props.class ? `quiz-card ${props.class}` : 'quiz-card'}>{props.children}</div>
}

export function Stack(props: { children?: unknown }) {
  return <div class="quiz-stack">{props.children}</div>
}

export function Title(props: { text: string; class?: string }) {
  return <h1 class={props.class ? `quiz-title ${props.class}` : 'quiz-title'}>{props.text}</h1>
}

export function Subtitle(props: { text: string; class?: string }) {
  return <p class={props.class ? `quiz-subtitle ${props.class}` : 'quiz-subtitle'}>{props.text}</p>
}

export const BRAND_PHOTO_SRC = '/assets/quiz/hero/hero.webp'

export function OfferEyebrow(props: { text: string }) {
  return <p class="quiz-offer">{props.text}</p>
}

export function BrandHero() {
  return (
    <div class="quiz-brand">
      <img
        class="quiz-brand-photo"
        src={BRAND_PHOTO_SRC}
        alt="Екатерина Усманова"
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />
    </div>
  )
}

export function ConsentFooter(props: {
  offer: string
  privacy: string
  personalData: string
}) {
  return (
    <div class="quiz-consent">
      <span>Продолжая, вы соглашаетесь с обработкой персональных данных.</span>
      <LegalLinks offer={props.offer} privacy={props.privacy} personalData={props.personalData} />
    </div>
  )
}

export function Badge(props: { text: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '4px 10px',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-pill)',
        color: 'var(--text-muted)',
        fontSize: '12px',
        background: 'var(--surface-soft)',
      }}
    >
      {props.text}
    </span>
  )
}

export function Progress(props: { percent: number }) {
  const segments = 5
  const filled = (props.percent / 100) * segments

  return (
    <div class="quiz-progress" aria-label="progress">
      {Array.from({ length: segments }, (_, index) => {
        const ratio = Math.max(0, Math.min(1, filled - index))
        return (
          <span class="quiz-progress-segment">
            <span class="quiz-progress-segment-fill" style={{ transform: `scaleX(${ratio})` }} />
          </span>
        )
      })}
    </div>
  )
}

export function QuizHeader(props: {
  progressPercent: number
  onBack?: () => void
}) {
  return (
    <div class="quiz-header">
      <div class="quiz-header-logo-row" aria-hidden="true">
        <img class="quiz-header-logo" src="/assets/brand/usmanova-fit-logo.png" alt="" loading="lazy" decoding="async" />
      </div>

      <div class="quiz-header-progress-row">
        {props.onBack ? (
          <button
            type="button"
            aria-label="Назад"
            class="quiz-header-back"
            onClick={props.onBack}
          >
            <span class="quiz-header-back-icon" aria-hidden="true" />
          </button>
        ) : (
          <span class="quiz-header-back-placeholder" />
        )}

        <Progress percent={props.progressPercent} />
        <span class="quiz-header-percent">{Math.round(props.progressPercent)}%</span>
      </div>
    </div>
  )
}

export function Button(props: { label: string; onClick: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean }) {
  const primary = props.variant !== 'secondary'
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      style={{
        width: '100%',
        minHeight: '56px',
        borderRadius: 'var(--radius-lg)',
        border: primary ? '1px solid transparent' : '1px solid transparent',
        background: primary ? 'var(--primary)' : 'var(--primary-soft)',
        color: primary ? '#fff' : 'var(--primary)',
        padding: '14px 16px',
        fontSize: '17px',
        lineHeight: '22px',
        fontWeight: 700,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        transition: 'background 120ms ease',
      }}
    >
      {props.label}
    </button>
  )
}

export function StickyCta(props: { children?: unknown }) {
  return <div class="quiz-sticky-cta">{props.children}</div>
}

export function Input(props: {
  value: string
  placeholder?: string
  type?: 'text' | 'email' | 'number'
  autoComplete?: string
  name?: string
  unit?: string
  onInput: (value: string) => void
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--surface)',
          minHeight: '56px',
          padding: '0 16px',
        }}
      >
        <input
          type={props.type ?? 'text'}
          value={props.value}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          name={props.name}
          onInput={(event: Event) => props.onInput((event.currentTarget as HTMLInputElement).value)}
          onChange={(event: Event) => props.onInput((event.currentTarget as HTMLInputElement).value)}
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            fontSize: '17px',
            background: 'transparent',
          }}
        />
        {props.unit ? <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{props.unit}</span> : null}
      </div>
    </label>
  )
}

export function OptionButton(props: { label: string; selected: boolean; onClick: () => void; icon?: string }) {
  const hasIcon = Boolean(props.icon)
  const isSvgIcon = hasIcon && props.icon!.toLowerCase().endsWith('.svg')

  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-pressed={props.selected}
      class={props.selected ? 'quiz-option-button is-selected' : 'quiz-option-button'}
      style={{
        width: '100%',
        textAlign: 'left',
        minHeight: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        border: props.selected ? '1px solid var(--border-strong)' : '1px solid var(--border)',
        background: props.selected ? 'var(--primary-soft)' : 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        fontSize: '17px',
        lineHeight: '23px',
        fontWeight: 650,
        cursor: 'pointer',
        transition: 'transform 80ms ease, border 120ms ease, background 120ms ease',
      }}
    >
      {hasIcon && isSvgIcon ? (
        <span class="quiz-option-illus" style={{ '--opt-icon': `url(${props.icon})` }} aria-hidden="true" />
      ) : null}
      {hasIcon && !isSvgIcon ? (
        <img class="quiz-option-photo" src={props.icon} alt="" aria-hidden="true" />
      ) : null}
      <span class="quiz-option-text">{props.label}</span>
      <span
        class="quiz-option-icon"
        style={{
          borderColor: props.selected ? 'var(--primary)' : 'var(--border)',
          color: props.selected ? 'var(--primary)' : 'var(--text-soft)',
        }}
      >
        {props.selected ? <span class="quiz-option-check-icon" aria-hidden="true" /> : null}
      </span>
    </button>
  )
}

export function Checkbox(props: { checked: boolean; label: string; onToggle: (checked: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', lineHeight: '16px', color: 'var(--text-muted)' }}>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(event: Event) => props.onToggle((event.currentTarget as HTMLInputElement).checked)}
        style={{
          width: '16px',
          height: '16px',
          margin: 0,
          flexShrink: 0,
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          border: '1px solid var(--primary)',
          borderRadius: '999px',
          background: props.checked ? 'var(--primary)' : '#FFF',
          boxShadow: props.checked ? 'inset 0 0 0 4px #FFF' : 'none',
        }}
      />
      <span>{props.label}</span>
    </label>
  )
}

export function Accordion(props: { title: string; children?: unknown }) {
  return (
    <details style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', background: 'var(--surface)' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{props.title}</summary>
      <div style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '20px' }}>{props.children}</div>
    </details>
  )
}

export function LegalLinks(props: {
  offer: string
  privacy: string
  personalData: string
}) {
  return (
    <div class="quiz-legal">
      <a class="quiz-legal-link" href={props.offer} target="_blank" rel="noreferrer">Оферта</a>
      {' · '}
      <a class="quiz-legal-link" href={props.privacy} target="_blank" rel="noreferrer">Политика конфиденциальности</a>
      {' · '}
      <a class="quiz-legal-link" href={props.personalData} target="_blank" rel="noreferrer">Согласие на обработку персональных данных</a>
    </div>
  )
}

export function ErrorText(props: { text: string }) {
  return <div class="quiz-error">{props.text}</div>
}
