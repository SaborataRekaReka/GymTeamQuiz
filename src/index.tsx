import { createSolidComponent, jsx } from '@app/html-jsx'
import { QuizApp } from './components/QuizApp'
import { quizThemeCss } from './ui/theme'

const QuizAppClient = createSolidComponent(QuizApp)

export default async function render() {
  return app.html(
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>Квиз Усманова Фит</title>
        <style>{quizThemeCss}</style>
      </head>
      <body>
        <main class="quiz-shell" style={{ position: 'relative' }}>
          <QuizAppClient />
        </main>
      </body>
    </html>,
  )
}
