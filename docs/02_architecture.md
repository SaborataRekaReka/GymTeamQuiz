# 02. Архитектура

## Рекомендуемый подход

Собирать небольшой движок квиза на основе конфигурации.

Главные сущности:

- конфиг экранов;
- состояние ответов пользователя;
- функции рендера экранов;
- функция расчёта результата;
- функция сохранения лида;
- функция рендера пейволла.

## Файловая структура в проекте

Рекомендуемая структура внутри Chatium или локальной подготовки:

```text
quiz/
  screens.ts
  types.ts
  state.ts
  resultLogic.ts
  paywall.ts
  validation.ts
  storage.ts
  utm.ts
  app.ts
```

Если Chatium требует другую структуру, сохранить эту логику по смыслу.

## Типы экранов

Использовать типы:

- `single_choice`;
- `multi_choice`;
- `number_input`;
- `trust`;
- `sales_transition`;
- `loader`;
- `lead_gate`;
- `personal_result`;
- `paywall`.

## Состояние квиза

Примерная модель:

```ts
type QuizState = {
  age?: string
  bodyNow?: string
  goalBody?: string
  zones?: string[]
  cellulite?: string
  bestShape?: string
  activity?: string
  sleep?: string
  resultFocus?: string
  currentWeight?: number
  height?: number
  targetWeight?: number
  experience?: string
  trainingPlace?: string
  reward?: string[]
  name?: string
  email?: string
  consentAccepted?: boolean
  utm?: Record<string, string>
}
```

## Сохранение

Сохранять итоговый объект после лид-гейта или при открытии результата.

В базе должна быть полная строка лида с ответами и расчётами.

Не терять UTM-метки.

## Валидация

Проверять: числовые поля, имя, почту, чекбокс согласия.

Рекомендуемые пределы:

- вес: 35-220 кг;
- рост: 120-220 см;
- целевой вес: 35-220 кг.

Если пользователь вводит странное значение, показать мягкую подсказку.
