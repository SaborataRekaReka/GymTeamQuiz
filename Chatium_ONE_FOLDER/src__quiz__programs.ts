import type { ResultCalculationInput, ResultInput, ResultProgram } from './types'

interface ProgramCatalogItem {
  id: string
  title: string
  type: ResultProgram['type']
  category: string
  imageUrl: string
  localImage: string
  description: string
  goals: string[]
  zones: string[]
  formats: string[]
  levels: string[]
  tags: string[]
  priority: number
  showOnlyWhen?: Array<'pregnancy' | 'bestShapeBeforeBirth'>
}

interface ScoredProgram {
  item: ProgramCatalogItem
  score: number
  matchedZones: string[]
  matchedGoals: string[]
  formatMatched: boolean
  levelMatched: boolean
}

const PROGRAMS: ProgramCatalogItem[] = [
  {
    id: 'usmanova-method',
    title: 'Метод Усмановой',
    type: 'Флагман',
    category: 'Тренировки дома',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/129/h/9993958238de93cfb42027db3748b8fe.png',
    localImage: '/assets/images/programs/usmanova-method.png',
    description:
      'Освоите технику и втянетесь в регулярные тренировки без травм и через силу. Первая программа, с которой начинают ученицы Кати.',
    goals: ['Минус вес, стройность', 'Стройное и лёгкое', 'Подтянутое, с тонусом', 'Подтянутое тело, тонус', 'Лёгкость и энергия'],
    zones: ['Всё тело', 'Живот и талия', 'Спина и осанка', 'Руки', 'Бёдра и галифе', 'Ягодицы'],
    formats: ['Дома', 'И дома, и в зале'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв', 'Почти весь день сижу', 'Хожу по делам, но спорта нет'],
    tags: ['для старта', 'всё тело', 'дом'],
    priority: 100,
  },
  {
    id: 'slimness',
    title: 'Стройности',
    type: 'Марафон',
    category: 'Тренировки дома',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/243/h/b425fe3374dfff385aa5305db7156a5f.png',
    localImage: '/assets/images/programs/slimness.png',
    description:
      'Первый видимый результат за 21 день: уходит первый жир, появляется тонус и лёгкость. Подходит для старта с нуля.',
    goals: ['Минус вес, стройность', 'Стройное и лёгкое', 'Плоский живот и талия', 'Лёгкость и энергия'],
    zones: ['Всё тело', 'Живот и талия', 'Бёдра и галифе', 'Руки'],
    formats: ['Дома', 'И дома, и в зале'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв', 'Почти весь день сижу', 'Хожу по делам, но спорта нет'],
    tags: ['стройность', '21 день', 'старт'],
    priority: 95,
  },
  {
    id: 'elastic-butt-1',
    title: 'Упругая попа 1.0',
    type: 'Марафон',
    category: 'Тренировки дома',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/265/h/d8acf94578d7aa9c71f7b487c818a4b4.png',
    localImage: '/assets/images/programs/elastic-butt-1.png',
    description:
      'Первый объём и подтянутость ягодиц с собственным весом. Для тех, кто впервые целенаправленно работает над попой.',
    goals: ['Подтянутое тело, тонус', 'Подтянутое, с тонусом', 'С формами, но без лишнего'],
    zones: ['Ягодицы', 'Бёдра и галифе'],
    formats: ['Дома', 'И дома, и в зале'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв', 'Хожу по делам, но спорта нет'],
    tags: ['ягодицы', 'свой вес', 'для старта'],
    priority: 90,
  },
  {
    id: 'elastic-butt-2',
    title: 'Упругая попа 2.0',
    type: 'Марафон',
    category: 'Тренировки дома',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/115/h/24010713a536c083b2ec7afd7c1d1a14.png',
    localImage: '/assets/images/programs/elastic-butt-2.png',
    description:
      'Следующий уровень после 1.0: плотные и упругие ягодицы с резинкой и утяжелителями. Подходит для подготовленных.',
    goals: ['Подтянутое тело, тонус', 'Подтянутое, с тонусом', 'С формами, но без лишнего'],
    zones: ['Ягодицы', 'Бёдра и галифе'],
    formats: ['Дома', 'И дома, и в зале'],
    levels: ['Занимаюсь время от времени', 'Тренируюсь регулярно', 'Двигаюсь много'],
    tags: ['ягодицы', 'резинка', 'уровень выше'],
    priority: 75,
  },
  {
    id: 'flat-belly',
    title: 'Плоский живот',
    type: 'Марафон',
    category: 'Тренировки дома',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/284/h/9c599cbd2f0e39fa1bd12c09072e4db2.png',
    localImage: '/assets/images/programs/flat-belly.png',
    description: 'Тренировки на глубокие мышцы пресса, которые отвечают за плоский живот, а не за кубики.',
    goals: ['Плоский живот и талия', 'Минус вес, стройность', 'Стройное и лёгкое'],
    zones: ['Живот и талия'],
    formats: ['Дома', 'И дома, и в зале'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв', 'Занимаюсь время от времени', 'Тренируюсь регулярно'],
    tags: ['живот', 'талия', 'кор'],
    priority: 98,
  },
  {
    id: 'fat-burning',
    title: 'Жиросжигающий',
    type: 'Курс',
    category: 'Тренировки дома',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/351/h/4bbdff61ee6ece8379588a12d384bcf1.png',
    localImage: '/assets/images/programs/fat-burning.png',
    description: 'Курс на 6 недель для снижения жира и проявления рельефа. Подходит тем, кто уже тренировался.',
    goals: ['Минус вес, стройность', 'Подтянутое тело, тонус', 'Стройное и лёгкое'],
    zones: ['Всё тело', 'Живот и талия', 'Руки', 'Бёдра и галифе'],
    formats: ['Дома', 'И дома, и в зале'],
    levels: ['Занимаюсь время от времени', 'Тренируюсь регулярно', 'Двигаюсь много'],
    tags: ['жиросжигание', '6 недель', 'гантели'],
    priority: 70,
  },
  {
    id: 'gym-program',
    title: 'Для зала',
    type: 'Курс',
    category: 'Тренировки в зале',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/182/h/8261c10bf388dcc255c1368cf0ada516.png',
    localImage: '/assets/images/programs/gym-program.png',
    description: 'Готовая программа для зала на мышечный объём, когда дома прогресс уже остановился.',
    goals: ['Подтянутое тело, тонус', 'Подтянутое, с тонусом', 'С формами, но без лишнего'],
    zones: ['Всё тело', 'Ягодицы', 'Бёдра и галифе', 'Руки', 'Спина и осанка'],
    formats: ['В зале', 'И дома, и в зале'],
    levels: ['Занимаюсь время от времени', 'Тренируюсь регулярно', 'Двигаюсь много'],
    tags: ['зал', 'мышцы', 'тонус'],
    priority: 85,
  },
  {
    id: 'pregnancy',
    title: 'Для беременных',
    type: 'Курс',
    category: 'Беременность и после родов',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/389/h/670dcb85eab5786fd01def671ea3da4f.png',
    localImage: '/assets/images/programs/pregnancy.png',
    description: 'Безопасные тренировки на всех триместрах: спина, тазовое дно и подготовка к родам.',
    goals: ['Просто здоровое и без боли в спине'],
    zones: ['Спина и осанка', 'Всё тело'],
    formats: ['Дома'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв'],
    tags: ['беременность', 'спина', 'бережно'],
    priority: 10,
    showOnlyWhen: ['pregnancy'],
  },
  {
    id: 'postpartum-recovery',
    title: 'Восстановление после родов',
    type: 'Курс',
    category: 'Беременность и после родов',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/97/h/b88878684e2c798665d456e839aae6c7.png',
    localImage: '/assets/images/programs/postpartum-recovery.png',
    description: 'Восстановление после родов и кесарева: диастаз, тазовое дно, осанка, затем стройность и тонус.',
    goals: ['Минус вес, стройность', 'Просто здоровое и без боли в спине', 'Стройное и лёгкое'],
    zones: ['Живот и талия', 'Спина и осанка', 'Всё тело'],
    formats: ['Дома'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв'],
    tags: ['после родов', 'живот', 'осанка'],
    priority: 70,
    showOnlyWhen: ['bestShapeBeforeBirth'],
  },
  {
    id: 'ai-nutritionist',
    title: 'ИИ-нутрициолог',
    type: 'Бестселлер',
    category: 'Питание',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/104/h/468c85a2ea7c865ae30349257111fd6f.png',
    localImage: '/assets/images/programs/ai-nutritionist.png',
    description: 'Питание, тренировки и анализы в кармане. Подскажет, поддержит и поможет есть без срывов.',
    goals: ['Минус вес, стройность', 'Стройное и лёгкое', 'Лёгкость и энергия', 'Плоский живот и талия'],
    zones: ['Всё тело', 'Живот и талия'],
    formats: ['Дома', 'В зале', 'И дома, и в зале', 'На улице'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв', 'Занимаюсь время от времени', 'Тренируюсь регулярно'],
    tags: ['питание', 'помощник', 'без срывов'],
    priority: 88,
  },
  {
    id: 'nutrition-course',
    title: 'По питанию',
    type: 'Курс',
    category: 'Питание',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/187/h/8471238dd04bfc42ccdcc32a9607164f.png',
    localImage: '/assets/images/programs/nutrition-course.png',
    description: 'Сбросить вес без диет и жёстких ограничений. Помогает справиться со срывами, заеданием и качелями веса.',
    goals: ['Минус вес, стройность', 'Стройное и лёгкое', 'Плоский живот и талия'],
    zones: ['Всё тело', 'Живот и талия'],
    formats: ['Дома', 'В зале', 'И дома, и в зале', 'На улице'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв', 'Занимаюсь время от времени', 'Тренируюсь регулярно'],
    tags: ['питание', 'без диет', 'снижение веса'],
    priority: 82,
  },
  {
    id: 'self-love-1',
    title: 'Любовь к себе 1.0',
    type: 'Программа',
    category: 'Любовь к себе',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/223/h/9c1c658f32e34dff3aa500d44a2a6e00.png',
    localImage: '/assets/images/programs/self-love-1.png',
    description:
      'Для тех, кто худеет годами и всё равно недоволен собой. Помогает начать тренироваться из любви, а не из злости.',
    goals: ['Лёгкость и энергия', 'Стройное и лёгкое'],
    zones: ['Всё тело'],
    formats: ['Дома', 'И дома, и в зале'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв'],
    tags: ['мотивация', 'принятие', 'мягкий старт'],
    priority: 55,
  },
  {
    id: 'self-love-2',
    title: 'Любовь к себе 2.0',
    type: 'Программа',
    category: 'Любовь к себе',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/417/h/aa1e13d1be6e5c91fae1b4ea930dba97.png',
    localImage: '/assets/images/programs/self-love-2.png',
    description: 'Вторая ступень после 1.0 для тех, кто часто откладывает себя на потом.',
    goals: ['Лёгкость и энергия', 'Стройное и лёгкое'],
    zones: ['Всё тело'],
    formats: ['Дома', 'И дома, и в зале'],
    levels: ['Новичок, начинаю с нуля', 'Когда-то занималась, был перерыв'],
    tags: ['мотивация', 'ресурс', 'привычка'],
    priority: 45,
  },
]

const UNIVERSAL_FALLBACK_IDS = ['usmanova-method', 'slimness', 'ai-nutritionist']
const CHALLENGING_PROGRAM_IDS = new Set(['fat-burning', 'elastic-butt-2', 'gym-program'])

function includesOneOf(value: string | undefined, variants: string[]): boolean {
  if (!value) return false
  return variants.some((variant) => value.includes(variant))
}

function unique(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)))
}

function calculateBmiSafe(input: ResultCalculationInput): number {
  if (!input.currentWeight || !input.height) return 0
  if (input.currentWeight <= 0 || input.height <= 0) return 0
  const heightM = input.height / 100
  return input.currentWeight / (heightM * heightM)
}

function isBeginner(input: ResultCalculationInput): boolean {
  return includesOneOf(input.experience, ['Новичок', 'был перерыв'])
}

function isLowActivity(input: ResultCalculationInput): boolean {
  return includesOneOf(input.activity, ['Почти весь день сижу', 'спорта нет'])
}

function isProgramAllowed(program: ProgramCatalogItem, input: ResultCalculationInput, beginnerUser: boolean): boolean {
  if (program.showOnlyWhen?.includes('pregnancy')) {
    // В текущем квизе нет отдельного вопроса о беременности.
    return false
  }

  if (program.showOnlyWhen?.includes('bestShapeBeforeBirth') && !includesOneOf(input.bestShape, ['До родов'])) {
    return false
  }

  const buttFocused = (input.zones ?? []).some((zone) => zone === 'Ягодицы' || zone === 'Бёдра и галифе')
  if (buttFocused && beginnerUser && program.id === 'elastic-butt-2') {
    return false
  }

  return true
}

function pickGoalTag(goal: string): string {
  if (goal.includes('Минус вес')) return 'минус вес'
  if (goal.includes('Плоский живот')) return 'плоский живот'
  if (goal.includes('Подтянутое')) return 'тонус'
  if (goal.includes('Лёгкость')) return 'энергия'
  if (goal.includes('здоровое')) return 'без боли в спине'
  return 'под вашу цель'
}

function pickFormatTag(trainingPlace: string): string {
  if (trainingPlace === 'В зале') return 'зал'
  if (trainingPlace === 'Дома') return 'дом'
  if (trainingPlace === 'И дома, и в зале') return 'дом и зал'
  if (trainingPlace === 'На улице') return 'на улице'
  return 'по формату'
}

function buildRelevanceTags(
  program: ProgramCatalogItem,
  matchedZones: string[],
  matchedGoals: string[],
  trainingPlace?: string,
): string[] {
  const dynamic: string[] = []

  if (matchedZones.length > 0) dynamic.push(matchedZones[0].toLowerCase())
  if (matchedGoals.length > 0) dynamic.push(pickGoalTag(matchedGoals[0]))
  if (trainingPlace && program.formats.includes(trainingPlace)) dynamic.push(pickFormatTag(trainingPlace))

  return unique([...dynamic, ...program.tags]).slice(0, 3)
}

function scoreProgram(
  program: ProgramCatalogItem,
  input: ResultCalculationInput,
  goalCandidates: string[],
  beginnerUser: boolean,
  lowActivity: boolean,
  highBmi: boolean,
): ScoredProgram {
  const zones = input.zones ?? []
  const matchedZones = zones.filter((zone) => program.zones.includes(zone))
  const matchedGoals = goalCandidates.filter((goal) => program.goals.includes(goal))
  const formatMatched = Boolean(input.trainingPlace && program.formats.includes(input.trainingPlace))
  const levelMatched = Boolean(
    (input.experience && program.levels.includes(input.experience)) || (input.activity && program.levels.includes(input.activity)),
  )

  let score = program.priority
  score += matchedZones.length * 65
  if (matchedGoals.length > 0) {
    score += 62 + (matchedGoals.length - 1) * 14
  }
  if (formatMatched) score += 28
  if (levelMatched) score += 22

  const isWeightLossGoal = goalCandidates.some((goal) => goal.includes('Минус вес, стройность'))
  const isToneGoal = goalCandidates.some((goal) => goal.includes('Подтянутое тело, тонус') || goal.includes('Подтянутое, с тонусом'))
  const isEnergyGoal = goalCandidates.some((goal) => goal.includes('Лёгкость и энергия'))
  const bellyFocused = zones.includes('Живот и талия')
  const buttFocused = zones.includes('Ягодицы') || zones.includes('Бёдра и галифе')
  const gymFocused = input.trainingPlace === 'В зале'

  if (bellyFocused && program.id === 'flat-belly') score += 170
  if (buttFocused && program.id === 'elastic-butt-1') score += 160
  if (buttFocused && !beginnerUser && program.id === 'elastic-butt-2') score += 110
  if (gymFocused && program.id === 'gym-program') score += 150

  if (isWeightLossGoal) {
    if (program.id === 'slimness') score += 80
    if (program.id === 'usmanova-method') score += 70
    if (program.id === 'flat-belly') score += 55
    if (program.id === 'ai-nutritionist') score += 52
    if (program.id === 'nutrition-course') score += 48
  }

  if (isToneGoal) {
    if (program.id === 'usmanova-method') score += 72
    if (program.id === 'elastic-butt-1') score += 62
    if (program.id === 'elastic-butt-2') score += 46
    if (program.id === 'gym-program') score += 52
  }

  if (bellyFocused) {
    if (program.id === 'slimness') score += 34
    if (program.id === 'nutrition-course') score += 36
    if (program.id === 'ai-nutritionist') score += 32
  }

  if (buttFocused) {
    if (program.id === 'elastic-butt-1') score += 36
    if (program.id === 'elastic-butt-2' && !beginnerUser) score += 20
  }

  if (gymFocused && (program.formats.includes('В зале') || program.formats.includes('И дома, и в зале'))) {
    score += 24
  }

  if (beginnerUser) {
    if (program.id === 'usmanova-method') score += 40
    if (program.id === 'slimness') score += 34
    if (program.id === 'elastic-butt-1') score += 26
    if (program.id === 'ai-nutritionist') score += 22
  }

  if (isEnergyGoal) {
    if (program.id === 'usmanova-method') score += 42
    if (program.id === 'self-love-1') score += 48
    if (program.id === 'ai-nutritionist') score += 34
    if (program.id === 'slimness') score += 28
  }

  if (includesOneOf(input.bestShape, ['До родов']) && program.id === 'postpartum-recovery') {
    score += 95
  }

  if ((beginnerUser || lowActivity || highBmi) && CHALLENGING_PROGRAM_IDS.has(program.id)) {
    score -= 135
  }

  return {
    item: program,
    score,
    matchedZones,
    matchedGoals,
    formatMatched,
    levelMatched,
  }
}

function selectPinnedProgramIds(input: ResultCalculationInput, beginnerUser: boolean): string[] {
  const zones = input.zones ?? []
  const pinned: string[] = []

  if (zones.includes('Живот и талия')) pinned.push('flat-belly')

  const buttFocused = zones.includes('Ягодицы') || zones.includes('Бёдра и галифе')
  if (buttFocused) {
    pinned.push('elastic-butt-1')
    if (!beginnerUser) pinned.push('elastic-butt-2')
  }

  if (input.trainingPlace === 'В зале') pinned.push('gym-program')

  return unique(pinned)
}

export function recommendPrograms(input: ResultCalculationInput): string[] {
  return recommendResultPrograms(input).map((program) => program.title).slice(0, 5)
}

export function recommendResultPrograms(input: ResultCalculationInput): ResultProgram[] {
  const goalCandidates = unique([input.resultFocus ?? '', input.goalBody ?? ''])
  const beginnerUser = isBeginner(input)
  const lowActivity = isLowActivity(input)
  const highBmi = calculateBmiSafe(input) >= 30
  const safeMode = beginnerUser || lowActivity || highBmi

  const scoredPrograms = PROGRAMS
    .filter((program) => isProgramAllowed(program, input, beginnerUser))
    .map((program) => scoreProgram(program, input, goalCandidates, beginnerUser, lowActivity, highBmi))
    .sort((a, b) => b.score - a.score || b.item.priority - a.item.priority)

  const pinnedIds = selectPinnedProgramIds(input, beginnerUser)
  const scoredById = new Map(scoredPrograms.map((program) => [program.item.id, program]))

  const selected: ScoredProgram[] = []
  const selectedIds = new Set<string>()

  const tryAdd = (program: ScoredProgram | undefined) => {
    if (!program) return
    if (selectedIds.has(program.item.id)) return
    if (selected.length >= 4) return
    selected.push(program)
    selectedIds.add(program.item.id)
  }

  pinnedIds.forEach((id) => tryAdd(scoredById.get(id)))

  const orderedByComplexity = safeMode
    ? [...scoredPrograms.filter((program) => !CHALLENGING_PROGRAM_IDS.has(program.item.id)), ...scoredPrograms.filter((program) => CHALLENGING_PROGRAM_IDS.has(program.item.id))]
    : scoredPrograms

  orderedByComplexity.forEach((program) => tryAdd(program))

  if (selected.length < 2) {
    UNIVERSAL_FALLBACK_IDS.forEach((id) => tryAdd(scoredById.get(id)))
  }

  const finalPrograms = selected.slice(0, 4)

  return finalPrograms.map((program) => ({
    id: program.item.id,
    title: program.item.title,
    type: program.item.type,
    description: program.item.description,
    tags: program.item.tags,
    relevanceTags: buildRelevanceTags(program.item, program.matchedZones, program.matchedGoals, input.trainingPlace),
    imageUrl: program.item.imageUrl,
    localImage: program.item.localImage,
  }))
}

export function buildResultInputs(input: ResultCalculationInput): ResultInput[] {
  const zones = input.zones ?? []
  const goal = input.resultFocus ?? input.goalBody ?? ''
  const inputs: ResultInput[] = []

  if (goal) inputs.push({ label: 'Цель', value: goal })
  if (zones.length) inputs.push({ label: 'Зоны', value: zones.join(', ') })
  if (input.trainingPlace) inputs.push({ label: 'Формат', value: input.trainingPlace })
  if (input.experience) inputs.push({ label: 'Уровень', value: input.experience })
  else if (input.activity) inputs.push({ label: 'Активность', value: input.activity })

  return inputs
}
