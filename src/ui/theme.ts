import { colors, radius, shadows, spacing, typography } from './tokens'

export const quizThemeCss = `
:root {
  --bg: ${colors.background};
  --surface: ${colors.surface};
  --surface-soft: ${colors.surfaceSoft};
  --surface-warm: ${colors.surfaceWarm};
  --text: ${colors.text};
  --text-muted: ${colors.textMuted};
  --text-soft: ${colors.textSoft};
  --border: ${colors.border};
  --border-strong: ${colors.borderStrong};
  --primary: ${colors.primary};
  --primary-hover: ${colors.primaryHover};
  --primary-soft: ${colors.primarySoft};
  --accent: ${colors.accent};
  --accent-soft: ${colors.accentSoft};
  --success: ${colors.success};
  --success-soft: ${colors.successSoft};
  --warning: ${colors.warning};
  --warning-soft: ${colors.warningSoft};
  --danger: ${colors.danger};
  --danger-soft: ${colors.dangerSoft};
  --ink: ${colors.ink};
  --ink-strong: ${colors.inkStrong};
  --ink-label: ${colors.inkLabel};
  --ink-muted: ${colors.inkMuted};
  --ink-soft: ${colors.inkSoft};
  --ink-soft-2: ${colors.inkSoft2};

  --z-base: 0;
  --z-raised: 1;
  --z-overlay: 3;
  --z-floating: 5;
  --z-sticky: 50;

  --space-xs: ${spacing.xs}px;
  --space-sm: ${spacing.sm}px;
  --space-md: ${spacing.md}px;
  --space-lg: ${spacing.lg}px;
  --space-xl: ${spacing.xl}px;
  --space-xxl: ${spacing.xxl}px;

  --radius-sm: ${radius.sm}px;
  --radius-md: ${radius.md}px;
  --radius-lg: ${radius.lg}px;
  --radius-xl: ${radius.xl}px;
  --radius-pill: ${radius.pill}px;

  --shadow-soft: ${shadows.soft};
  --shadow-card: ${shadows.card};
  --shadow-sticky: ${shadows.sticky};
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: var(--surface-soft);
  color: var(--text);
}

.quiz-shell {
  min-height: 100vh;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 20px 20px 32px;
}

.quiz-card {
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
}

.quiz-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.quiz-title {
  font-size: ${typography.questionTitle.fontSize}px;
  line-height: ${typography.questionTitle.lineHeight}px;
  font-weight: ${typography.questionTitle.fontWeight};
  margin: 0;
}

.quiz-subtitle {
  margin: 0;
  color: var(--text-muted);
  font-size: ${typography.subtitle.fontSize}px;
  line-height: ${typography.subtitle.lineHeight}px;
  font-weight: ${typography.subtitle.fontWeight};
}

.quiz-title.is-centered,
.quiz-subtitle.is-centered {
  text-align: center;
}

.quiz-subtitle.is-centered {
  max-width: 380px;
  margin-inline: auto;
}

.quiz-loader-copy {
  display: grid;
  gap: 8px;
}

.quiz-loader-copy.is-centered {
  text-align: center;
  justify-items: center;
}

.quiz-loader-copy.is-centered .quiz-subtitle {
  max-width: 380px;
}

.quiz-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.quiz-progress {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: center;
  gap: 3px;
}

.quiz-progress-segment {
  display: block;
  height: 4px;
  border-radius: var(--radius-pill);
  background: #FFFFFF;
  overflow: hidden;
}

.quiz-progress-segment-fill {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--primary);
  transform-origin: left center;
  transition: transform 180ms ease;
}

.quiz-header {
  display: grid;
  gap: 8px;
}

.quiz-header-logo-row {
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
}

.quiz-header-logo {
  width: 92px;
  height: auto;
  display: block;
}

.quiz-header-progress-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quiz-header-back {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  border: none;
  background: #FFF;
  color: var(--primary);
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease;
}

.quiz-header-back-placeholder {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.quiz-header-back-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-color: currentColor;
  -webkit-mask: url('/assets/icons/huge/back.svg') center / contain no-repeat;
  mask: url('/assets/icons/huge/back.svg') center / contain no-repeat;
}

.quiz-sticky-cta {
  position: sticky;
  bottom: 0;
  z-index: var(--z-sticky);
  margin-top: var(--space-sm);
  background: transparent;
  box-shadow: none;
  border-top: none;
  padding: 0 0 20px;
}

.quiz-error {
  color: var(--danger);
  font-size: ${typography.caption.fontSize}px;
  line-height: ${typography.caption.lineHeight}px;
}

.quiz-legal {
  font-size: ${typography.legal.fontSize}px;
  line-height: ${typography.legal.lineHeight}px;
  color: var(--text-muted);
}

.quiz-legal-link {
  color: var(--primary);
  text-decoration: none;
}

.quiz-legal-link:hover {
  text-decoration: underline;
}

.quiz-hero {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: linear-gradient(180deg, var(--primary-soft) 0%, var(--surface) 100%);
  padding: var(--space-md);
}

.quiz-plan-loader {
  border: none;
  border-radius: 0;
  background: transparent;
  padding: 0;
  display: grid;
  gap: 16px;
  overflow: visible;
}

.quiz-plan-indicator {
  width: 148px;
  height: 148px;
  margin: 4px auto 0;
  display: grid;
  place-items: center;
  position: relative;
}

.quiz-plan-ring {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-pill);
  background: conic-gradient(from 0deg, var(--primary) 0deg 86deg, rgba(220, 41, 114, 0.14) 86deg 360deg);
  animation: quizPlanRingLoad 4200ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.quiz-plan-ring::after {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: inherit;
  border: 1px solid var(--border);
  background: var(--surface);
}

.quiz-plan-core {
  width: 92px;
  height: 92px;
  border-radius: var(--radius-pill);
  background: linear-gradient(180deg, var(--surface) 0%, var(--accent-soft) 100%);
  box-shadow: 0 10px 28px rgba(220, 41, 114, 0.12);
  display: grid;
  place-items: center;
  position: relative;
  z-index: 1;
}

.quiz-plan-percent {
  width: 74px;
  height: 34px;
  display: block;
  position: relative;
}

.quiz-plan-percent-value {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--primary);
  font-size: 24px;
  line-height: 30px;
  font-weight: 800;
  opacity: 0;
  transform: translateY(8px);
}

.quiz-plan-percent-value.is-one { animation: quizPlanPercentOne 4200ms ease both; }
.quiz-plan-percent-value.is-two { animation: quizPlanPercentTwo 4200ms ease both; }
.quiz-plan-percent-value.is-three { animation: quizPlanPercentThree 4200ms ease both; }
.quiz-plan-percent-value.is-four { animation: quizPlanPercentFour 4200ms ease both; }

.quiz-plan-progress {
  display: grid;
  gap: 8px;
}

.quiz-plan-progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 16px;
  font-weight: 650;
}

.quiz-plan-track {
  height: 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  overflow: hidden;
}

.quiz-plan-fill {
  display: block;
  height: 100%;
  width: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
  transform: scaleX(0);
  transform-origin: left center;
  animation: quizPlanFill 4200ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.quiz-plan-status-list {
  position: relative;
  min-height: 48px;
}

.quiz-plan-status {
  position: absolute;
  inset: 0;
  min-height: 48px;
  border: none;
  background: transparent;
  padding: 10px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-weight: 500;
  opacity: 0;
  transform: translateY(6px);
  animation: quizPlanStatusSwap 1180ms ease forwards;
  animation-delay: var(--step-delay);
}

.quiz-plan-status span:last-child {
  width: min(100%, 310px);
  max-width: 280px;
}

.quiz-lead-gate-enter {
  animation: quizLeadGateEnter 420ms ease both;
  transform-origin: center top;
}

.quiz-plan-status.is-last {
  animation-name: quizPlanStatusLast;
}

.quiz-plan-status-dot {
  display: none;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(220, 41, 114, 0.28);
  background: var(--surface);
  flex-shrink: 0;
  position: relative;
}

.quiz-plan-status-dot::after {
  display: none;
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: inherit;
  background: var(--primary);
  transform: scale(0);
  animation: quizPlanDot 420ms ease forwards;
  animation-delay: calc(var(--step-delay) + 260ms);
}

.quiz-plan-ready {
  margin: 0;
  color: var(--primary);
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  text-align: center;
  opacity: 0;
  transform: translateY(6px);
  animation: quizPlanReady 480ms ease 3700ms forwards;
}

.quiz-loader-action {
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  animation: quizPlanReady 480ms ease 3950ms forwards;
}

.quiz-option-list {
  display: grid;
  gap: var(--space-sm);
}

.quiz-option-button {
  box-shadow: none;
}

@keyframes quizPlanRingLoad {
  0% {
    transform: rotate(0deg);
    background: conic-gradient(from 0deg, var(--primary) 0deg 56deg, rgba(220, 41, 114, 0.14) 56deg 360deg);
  }
  35% {
    transform: rotate(220deg);
    background: conic-gradient(from 0deg, var(--primary) 0deg 144deg, rgba(220, 41, 114, 0.14) 144deg 360deg);
  }
  70% {
    transform: rotate(560deg);
    background: conic-gradient(from 0deg, var(--primary) 0deg 278deg, rgba(220, 41, 114, 0.14) 278deg 360deg);
  }
  100% {
    transform: rotate(0deg);
    background: conic-gradient(from 0deg, var(--primary) 0deg 360deg, rgba(220, 41, 114, 0.14) 360deg 360deg);
  }
}

@keyframes quizPlanStatusSwap {
  0% {
    opacity: 0;
    transform: translateY(6px);
    color: var(--text-muted);
  }
  22%, 70% {
    opacity: 1;
    transform: translateY(0);
    color: var(--text);
  }
  100% {
    opacity: 0;
    transform: translateY(-6px);
    color: var(--text);
  }
}

@keyframes quizPlanStatusLast {
  0% {
    opacity: 0;
    transform: translateY(6px);
    color: var(--text-muted);
  }
  35%, 100% {
    opacity: 1;
    transform: translateY(0);
    color: var(--text);
  }
}

@keyframes quizPlanDot {
  0% { transform: scale(0); }
  70% { transform: scale(1.18); }
  100% { transform: scale(1); }
}

@keyframes quizPlanReady {
  to {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

@keyframes quizLeadGateEnter {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes quizPlanPercentOne {
  0%, 4% { opacity: 0; transform: translateY(8px); }
  9%, 22% { opacity: 1; transform: translateY(0); }
  28%, 100% { opacity: 0; transform: translateY(-8px); }
}

@keyframes quizPlanPercentTwo {
  0%, 24% { opacity: 0; transform: translateY(8px); }
  31%, 47% { opacity: 1; transform: translateY(0); }
  53%, 100% { opacity: 0; transform: translateY(-8px); }
}

@keyframes quizPlanPercentThree {
  0%, 50% { opacity: 0; transform: translateY(8px); }
  57%, 73% { opacity: 1; transform: translateY(0); }
  79%, 100% { opacity: 0; transform: translateY(-8px); }
}

@keyframes quizPlanPercentFour {
  0%, 76% { opacity: 0; transform: translateY(8px); }
  84%, 100% { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .quiz-plan-ring,
  .quiz-plan-status,
  .quiz-plan-status-dot::after,
  .quiz-plan-ready,
  .quiz-loader-action,
  .quiz-plan-percent-value,
  .quiz-lead-gate-enter {
    animation-duration: 1ms;
    animation-delay: 0ms;
  }
}

.quiz-option-icon {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-soft);
}

.quiz-option-check-icon {
  width: 14px;
  height: 14px;
  display: inline-block;
  background-color: currentColor;
  -webkit-mask: url('/assets/icons/huge/check.svg') center / contain no-repeat;
  mask: url('/assets/icons/huge/check.svg') center / contain no-repeat;
}

.quiz-offer {
  margin: 0;
  font-size: ${typography.subtitle.fontSize}px;
  line-height: ${typography.subtitle.lineHeight}px;
  font-weight: 600;
  color: var(--accent);
}

.quiz-brand {
  display: grid;
  justify-items: center;
}

.quiz-brand-photo {
  width: 100%;
  height: auto;
  display: block;
}

.quiz-trust-photo,
.quiz-trust-video {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 24px;
}

.quiz-transition-screen .quiz-title,
.quiz-transition-screen .quiz-subtitle {
  text-align: center;
}

.quiz-transition-screen .quiz-hero {
  text-align: center;
}

.quiz-transition-screen.is-research {
  min-height: clamp(560px, calc(100vh - 72px), 760px);
}

.quiz-transition-screen.is-research .quiz-stack {
  min-height: inherit;
}

.quiz-transition-screen.is-research .quiz-title {
  margin-top: clamp(6px, 2vh, 16px);
}

.quiz-transition-screen.is-research .quiz-research-slider {
  margin-block: clamp(22px, 8vh, 72px);
}

.quiz-transition-screen.is-research .quiz-actions {
  margin-top: auto;
  padding-top: clamp(8px, 2vh, 20px);
}

.quiz-benefit-list {
  display: grid;
  gap: 10px;
  justify-items: center;
}

.quiz-benefit-item {
  width: min(100%, 380px);
  margin: 0;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  opacity: 0;
  transform: translateY(8px);
  animation: quizBenefitReveal 420ms ease forwards;
  animation-delay: var(--benefit-delay, 0ms);
}

.quiz-benefit-check {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-pill);
  background: var(--primary-soft);
  position: relative;
  margin-top: 2px;
}

.quiz-benefit-check::before {
  content: '';
  position: absolute;
  width: 11px;
  height: 8px;
  border-left: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  transform: rotate(-45deg);
  top: 4px;
  left: 5px;
}

.quiz-benefit-text {
  color: var(--text);
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
}

@keyframes quizBenefitReveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quiz-research-slider {
  display: grid;
  gap: 14px;
}

.quiz-research-stage {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 48px;
  align-items: center;
  gap: 8px;
}

.quiz-research-copy {
  display: grid;
  gap: 10px;
  text-align: center;
}

.quiz-research-text {
  margin: 0;
  color: var(--text);
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

.quiz-research-source {
  margin: 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 17px;
}

.quiz-research-nav {
  width: 48px;
  height: 48px;
  border: 1px solid var(--primary);
  border-radius: var(--radius-pill);
  background: var(--primary-soft);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}

.quiz-research-nav:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.quiz-research-nav-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-color: currentColor;
  -webkit-mask: url('/assets/icons/huge/back.svg') center / contain no-repeat;
  mask: url('/assets/icons/huge/back.svg') center / contain no-repeat;
}

.quiz-research-nav.is-next .quiz-research-nav-icon {
  transform: rotate(180deg);
}

.quiz-research-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.quiz-research-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-pill);
  border: none;
  background: var(--border);
  padding: 0;
  cursor: pointer;
}

.quiz-research-dot.is-active {
  background: var(--primary);
}

.quiz-option-illus {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background: var(--accent-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.quiz-option-illus::before {
  content: '';
  width: 30px;
  height: 30px;
  background-color: var(--accent);
  -webkit-mask: var(--opt-icon) center / contain no-repeat;
  mask: var(--opt-icon) center / contain no-repeat;
}

.quiz-option-photo {
  width: 74px;
  height: 104px;
  object-fit: cover;
  object-position: center 14%;
  flex-shrink: 0;
  border-radius: 14px;
}

.quiz-option-text {
  flex: 1;
  min-width: 0;
}

.quiz-metric-section {
  display: grid;
  gap: 16px;
}

.quiz-metric-input-wrap {
  width: min(100%, 360px);
  margin: 6px auto 0;
  display: grid;
  gap: 10px;
}

.quiz-metric-input {
  display: inline-flex;
  justify-content: center;
  align-items: baseline;
  gap: 8px;
}

.quiz-metric-value {
  width: 170px;
  border: none;
  outline: none;
  background: transparent;
  text-align: right;
  font-size: clamp(46px, 13vw, 60px);
  line-height: 1;
  font-weight: 650;
  color: var(--text);
  padding: 0;
}

.quiz-metric-value::placeholder {
  color: var(--text-soft);
  opacity: 1;
  font-size: inherit;
  line-height: inherit;
  font-weight: inherit;
}

.quiz-metric-value::-webkit-outer-spin-button,
.quiz-metric-value::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quiz-metric-unit {
  font-size: clamp(44px, 12vw, 56px);
  line-height: 1;
  font-weight: 550;
  color: var(--text);
}

.quiz-metric-divider {
  display: block;
  width: 100%;
  height: 1px;
  border-radius: var(--radius-pill);
  background: var(--border);
}

.quiz-bmi-card {
  width: min(100%, 372px);
  margin: 0 auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface);
  padding: 16px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.quiz-bmi-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background-color: var(--text);
  -webkit-mask: var(--bmi-icon) center / contain no-repeat;
  mask: var(--bmi-icon) center / contain no-repeat;
  margin-top: 2px;
}

.quiz-bmi-content {
  display: grid;
  gap: 6px;
}

.quiz-bmi-title {
  margin: 0;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
  color: var(--text);
}

.quiz-bmi-text {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--text-muted);
}

.quiz-age-scale {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quiz-age-chip {
  flex: 1 1 calc(50% - 5px);
  min-height: 64px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: transform 80ms ease, border 120ms ease, background 120ms ease, box-shadow 120ms ease;
}

.quiz-age-chip:active {
  transform: scale(0.99);
}

.quiz-age-chip.is-selected {
  border: 1px solid var(--border-strong);
  background: var(--primary-soft);
}

.quiz-age-chip-value {
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
  color: var(--text);
}

.quiz-age-chip-unit {
  font-size: 12px;
  line-height: 16px;
  color: var(--text-soft);
}

.quiz-goal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quiz-goal-card {
  min-height: 132px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface);
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 80ms ease, border 120ms ease, background 120ms ease, box-shadow 120ms ease;
}

.quiz-goal-card:active {
  transform: scale(0.99);
}

.quiz-goal-card.is-selected {
  border: 1px solid var(--border-strong);
  background: var(--primary-soft);
}

.quiz-goal-card-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: var(--accent-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.quiz-goal-card-icon::before {
  content: '';
  width: 34px;
  height: 34px;
  background-color: var(--accent);
  -webkit-mask: var(--opt-icon) center / contain no-repeat;
  mask: var(--opt-icon) center / contain no-repeat;
}

.quiz-goal-card-text {
  font-size: 15px;
  line-height: 20px;
  font-weight: 650;
  color: var(--text);
}

.quiz-header-back:hover {
  background: var(--primary);
  color: #FFF;
}

.quiz-option-button:hover,
.quiz-age-chip:hover,
.quiz-goal-card:hover {
  background: #FAF4F8;
}

.quiz-option-button.is-selected:hover,
.quiz-age-chip.is-selected:hover,
.quiz-goal-card.is-selected:hover {
  background: #FFE9F4;
}

.quiz-weight-progress {
  width: min(100%, 360px);
  margin: 0 auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface);
  padding: 18px 16px;
  display: grid;
  gap: 14px;
}

.quiz-weight-progress-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.quiz-weight-point {
  display: grid;
  gap: 2px;
}

.quiz-weight-point.is-target {
  text-align: right;
}

.quiz-weight-point-label {
  font-size: 12px;
  line-height: 16px;
  color: var(--text-soft);
}

.quiz-weight-point-value {
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
  color: var(--text);
}

.quiz-weight-point.is-target .quiz-weight-point-value {
  color: var(--primary);
}

.quiz-weight-track {
  position: relative;
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--surface-soft);
  border: 1px solid var(--border);
}

.quiz-weight-track-fill {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--primary);
}

.quiz-weight-dot {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: var(--radius-pill);
  transform: translate(-50%, -50%);
  border: 3px solid var(--surface);
  box-sizing: border-box;
}

.quiz-weight-dot.is-current {
  background: var(--text-soft);
}

.quiz-weight-dot.is-target {
  background: var(--primary);
}

.quiz-weight-caption {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--text-muted);
}

.quiz-consent {
  text-align: center;
  font-size: ${typography.legal.fontSize}px;
  line-height: ${typography.legal.lineHeight}px;
  color: var(--text-soft);
  display: grid;
  gap: 4px;
}

.quiz-consent .quiz-legal {
  color: var(--text-soft);
}

@media (max-width: 360px) {
  .quiz-shell {
    padding: 18px 14px 28px;
  }

  .quiz-metric-input-wrap,
  .quiz-bmi-card {
    width: min(100%, 300px);
  }

  .quiz-bmi-title {
    font-size: 16px;
    line-height: 22px;
  }

  .quiz-title {
    font-size: 24px;
    line-height: 30px;
  }
}

@media (min-width: 768px) {
  .quiz-shell {
    max-width: 560px;
  }
}

.result-screen {
  display: grid;
  gap: 14px;
}

.result-intro {
  display: grid;
  gap: 6px;
}

.result-title {
  margin: 0;
  font-size: 24px;
  line-height: 30px;
  font-weight: 700;
}

.result-lead {
  margin: 0;
  color: var(--text-muted);
  font-size: 15px;
  line-height: 21px;
}

.result-hero {
  border-radius: var(--radius-xl);
  background: linear-gradient(160deg, var(--primary-soft) 0%, var(--surface) 68%);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  padding: 22px 20px;
  display: grid;
  gap: 16px;
}

.result-hero-weights {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
}

.result-weight {
  display: grid;
  gap: 4px;
  justify-items: center;
  text-align: center;
}

.result-weight-caption {
  font-size: 13px;
  line-height: 17px;
  color: var(--text-muted);
  font-weight: 600;
}

.result-weight-value {
  font-size: 40px;
  line-height: 44px;
  font-weight: 800;
  color: var(--text);
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.result-weight.is-target .result-weight-value {
  color: var(--primary);
}

.result-weight-unit {
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
  color: var(--text-soft);
}

.result-weight.is-target .result-weight-unit {
  color: var(--primary);
}

.result-hero-arc {
  position: relative;
  width: 72px;
  height: 40px;
  align-self: center;
}

.result-hero-line {
  position: absolute;
  left: 6px;
  right: 6px;
  top: 50%;
  height: 3px;
  transform: translateY(-50%);
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, var(--border-strong) 0%, var(--primary) 100%);
  opacity: 0.5;
}

.result-hero-dot {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: var(--radius-pill);
  transform: translate(-50%, -50%);
}

.result-hero-dot.is-start {
  left: 6px;
  background: #FFFFFF;
  border: 2px solid var(--text-soft);
}

.result-hero-dot.is-end {
  left: calc(100% - 6px);
  background: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-soft);
}

.result-hero-diff {
  justify-self: center;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: #FFFFFF;
  border: 1px solid var(--border);
  color: var(--primary);
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
}

.result-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 18px;
  display: grid;
  gap: 12px;
}

.result-card-title {
  margin: 0;
  font-size: 17px;
  line-height: 22px;
  font-weight: 700;
}

.result-card-note {
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 18px;
}

.result-inputs {
  display: grid;
  gap: 12px;
}

.result-input-chip {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  justify-items: start;
  align-content: start;
  gap: 6px;
  padding: 4px 2px;
  border-radius: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.result-input-icon {
  grid-row: 1;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #FDEDF5;
  color: #C95B8F;
}

.result-input-icon svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.result-input-label {
  font-size: 13px;
  line-height: 17px;
  color: var(--ink-label);
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.result-input-value {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--ink-muted);
}

.result-calories {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-calories-value {
  font-size: 36px;
  line-height: 40px;
  font-weight: 800;
  color: var(--primary);
}

.result-calories-unit {
  font-size: 13px;
  line-height: 16px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.result-macros {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.result-macro {
  display: grid;
  gap: 4px;
  justify-items: center;
  text-align: center;
  padding: 14px 8px;
  border-radius: var(--radius-md);
  background: var(--surface-soft);
}

.result-macro.is-protein { background: var(--accent-soft); }
.result-macro.is-fat { background: var(--surface-warm); }
.result-macro.is-carbs { background: var(--primary-soft); }

.result-macro-value {
  font-size: 20px;
  line-height: 24px;
  font-weight: 800;
  color: var(--text);
}

.result-macro-label {
  font-size: 13px;
  line-height: 17px;
  color: var(--text-muted);
  font-weight: 600;
}

.result-bmi-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.result-bmi-value {
  font-size: 26px;
  line-height: 30px;
  font-weight: 800;
  color: var(--primary);
}

.result-bmi-scale {
  position: relative;
  padding-top: 6px;
}

.result-bmi-track {
  height: 10px;
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, #8FCBE8 0%, #6FC79A 32%, #F2C46B 64%, #E88A8A 100%);
}

.result-bmi-marker {
  position: absolute;
  top: 2px;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-pill);
  background: #FFFFFF;
  border: 3px solid var(--primary);
  box-shadow: var(--shadow-card);
  transform: translateX(-50%);
}

.result-bmi-legend {
  display: flex;
  justify-content: space-between;
  color: var(--text-soft);
  font-size: 11px;
  line-height: 15px;
  font-weight: 600;
}

.result-programs {
  display: grid;
  gap: 12px;
}

.result-programs-list {
  display: grid;
  gap: 12px;
}

.result-program {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 16px 18px;
  display: grid;
  gap: 8px;
}

.result-program-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.result-program-badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
}

.result-program-title {
  margin: 0;
  font-size: 16px;
  line-height: 21px;
  font-weight: 700;
}

.result-program-reason {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 20px;
}

.result-final {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  border-radius: var(--radius-lg);
  background: linear-gradient(160deg, var(--primary-soft) 0%, var(--surface) 80%);
  border: 1px solid var(--border);
}

.result-final-check {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--primary);
  position: relative;
}

.result-final-check::after {
  content: '';
  position: absolute;
  left: 14px;
  top: 11px;
  width: 9px;
  height: 16px;
  border: solid #FFFFFF;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.result-final-copy {
  display: grid;
  gap: 4px;
}

.result-final-title {
  font-size: 16px;
  line-height: 21px;
  font-weight: 700;
  color: var(--text);
}

.result-final-text {
  font-size: 14px;
  line-height: 20px;
  color: var(--text-muted);
}

.quiz-shell:has(.result-page) {
  max-width: 720px;
  padding-bottom: 150px;
}

.result-page .quiz-header {
  gap: 12px;
  margin-bottom: 2px;
}

.result-page .quiz-header-logo {
  width: 112px;
}

.result-page .quiz-header-back {
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--shadow-card);
}

.result-page .quiz-progress-segment {
  height: 5px;
  background: #F1E6EE;
}

.result-screen {
  gap: 16px;
  min-width: 0;
}

.result-showcase {
  display: grid;
  gap: 16px;
  position: relative;
  min-width: 0;
}

.result-showcase-main {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.result-showcase-aside {
  display: none;
}

.result-showcase-photo {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: right bottom;
}

.result-intro {
  gap: 10px;
  padding-top: 2px;
}

.result-title {
  display: grid;
  gap: 2px;
  margin: 0;
  color: var(--ink);
  font-size: 31px;
  line-height: 36px;
  font-weight: 800;
}

.result-title-main,
.result-title-line {
  display: block;
}

.result-title-line {
  font-size: 38px;
  line-height: 42px;
}

.result-title-line strong {
  color: var(--primary);
  font-size: 1.12em;
  font-weight: 800;
}

.result-lead {
  max-width: 520px;
  color: var(--ink-muted);
  font-size: 16px;
  line-height: 23px;
}

.result-hero {
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 14px;
  background-color: transparent;
  background-image: var(--hero-notch-shape);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center top;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  box-shadow: none;
  padding: 18px;
  gap: 14px;
  --hero-notch-shape: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='220' viewBox='0 0 600 220'%3E%3Cpath d='M0 0H532V38H600V220H0Z' fill='%23FFFFFF' fill-opacity='0.92'/%3E%3C/svg%3E");
}

.result-hero::before {
  content: none;
}

.result-hero::after {
  content: none;
}

.result-hero > * {
  position: relative;
  z-index: 2;
}

.result-hero-title {
  margin: 0;
  color: var(--ink-strong);
  font-size: 18px;
  line-height: 23px;
  font-weight: 800;
}

.result-journey {
  position: relative;
  min-height: 322px;
  margin-top: 2px;
  border-radius: 14px;
  background: #FFFFFF;
  overflow: hidden;
}

.result-journey::before {
  content: none;
}

.result-journey-stat {
  position: absolute;
  top: 4%;
  z-index: 4;
  display: grid;
  gap: 2px;
}

.result-journey-stat.is-current {
  left: 2%;
}

.result-journey-stat.is-target {
  right: 2%;
  justify-items: end;
  text-align: right;
}

.result-journey-caption {
  font-size: 13px;
  line-height: 17px;
  font-weight: 700;
  color: var(--ink-muted);
}

.result-journey-stat.is-target .result-journey-caption {
  color: var(--primary);
}

.result-journey-weight {
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
  font-size: 40px;
  line-height: 42px;
  font-weight: 800;
  color: var(--ink);
}

.result-journey-unit {
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
}

.result-journey-stat.is-target .result-journey-weight,
.result-journey-stat.is-target .result-journey-unit {
  color: var(--primary);
}

.result-journey-arc {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 96px;
  object-fit: cover;
  object-position: center top;
  transform: none;
  z-index: 0;
  opacity: 0.82;
  pointer-events: none;
}

.result-journey-figures {
  position: absolute;
  inset: 0;
  z-index: 3;
}

.result-journey-figure {
  position: absolute;
  bottom: 64px;
  width: 38%;
  height: clamp(140px, 38vw, 178px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.result-journey-figure.is-current {
  left: 24%;
  transform: translateX(-50%);
}

.result-journey-figure.is-target {
  left: 76%;
  transform: translateX(-50%);
}

.result-journey-image {
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom center;
  display: block;
  filter: drop-shadow(0 14px 22px rgba(30, 34, 48, 0.12));
}

.result-journey-image.is-hidden {
  display: none;
}

.result-journey-placeholder {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
}

.result-journey-placeholder.is-hidden {
  display: none;
}

.result-journey-silhouette {
  width: 64px;
  height: 90%;
  border-radius: 46% 46% 40% 40%;
  background: linear-gradient(180deg, #F17AAA 0%, #F6A7C0 100%);
  position: relative;
  box-shadow: 0 12px 22px rgba(220, 41, 114, 0.18);
}

.result-journey-silhouette::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -18px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transform: translateX(-50%);
  background: #E5B28F;
}

.result-journey-silhouette.is-target {
  width: 54px;
}

.result-journey-arrow {
  position: absolute;
  left: 50%;
  top: 42.5%;
  width: clamp(84px, 24vw, 106px);
  height: auto;
  display: block;
  transform: translate(-50%, -50%);
  color: var(--primary);
  z-index: 3;
  overflow: visible;
  pointer-events: none;
  filter: drop-shadow(0 6px 12px rgba(220, 41, 114, 0.30));
}

.result-journey-goal {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  z-index: 5;
  display: grid;
  justify-items: center;
  gap: 0;
  text-align: center;
  color: var(--ink);
}

.result-journey-goal-label {
  font-size: 13px;
  line-height: 16px;
  font-weight: 800;
}

.result-journey-goal-value {
  color: var(--primary);
  font-size: 32px;
  line-height: 34px;
  font-weight: 900;
  letter-spacing: 0;
}

.result-journey-goal-unit {
  margin-left: 4px;
  color: var(--ink);
  font-size: 16px;
  line-height: 18px;
  font-weight: 800;
}

.result-journey-goal-note {
  color: var(--primary);
  font-size: 15px;
  line-height: 18px;
  font-weight: 800;
  white-space: nowrap;
}

.result-card {
  position: relative;
  overflow: hidden;
  min-width: 0;
  border: none;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.94);
  padding: 18px;
  gap: 14px;
}

.result-card-title {
  color: var(--ink-strong);
  font-size: 18px;
  line-height: 23px;
  font-weight: 800;
}

.result-card-note {
  color: var(--ink-muted);
  font-size: 13px;
  line-height: 18px;
}

.result-card-heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-card-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-soft);
  position: relative;
  flex: 0 0 auto;
}

.result-card-icon::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 2px solid var(--primary);
  border-radius: 50%;
}

.result-card-icon.is-bmi::before {
  inset: 9px 7px;
  border-radius: 999px 999px 6px 6px;
}

.result-inputs {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.result-input-chip {
  grid-template-columns: 40px minmax(0, 1fr);
  grid-template-rows: auto auto;
  align-content: center;
  align-items: center;
  column-gap: 12px;
  row-gap: 2px;
  min-height: 78px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: var(--primary-soft);
  border: none;
  box-shadow: none;
}

.result-input-icon {
  grid-row: 1 / span 2;
  align-self: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  color: var(--primary);
}

.result-input-icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.result-input-label {
  align-self: end;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.result-input-value {
  align-self: start;
  color: var(--ink);
  font-size: 15px;
  line-height: 19px;
  font-weight: 700;
}

.result-metrics-grid {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.result-nutrition-card {
  background:
    radial-gradient(circle at 92% 20%, rgba(220, 41, 114, 0.09), transparent 25%),
    #FFFFFF;
}

.result-nutrition-decor {
  position: absolute;
  right: 20px;
  top: 50px;
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: #FFFFFF url('/assets/quiz/result/food.webp') center / contain no-repeat;
  border: 2px solid rgba(255, 255, 255, 0.88);
  box-shadow: 0 14px 30px rgba(30, 34, 48, 0.06);
}

.result-calories {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 9px;
  padding-right: 72px;
}

.result-calories-value {
  color: var(--ink);
  font-size: 44px;
  line-height: 46px;
  letter-spacing: 0;
}

.result-calories-unit {
  color: var(--ink);
  font-size: 13px;
  line-height: 16px;
  font-weight: 600;
}

.result-macros {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.result-macro {
  justify-items: start;
  text-align: left;
  gap: 4px;
  min-height: 72px;
  padding: 12px 10px;
  border-radius: 18px;
  background: #FFF2F8;
}

.result-macro.is-protein { background: #FFF0F7; }
.result-macro.is-fat { background: #FFF0FB; }
.result-macro.is-carbs { background: #F7EDFF; }

.result-macro-label {
  order: -1;
  color: var(--primary);
  font-size: 12px;
  line-height: 16px;
  font-weight: 800;
}

.result-macro-value {
  color: var(--ink);
  font-size: 22px;
  line-height: 25px;
}

.result-bmi-card {
  background: linear-gradient(160deg, #FFFFFF 0%, #F9F7FF 100%);
}

.result-bmi-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-bmi-value {
  color: var(--ink);
  font-size: 44px;
  line-height: 46px;
  letter-spacing: 0;
}

.result-bmi-status {
  display: inline-flex;
  padding: 6px 11px;
  border-radius: var(--radius-pill);
  background: #FFE5F2;
  color: var(--primary);
  font-size: 12px;
  line-height: 16px;
  font-weight: 800;
}

.result-bmi-scale {
  padding-top: 10px;
  margin-top: 2px;
}

.result-bmi-track {
  height: 12px;
  background: linear-gradient(90deg, #BEE4FF 0%, #A8E9BF 34%, #FFE38F 64%, #FF9FB9 100%);
}

.result-bmi-marker {
  top: 6px;
  width: 20px;
  height: 20px;
  border: 4px solid var(--primary);
  box-shadow: 0 8px 20px rgba(220, 41, 114, 0.22);
}

.result-bmi-legend {
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 15px;
  font-weight: 700;
}

.result-programs {
  gap: 12px;
  min-width: 0;
}

.result-programs-subtitle {
  margin: 0;
  color: var(--ink-muted);
  font-size: 14px;
  line-height: 20px;
}

.result-programs-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: #FFFFFF;
  color: var(--primary);
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-card);
  flex: 0 0 auto;
  cursor: pointer;
}

.result-programs-arrow.is-left {
  left: 8px;
  right: auto;
  opacity: 0;
  pointer-events: none;
}

.result-programs-arrow.is-left.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.result-programs-arrow.is-left .result-programs-arrow-icon {
  transform: rotate(-135deg);
  margin-left: 2px;
}

.result-programs-arrow-icon {
  width: 8px;
  height: 8px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  transform: rotate(45deg);
  margin-left: -2px;
}

.result-programs-carousel {
  position: relative;
  min-width: 0;
}

.result-programs-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 0 4px;
  scroll-snap-type: none;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.result-programs-list * {
  user-select: none;
  -webkit-user-select: none;
}

.result-programs-list::-webkit-scrollbar {
  display: none;
}

.result-programs-list.is-dragging {
  cursor: grabbing;
  user-select: none;
  scroll-behavior: auto;
}

.result-programs-list.is-dragging .result-program {
  pointer-events: none;
}

.result-program {
  flex: 0 0 90%;
  scroll-snap-align: start;
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  align-items: stretch;
  min-height: 148px;
  border: none;
  border-radius: 26px;
  background: #FFFFFF;
  box-shadow: none;
  padding: 0;
  overflow: hidden;
}

.result-program-image-wrap {
  position: relative;
  min-height: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: transparent;
}

.result-program-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  object-position: center bottom;
  padding: 0;
  display: block;
  -webkit-user-drag: none;
}

.result-page .quiz-sticky-cta button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.result-page .quiz-sticky-cta button::before {
  content: '';
  width: 14px;
  height: 16px;
  flex: 0 0 auto;
  background: #FFFFFF;
  -webkit-mask: url('/assets/icons/result/lock.svg') center / contain no-repeat;
  mask: url('/assets/icons/result/lock.svg') center / contain no-repeat;
}

.result-program-fallback {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 10px;
  padding: 12px;
  text-align: center;
  color: var(--primary);
}

.result-program-fallback.is-hidden {
  display: none;
}

.result-program-fallback-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.76);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.result-program-fallback-icon svg {
  width: 30px;
  height: 30px;
}

.result-program-fallback-title {
  font-size: 13px;
  line-height: 16px;
  font-weight: 700;
}

.result-program-copy {
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;
  padding: 12px 14px 12px 10px;
}

.result-program-badge {
  background: #FFE5F2;
  color: var(--primary);
  font-size: 11px;
  line-height: 15px;
  font-weight: 800;
}

.result-program-title {
  color: var(--ink-strong);
  font-size: 18px;
  line-height: 22px;
  font-weight: 800;
}

.result-program-reason {
  color: var(--ink-soft-2);
  font-size: 13px;
  line-height: 18px;
}

@media (min-width: 980px) {
  .result-showcase {
    display: block;
    min-height: 430px;
    padding: 8px 0 24px;
    overflow: hidden;
  }

  .result-showcase::before {
    content: '';
    position: absolute;
    right: -76px;
    bottom: 24px;
    width: 340px;
    height: 330px;
    border-radius: 120px 0 0 0;
    background: url('/assets/quiz/result/gradient_background.webp') center / cover no-repeat;
    opacity: 0.95;
    z-index: 0;
  }

  .result-showcase-main {
    position: relative;
    z-index: 3;
    width: 100%;
    padding-top: 10px;
  }

  .result-showcase-aside {
    display: block;
    position: absolute;
    right: 2px;
    top: 0;
    bottom: 24px;
    width: 226px;
    height: auto;
    z-index: 4;
    overflow: hidden;
    pointer-events: none;
  }

  .result-showcase-photo {
    position: absolute;
    right: -16px;
    top: 0;
    bottom: auto;
    width: 146px;
    height: 515px;
    object-fit: contain;
    object-position: center top;
    transform: scale(1.12);
    transform-origin: right top;
  }

  .result-intro {
    padding-top: 0;
    gap: 12px;
  }

  .result-title {
    max-width: 520px;
    font-size: 36px;
    line-height: 41px;
  }

  .result-title-line {
    font-size: 44px;
    line-height: 48px;
  }

  .result-lead {
    max-width: 430px;
    font-size: 16px;
    line-height: 23px;
  }

  .result-hero {
    width: calc(100% - 92px);
    min-height: 206px;
    margin-top: 10px;
    padding: 16px 24px 12px;
    border-radius: 14px;
    overflow: hidden;
    --hero-notch-shape: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='220' viewBox='0 0 600 220'%3E%3Cpath d='M0 0H520V46H600V220H0Z' fill='%23FFFFFF' fill-opacity='0.92'/%3E%3C/svg%3E");
    box-shadow: none;
  }

  .result-hero::after {
    content: none;
  }

  .result-hero-title {
    font-size: 20px;
    line-height: 24px;
  }

  .result-journey {
    min-height: 154px;
    margin-top: 4px;
    border-radius: 14px;
    background: transparent;
    overflow: hidden;
  }

  .result-journey-stat {
    top: 16px;
  }

  .result-journey-stat.is-current {
    left: 0;
  }

  .result-journey-stat.is-target {
    top: 16px;
    right: 42px;
  }

  .result-journey-weight {
    font-size: 44px;
    line-height: 46px;
  }

  .result-journey-unit {
    font-size: 18px;
  }

  .result-journey-figure {
    bottom: 0;
    width: 23%;
    height: 150px;
  }

  .result-journey-figure.is-current {
    left: 30%;
  }

  .result-journey-figure.is-target {
    left: 70%;
  }

  .result-journey-arc {
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 96px;
  }

  .result-journey-arrow {
    top: 28%;
    width: 86px;
  }

  .result-journey-goal {
    bottom: 14px;
  }

  .result-journey-goal-label {
    font-size: 14px;
    line-height: 17px;
  }

  .result-journey-goal-value {
    font-size: 38px;
    line-height: 38px;
  }

  .result-journey-goal-unit {
    font-size: 18px;
    line-height: 20px;
  }
}

@media (min-width: 560px) {
  .result-inputs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .result-program {
    flex-basis: min(70%, 420px);
  }

  .result-programs-list {
    padding-right: 44px;
  }

  .result-programs-arrow {
    display: inline-flex;
  }
}

@media (min-width: 430px) and (max-width: 979.98px) {
  .result-showcase {
    display: block;
    overflow: hidden;
  }

  .result-showcase::before {
    content: '';
    position: absolute;
    top: 90px;
    right: -134px;
    width: 290px;
    height: 360px;
    border-radius: 112px 0 0 0;
    background: url('/assets/quiz/result/gradient_background.webp') center / cover no-repeat;
    opacity: 0.88;
    z-index: 0;
  }

  .result-showcase-main {
    position: relative;
    z-index: 2;
  }

  .result-hero {
    border-radius: 14px;
    overflow: hidden;
    --hero-notch-shape: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='220' viewBox='0 0 600 220'%3E%3Cpath d='M0 0H526V42H600V220H0Z' fill='%23FFFFFF' fill-opacity='0.92'/%3E%3C/svg%3E");
    box-shadow: none;
  }

  .result-showcase-aside {
    display: block;
    position: absolute;
    top: 42px;
    right: 8px;
    width: 172px;
    height: 392px;
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
  }

  .result-showcase-photo {
    position: absolute;
    top: 0;
    right: -10px;
    width: 132px;
    height: 420px;
    object-fit: contain;
    object-position: center top;
    transform: scale(1.06);
    transform-origin: right top;
    filter: drop-shadow(0 18px 28px rgba(30, 34, 48, 0.12));
  }

  .result-title,
  .result-lead {
    max-width: calc(100% - 132px);
  }

  .result-journey-figure {
    width: 30%;
  }

  .result-journey-figure.is-current {
    left: 22%;
  }

  .result-journey-figure.is-target {
    left: 78%;
  }

  .result-journey-arrow {
    width: clamp(50px, 13vw, 70px);
  }
}

@media (min-width: 560px) and (max-width: 979.98px) {
  .result-hero {
    --hero-notch-shape: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='220' viewBox='0 0 600 220'%3E%3Cpath d='M0 0H522V44H600V220H0Z' fill='%23FFFFFF' fill-opacity='0.92'/%3E%3C/svg%3E");
  }
}

@media (min-width: 381px) and (max-width: 429.98px) {
  .result-journey-figure {
    width: 30%;
  }

  .result-journey-figure.is-current {
    left: 22%;
  }

  .result-journey-figure.is-target {
    left: 78%;
  }

  .result-journey-arrow {
    width: clamp(50px, 13vw, 62px);
  }
}

@media (min-width: 680px) {
  .result-metrics-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

@media (max-width: 380px) {
  .result-title {
    font-size: 28px;
    line-height: 33px;
  }

  .result-title-line {
    font-size: 34px;
    line-height: 38px;
  }

  .result-hero {
    padding: 16px;
    --hero-notch-shape: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='220' viewBox='0 0 600 220'%3E%3Cpath d='M0 0H538V34H600V220H0Z' fill='%23FFFFFF' fill-opacity='0.92'/%3E%3C/svg%3E");
  }

  .result-journey {
    min-height: 300px;
  }

  .result-journey-arc {
    bottom: 0;
    width: 100%;
    height: 84px;
  }

  .result-journey-weight {
    font-size: 34px;
    line-height: 36px;
  }

  .result-journey-figure {
    bottom: 58px;
    width: 30%;
    height: clamp(120px, 44vw, 168px);
  }

  .result-journey-figure.is-current {
    left: 22%;
  }

  .result-journey-figure.is-target {
    left: 78%;
  }

  .result-journey-arrow {
    top: 41%;
    width: clamp(52px, 16vw, 64px);
  }

  .result-inputs,
  .result-macros {
    gap: 8px;
  }

  .result-input-chip {
    padding: 11px;
  }

  .result-calories-value,
  .result-bmi-value {
    font-size: 38px;
    line-height: 42px;
  }
}

@media (max-width: 429.98px) {
  .result-hero {
    background-color: #FFFFFF;
    background-image: none;
    border-radius: 18px;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }

  .result-journey {
    background: transparent;
  }
}

    /* ===== Paywall (screen 24) ===== */
    .quiz-shell:has(.paywall) {
      max-width: 720px;
    }

    .paywall {
      display: grid;
      gap: 18px;
    }

    .paywall-section {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-soft);
      padding: 20px 18px;
      display: grid;
      gap: 14px;
    }

    .paywall-h {
      margin: 0;
      font-size: 21px;
      line-height: 27px;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.01em;
    }

    .paywall-sub {
      margin: -6px 0 0;
      font-size: 15px;
      line-height: 21px;
      color: var(--text-muted);
    }

    /* Hero */
    .paywall-hero {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-soft);
      background:
        radial-gradient(120% 120% at 100% 0%, var(--primary-soft) 0%, rgba(255, 238, 248, 0) 58%),
        var(--surface);
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 20px 18px;
    }

    .paywall-hero-photo {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      aspect-ratio: 16 / 11;
      background: var(--surface-soft);
    }

    .paywall-hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
    }

    .paywall-hero-copy {
      display: grid;
      gap: 12px;
      align-content: start;
    }

    .paywall-hero-title {
      margin: 0;
      font-size: 26px;
      line-height: 31px;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.02em;
    }

    .paywall-hero-sub {
      margin: 0;
      font-size: 16px;
      line-height: 23px;
      color: var(--text-muted);
    }

    .paywall-hero-orientir {
      margin: 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      align-self: start;
      padding: 9px 14px;
      border-radius: 12px;
      background: var(--primary-soft);
      color: var(--primary-hover);
      font-size: 15px;
      line-height: 20px;
      font-weight: 700;
    }

    .paywall-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .paywall-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 13px;
      border-radius: var(--radius-pill);
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      font-size: 14px;
      line-height: 18px;
      font-weight: 650;
    }

    .paywall-chip::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--primary);
    }

    .paywall-cta {
      width: 100%;
      min-height: 54px;
      border: none;
      border-radius: var(--radius-lg);
      background: var(--primary);
      color: #FFFFFF;
      font-size: 17px;
      line-height: 22px;
      font-weight: 700;
      cursor: pointer;
      transition: background 120ms ease, transform 80ms ease;
    }

    .paywall-cta:hover {
      background: var(--primary-hover);
    }

    .paywall-cta:active {
      transform: scale(0.99);
    }

    /* Includes */
    .paywall-includes {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .paywall-include {
      display: grid;
      grid-template-columns: 44px 1fr;
      gap: 12px;
      align-items: start;
      padding: 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--surface-soft);
    }

    .paywall-include-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--primary-soft);
      color: var(--primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .paywall-include-icon svg {
      width: 22px;
      height: 22px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .paywall-include-title {
      margin: 0 0 3px;
      font-size: 16px;
      line-height: 21px;
      font-weight: 700;
      color: var(--text);
    }

    .paywall-include-text {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      color: var(--text-muted);
    }

    /* Now & goal */
    .paywall-goal-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .paywall-goal-stat {
      position: relative;
      display: grid;
      gap: 4px;
      padding: 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--surface-soft);
      overflow: hidden;
      min-height: 132px;
      align-content: start;
    }

    .paywall-goal-stat.is-target {
      background: linear-gradient(180deg, var(--primary-soft) 0%, var(--surface) 100%);
      border-color: var(--border-strong);
    }

    .paywall-goal-cap {
      font-size: 13px;
      line-height: 17px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .paywall-goal-weight {
      font-size: 28px;
      line-height: 32px;
      font-weight: 800;
      color: var(--text);
    }

    .paywall-goal-weight span {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-muted);
      margin-left: 3px;
    }

    .paywall-goal-fig {
      position: absolute;
      right: 8px;
      bottom: 0;
      width: 56px;
      height: 92px;
      object-fit: contain;
      object-position: bottom center;
      opacity: 0.92;
    }

    .paywall-goal-line {
      display: inline-flex;
      align-self: start;
      padding: 9px 14px;
      border-radius: var(--radius-pill);
      background: var(--primary);
      color: #FFFFFF;
      font-size: 15px;
      line-height: 20px;
      font-weight: 700;
    }

    .paywall-goal-progress {
      height: 10px;
      border-radius: 999px;
      background: var(--surface-soft);
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .paywall-goal-progress-fill {
      height: 100%;
      width: 64%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--accent) 0%, var(--primary) 100%);
    }

    /* Social proof */
    .paywall-proof-top {
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: 14px;
      align-items: center;
    }

    .paywall-proof-photo {
      width: 96px;
      height: 96px;
      border-radius: var(--radius-lg);
      object-fit: cover;
      object-position: top center;
      border: 1px solid var(--border);
      background: var(--surface-soft);
    }

    .paywall-proof-count strong {
      display: block;
      font-size: 30px;
      line-height: 34px;
      font-weight: 800;
      color: var(--primary);
    }

    .paywall-proof-count span {
      display: block;
      margin-top: 2px;
      font-size: 14px;
      line-height: 19px;
      color: var(--text-muted);
    }

    .paywall-facts {
      display: grid;
      gap: 8px;
    }

    .paywall-fact {
      display: grid;
      grid-template-columns: 22px 1fr;
      gap: 10px;
      align-items: start;
      font-size: 15px;
      line-height: 20px;
      color: var(--text);
    }

    .paywall-fact-mark {
      margin-top: 1px;
      width: 22px;
      height: 22px;
      border-radius: 999px;
      background: var(--primary-soft);
      color: var(--primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .paywall-fact-mark svg {
      width: 13px;
      height: 13px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .paywall-reviews {
      display: grid;
      gap: 10px;
    }

    .paywall-review {
      padding: 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--surface-soft);
    }

    .paywall-review-text {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      color: var(--text);
    }

    .paywall-review-meta {
      margin: 8px 0 0;
      font-size: 13px;
      line-height: 17px;
      color: var(--text-muted);
      font-weight: 650;
    }

    /* Tariffs */
    .paywall-tariffs {
      display: grid;
      gap: 12px;
    }

    .paywall-tariff {
      position: relative;
      display: grid;
      gap: 8px;
      padding: 16px;
      border-radius: var(--radius-lg);
      border: 1.5px solid var(--border);
      background: var(--surface);
      transition: border-color 120ms ease, box-shadow 120ms ease;
    }

    .paywall-tariff.is-popular {
      border-color: var(--border-strong);
      box-shadow: var(--shadow-card);
    }

    .paywall-tariff.is-selected {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-soft);
    }

    .paywall-tariff-head {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .paywall-tariff-name {
      font-size: 17px;
      line-height: 22px;
      font-weight: 800;
      color: var(--text);
    }

    .paywall-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: var(--radius-pill);
      background: var(--primary);
      color: #FFFFFF;
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
    }

    .paywall-badge.is-soft {
      background: var(--primary-soft);
      color: var(--primary-hover);
    }

    .paywall-tariff-price {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    .paywall-price-now {
      font-size: 28px;
      line-height: 32px;
      font-weight: 800;
      color: var(--text);
    }

    .paywall-price-old {
      font-size: 16px;
      line-height: 20px;
      color: var(--text-soft);
      text-decoration: line-through;
    }

    .paywall-tariff-period {
      font-size: 14px;
      line-height: 19px;
      color: var(--text-muted);
      font-weight: 650;
    }

    .paywall-tariff-renewal {
      font-size: 13px;
      line-height: 18px;
      color: var(--text);
      background: var(--surface-warm);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 8px 10px;
      font-weight: 650;
    }

    .paywall-tariff-note {
      font-size: 14px;
      line-height: 19px;
      color: var(--text-muted);
    }

    .paywall-tariff-btn {
      margin-top: 2px;
      width: 100%;
      min-height: 48px;
      border-radius: var(--radius-md);
      border: 1px solid var(--primary);
      background: var(--primary-soft);
      color: var(--primary);
      font-size: 16px;
      line-height: 20px;
      font-weight: 700;
      cursor: pointer;
      transition: background 120ms ease, color 120ms ease;
    }

    .paywall-tariff.is-selected .paywall-tariff-btn {
      background: var(--primary);
      color: #FFFFFF;
    }

    /* Safety */
    .paywall-safety {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .paywall-safe {
      display: grid;
      gap: 8px;
      padding: 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--surface-soft);
      align-content: start;
    }

    .paywall-safe-icon {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      background: var(--primary-soft);
      color: var(--primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .paywall-safe-icon svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .paywall-safe-title {
      margin: 0;
      font-size: 15px;
      line-height: 19px;
      font-weight: 700;
      color: var(--text);
    }

    .paywall-safe-text {
      margin: 0;
      font-size: 13px;
      line-height: 18px;
      color: var(--text-muted);
    }

    /* Form */
    .paywall-embed {
      border: 1px dashed var(--border-strong);
      border-radius: var(--radius-lg);
      background: var(--surface-soft);
      padding: 28px 18px;
      text-align: center;
      color: var(--text-muted);
      font-size: 15px;
      line-height: 21px;
      display: grid;
      gap: 6px;
      justify-items: center;
    }

    .paywall-embed-icon {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      background: var(--primary-soft);
      color: var(--primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .paywall-embed-icon svg {
      width: 22px;
      height: 22px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* FAQ */
    .paywall-faq {
      display: grid;
      gap: 8px;
    }

    .paywall-faq-item {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--surface-soft);
      padding: 4px 6px;
    }

    .paywall-faq-item > summary {
      list-style: none;
      cursor: pointer;
      padding: 12px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      font-size: 15px;
      line-height: 21px;
      font-weight: 700;
      color: var(--text);
    }

    .paywall-faq-item > summary::-webkit-details-marker {
      display: none;
    }

    .paywall-faq-item > summary::after {
      content: '';
      width: 11px;
      height: 11px;
      flex-shrink: 0;
      border-right: 2px solid var(--primary);
      border-bottom: 2px solid var(--primary);
      transform: rotate(45deg);
      transition: transform 160ms ease;
    }

    .paywall-faq-item[open] > summary::after {
      transform: rotate(225deg);
    }

    .paywall-faq-answer {
      padding: 0 12px 12px;
      font-size: 14px;
      line-height: 20px;
      color: var(--text-muted);
    }

    /* Footer */
    .paywall-footer {
      display: grid;
      gap: 12px;
      padding: 18px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      background: var(--surface-soft);
    }

    .paywall-requisites {
      display: grid;
      gap: 3px;
      font-size: 13px;
      line-height: 18px;
      color: var(--text-muted);
    }

    .paywall-requisites strong {
      color: var(--text);
      font-size: 14px;
    }

    .paywall-footer .quiz-legal,
    .paywall-footer .legal {
      font-size: 13px;
      line-height: 18px;
    }

    @media (min-width: 560px) {
      .paywall-hero {
        grid-template-columns: 1.05fr 1fr;
        align-items: center;
        padding: 24px;
      }

      .paywall-hero-photo {
        aspect-ratio: 3 / 4;
        order: 2;
      }

      .paywall-includes {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 380px) {
      .paywall-safety {
        grid-template-columns: 1fr;
      }

      .paywall-goal-weight {
        font-size: 24px;
      }
    }


    .paywall-gallery-head {
      margin: 4px 0 0;
      font-size: 16px;
      line-height: 21px;
      font-weight: 700;
      color: var(--text);
    }

    .paywall-gallery-hint {
      margin: -8px 0 0;
      font-size: 13px;
      line-height: 18px;
      color: var(--text-soft);
    }

    .paywall-gallery {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding-bottom: 4px;
      margin: 0 -2px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .paywall-gallery::-webkit-scrollbar {
      display: none;
    }

    .paywall-gallery-item {
      position: relative;
      flex: 0 0 auto;
      width: 240px;
      aspect-ratio: 1 / 1;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--surface-soft);
      border: 1px solid var(--border);
      scroll-snap-align: start;
    }

    .paywall-gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .paywall-gallery-badge {
      position: absolute;
      left: 10px;
      top: 10px;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.92);
      color: var(--primary-hover);
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
      box-shadow: var(--shadow-card);
    }

    @media (max-width: 380px) {
      .paywall-gallery-item {
        width: 210px;
      }
    }

`
