import { loadQuizFlowConfig } from './screenMap'
import type { QuizScreen } from './types'

export const quizFlow = loadQuizFlowConfig()
export const quizScreens: QuizScreen[] = quizFlow.screens
