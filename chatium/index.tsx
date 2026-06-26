/**
 * Серверная обёртка маршрута Chatium (TSX используется ТОЛЬКО на сервере).
 * Весь UI отрисовывает Vue-компонент QuizPage.
 *
 * Здесь же:
 *  - подключаем общий CSS квиза (строка из существующего src/ui/theme.ts);
 *  - кладём скрытый контейнер формы GetCourse, который Vue перенесёт на пейволл;
 *  - пробрасываем UTM в клиент через безопасный boot-payload.
 *
 * ВНИМАНИЕ ПО ПЛАТФОРМЕ:
 * Форма роутера `app.get('/').query(...).handle(...)` и `app.html(...)`
 * взяты из примеров ассистента Chatium. Подтвердите точные сигнатуры у Chatium.
 */
import { jsx } from '@app/html-jsx'
import QuizPage from './pages/QuizPage.vue'
import { quizThemeCss } from '../src/ui/theme'

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
            <QuizPage />
          </main>

          <script>{`window.__QUIZ_BOOT__ = ${JSON.stringify({ utm })};`}</script>

          {/* Скрытый контейнер формы GetCourse. Vue-компонент GetCourseForm.vue
              перенесёт узел #gcPaywallForm в видимую область на экране пейволла.
              Вставьте сюда боевой скрипт формы GetCourse, когда заказчик его выдаст. */}
          <div id="allGetcourseForms">
            <div id="gcPaywallForm" style="display:none">
              {/* <script id="ВАШ_GC_SCRIPT_ID" src="https://ВАША_ШКОЛА.getcourse.ru/pl/lite/widget/script?id=XXXXX"></script> */}
            </div>
          </div>
        </body>
      </html>,
    )
  })
