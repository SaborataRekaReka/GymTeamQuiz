import type { ScreenType } from './types'

export interface QuizScreenConfig {
  id: string
  type: ScreenType
  title?: string
  subtitle?: string
  offer?: string
  selection?: 'single' | 'multiple'
  inputType?: 'number' | 'text' | 'email'
  options?: string[]
  buttonText?: string
  imageHint?: string
  notes?: string
}

export const quizScreens: QuizScreenConfig[] = [
  {
    id: 'age',
    type: 'single',
    offer: 'Похудейте и уберите живот с тренировками Кати Усмановой',
    title: 'Сколько вам лет?',
    subtitle: 'Под ваш возраст подберём посильную нагрузку: то, что в 30 лет даёт результат лёгкой ходьбой, в 50 работает иначе.',
    options: ['18-29', '30-39', '40-49', '50-59', '60 и старше'],
    imageHint: 'Фото Кати Усмановой и логотип «Усманова Фит»',
  },
  {
    id: 'bodyNow',
    type: 'single',
    title: 'Как ваша фигура выглядит сейчас?',
    subtitle: 'Выберите образ, который ближе всего. Это точка, от которой стартуем.',
    options: ['Стройная, хочу тонус', 'Чуть поправилась', 'Есть заметный лишний вес', 'Набрала больше, чем хотелось бы'],
  },
  {
    id: 'goalBody',
    type: 'single',
    title: 'К какому телу хотите прийти?',
    subtitle: 'Покажем результат именно в этом направлении.',
    options: ['Стройное и лёгкое', 'Подтянутое, с тонусом', 'С формами, но без лишнего', 'Просто здоровое и без боли в спине'],
  },
  {
    id: 'zones',
    type: 'multiple',
    title: 'Какие зоны хотите проработать в первую очередь?',
    subtitle: 'На них в плане сделаем акцент.',
    options: ['Живот и талия', 'Ягодицы', 'Бёдра и галифе', 'Руки', 'Спина и осанка', 'Всё тело'],
  }
]

// Full 24-screen map is stored in data/quiz_screen_map.json and must remain the source of truth for implementation.
