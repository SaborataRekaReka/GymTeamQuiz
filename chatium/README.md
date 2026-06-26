# Перенос квиза в Chatium (Vue-версия)

Эта папка — слой UI на **Vue 3 SFC** для деплоя в Chatium. Логика, типы, расчёты,
данные экранов и CSS переиспользуются из существующего `../src` без изменений.

## Структура

```
chatium/
  index.tsx              серверная обёртка маршрута (TSX только на сервере)
  pages/
    QuizPage.vue         главный драйвер квиза (порт src/components/QuizApp.tsx)
  components/
    QuizHeader.vue       шапка + прогресс в процентах
    Button.vue           кнопка (inline-стили как в src/ui/primitives)
    OptionButton.vue     карточка варианта ответа
    QuestionScreen.vue   single / multiple / number_input + карточка ИМТ
    TrustScreen.vue      экраны доверия и слайдер исследований
    LoaderScreen.vue     экран сбора плана
    LeadGateScreen.vue   имя, почта, согласие
    ResultScreen.vue     персональный результат (путь к цели, КБЖУ, ИМТ, программы)
    PaywallScreen.vue    пейволл (оффер, доказательства, тарифы, FAQ, футер)
    GetCourseForm.vue    перенос скрытого узла формы GetCourse в видимую область
    ResultInputIcon.vue / ResultProgramIcon.vue / PaywallIncludeIcon.vue / PaywallSafetyIcon.vue  — SVG-иконки
  api/
    leads/upsert.ts      серверный POST-роут: upsert лида по sessionId
  tables/
    leads.table          схема таблицы лидов
  shared/
    utm.ts               чтение UTM из URL по белому списку
    quizPersist.ts       sessionId + сохранение прогресса в localStorage
    saveLead.ts          клиентская отправка лида в API
```

## Что переиспользуется без изменений (из ../src)

- Логика и состояние: `src/quiz/state.ts`
- Типы: `src/quiz/types.ts`
- Расчёты: `src/quiz/result.ts`, `src/quiz/programs.ts`, `src/quiz/resultImages.ts`
- Данные 24 экранов: `data/quiz_screen_map.json` (через `src/quiz/screens.ts`)
- Все стили: `src/ui/theme.ts` (строка CSS, подключается в `index.tsx`)

Vue-компоненты используют те же CSS-классы, поэтому визуал сохраняется один в один.

## Что нужно подтвердить у Chatium перед публикацией

Эти места написаны по примерам ассистента Chatium, а не по проверенной документации.
Отмечены комментариями в коде. Уточните точные сигнатуры для вашего workspace:

1. Форма роутера: `app.get('/').query(...).handle(...)` и `app.html(...)` в `index.tsx`.
2. Серверный POST-роут и методы таблицы: `app.post('/').body(...).handle(...)`,
   `Leads.findOneBy / create / update` в `api/leads/upsert.ts`.
3. Точный URL, по которому монтируется `api/leads/upsert.ts` (в `shared/saveLead.ts` стоит `/api/leads/upsert`).
4. Поддерживаемый способ встраивания формы GetCourse и его допустимость в CSP/санитайзере
   (скрытый контейнер `#gcPaywallForm` в `index.tsx`, перенос узла в `GetCourseForm.vue`).
5. Импорты `../src/...`: подтвердите, что Chatium собирает workspace целиком и относительные
   импорты из `chatium/` в `src/` работают. Если нет — скопируйте файлы логики внутрь `chatium/shared/`.

## Как проверить деплой быстро и без риска

1. Залейте `index.tsx` + `pages/QuizPage.vue` + `components/QuizHeader.vue` + `components/QuestionScreen.vue`
   и убедитесь, что открывается первый экран. Это проверяет, что Vue-рантайм и маршрут работают.
2. Затем добавьте `tables/leads.table` + `api/leads/upsert.ts` и пройдите до лид-гейта —
   проверьте, что запись лида создаётся (upsert по sessionId, без дублей).
3. Вставьте боевой скрипт GetCourse в скрытый контейнер в `index.tsx` и проверьте форму на пейволле.
4. Прогон по чек-листу `../docs/06_quality_checklist.md`.

## Обязательные сохраняемые поля (docs/01_hard_constraints.md)

Имя, e-mail, ответы по экранам, рост, вес, целевой вес, тип результата, норма калорий,
КБЖУ, UTM, дата. Все они уже передаются в `upsertLead(...)` из `QuizPage.vue`.

## Сообщение для Chatium: ассеты и оптимизация изображений

Оптимизация изображений уже выполнена в кодовой базе:

1. Ключевые тяжёлые изображения переведены в WebP (hero/trust/result/gallery) и подключены в актуальных компонентах `src/` и `chatium/`.
2. Дубли JPG/JPEG удалены там, где есть одноимённые WebP; форматы JPG/JPEG оставлены только без WebP-пары.
3. Для передачи ассетов из одного места используйте каталог `../Chatium_ASSETS_ONE_FOLDER/`.
4. В `../Chatium_ASSETS_ONE_FOLDER/MAP.txt` есть соответствие между runtime-путями (`/assets/...`) и именами файлов в плоском каталоге.

Что делать при переносе в Chatium:

1. Загрузить файлы из `../Chatium_ASSETS_ONE_FOLDER/` в хранилище.
2. Сопоставить имена по `MAP.txt`.
3. Сохранить runtime URL вида `/assets/...` (пути в коде уже настроены).
