export { quizFlow, quizScreens } from './quizData'
export { loadQuizFlowConfig } from './screenMap'

export {
  createInitialState,
  saveAnswer,
  moveNext,
  moveBack,
  calculateProgressPercent,
  validateRequiredForScreen,
  validateRequiredState,
} from './quizEngine'

export {
  renderScreen,
  renderQuestionScreen,
  renderTrustScreen,
  renderLoaderScreen,
  renderLeadGateScreen,
  renderResultScreen,
  renderPaywallScreen,
} from './screenRenderer'

export { QuizScenarioController } from './quizScenario'

export {
  calculateBmi,
  calculateBmrFemale,
  calculateMaintenanceCalories,
  calculateCalorieNorm,
  calculateMacros,
  calculateWeightDifference,
  buildPersonalResult,
  detectResultType,
  recommendPrograms,
} from './resultLogic'

export { saveLead } from './leadStorage'
export { toChatiumAdapterPayload } from './uiAdapter'

export type {
  ChatiumAdapterPayload,
  RenderedScreenModel,
  UiActionDescriptor,
  UiNode,
} from './uiAdapter'

export type {
  LeadGateAnswer,
  LeadPayload,
  LeadSaveResult,
  PersonalResult,
  QuizAnswerValue,
  QuizAnswersByScreen,
  QuizFlowConfig,
  QuizRuntimeState,
  QuizScreen,
  ResultType,
  SaveAnswerResult,
  ValidationIssue,
} from './types'
