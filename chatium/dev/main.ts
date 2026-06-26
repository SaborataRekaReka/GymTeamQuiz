import { createApp } from 'vue'
import QuizPage from '../pages/QuizPage.vue'
import { quizThemeCss } from '../../src/ui/theme'

// Подключаем общий CSS квиза (та же строка стилей, что и в Chatium index.tsx).
const style = document.createElement('style')
style.textContent = quizThemeCss
document.head.appendChild(style)

createApp(QuizPage).mount('#app')
