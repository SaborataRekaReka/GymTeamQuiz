import { jsx } from '@app/html-jsx'
import QuizPage from './pages/QuizPage.vue'
import { quizThemeCss } from './src/ui/theme'

export const indexRoute = app
  .get('/')
  .query((s) => ({
    utm_source: s.string().optional(),
    utm_medium: s.string().optional(),
    utm_campaign: s.string().optional(),
    utm_content: s.string().optional(),
    utm_term: s.string().optional(),
  }))
  .handle(async (ctx, req) => {
    const utm = {
      utm_source: req.query.utm_source ?? '',
      utm_medium: req.query.utm_medium ?? '',
      utm_campaign: req.query.utm_campaign ?? '',
      utm_content: req.query.utm_content ?? '',
      utm_term: req.query.utm_term ?? '',
    }

    return (
      <html lang="ru">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <title>Квиз Усманова Фит</title>
          <style>{quizThemeCss}</style>
        </head>
        <body>
          <main class="quiz-shell" style={{ position: 'relative' }}>
            <QuizPage />
          </main>

          <script>{`window.__QUIZ_BOOT__ = ${JSON.stringify({ utm })};`}</script>

          <div id="allGetcourseForms">
            <div id="gcPaywallForm" style="display:none">
            </div>
          </div>
        </body>
      </html>
    )
  })
