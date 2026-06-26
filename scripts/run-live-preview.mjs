import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const mapPath = path.join(root, 'data', 'quiz_screen_map.json')

function readMap() {
  return JSON.parse(fs.readFileSync(mapPath, 'utf8'))
}

function mapVersion() {
  if (!fs.existsSync(mapPath)) return '0'
  return String(Math.trunc(fs.statSync(mapPath).mtimeMs))
}

const port = Number(process.env.PORT || 4173)
const previewCssPath = path.join(root, 'assets', 'live-preview.css')

function previewCssVersion() {
  if (!fs.existsSync(previewCssPath)) return '0'
  return String(Math.trunc(fs.statSync(previewCssPath).mtimeMs))
}

function htmlPage() {
  const mapJson = JSON.stringify(readMap())
  const mapVersionValue = mapVersion()

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>Live Preview Quiz</title>
  <link id="livePreviewCss" rel="stylesheet" href="/assets/live-preview.css?v=${previewCssVersion()}" />
</head>
<body>
  <main class="shell">
    <div id="app"></div>
  </main>

<script>
const map = ${mapJson};
const appEl = document.getElementById('app');
const cssLinkEl = document.getElementById('livePreviewCss');
let cssVersion = '${previewCssVersion()}';
let previewMapVersion = '${mapVersionValue}';

function startCssHotReload() {
  setInterval(async () => {
    try {
      const response = await fetch('/__preview_css_version', { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      const nextVersion = String(payload.version || '0');
      if (nextVersion === cssVersion) return;

      cssVersion = nextVersion;
      if (cssLinkEl) {
        cssLinkEl.href = '/assets/live-preview.css?v=' + encodeURIComponent(nextVersion);
      }
    } catch {
      // Ignore transient polling failures while files are being saved.
    }
  }, 550);
}

function startMapHotReload() {
  setInterval(async () => {
    try {
      const response = await fetch('/__preview_map_version', { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      const nextVersion = String(payload.version || '0');
      if (nextVersion === previewMapVersion) return;

      previewMapVersion = nextVersion;
      location.reload();
    } catch {
      // Ignore transient polling failures while files are being saved.
    }
  }, 700);
}

const state = {
  index: 0,
  answers: {},
  errors: [],
  researchSlideById: {},
};

let loaderAutoNextTimer = null;

const rangeById = {
  current_weight: [35, 220],
  height: [120, 220],
  target_weight: [35, 220],
};

const trustMediaById = {
  trust_580k: '/assets/quiz/realistic woman scene/womans.webp',
  nutrition_assistant: '/assets/quiz/trust/nutrition-assistant-transition.webp',
};

const trustVideoById = {
  trust_soft_training: '/assets/quiz/trust/trust-soft-training.mp4',
};

const beforeAfterById = {
  final_loader: {
    before: '/assets/quiz/before/current_02_soft.png.png',
    after: '/assets/quiz/before/target_02_toned_fit.png.png',
  },
};

const researchSlidesById = {
  research_trust: [
    {
      text: 'Регулярная ходьба и щадящие тренировки помогают сбросить часть веса за несколько недель и заметно прибавляют энергии.',
      source: 'Журнал Американской медицинской ассоциации, 2019',
    },
    {
      text: 'Умеренная регулярная физическая активность связана с ростом чувства энергии и снижением усталости по данным мета-анализа.',
      source: 'Психологический бюллетень, 2006',
    },
    {
      text: 'Самоконтроль питания и привычек улучшает удержание результата по весу и делает программу более устойчивой в реальной жизни.',
      source: 'Журнал Американской диетологической ассоциации, 2011',
    },
  ],
};

const bmiIconSrc = '/assets/icons/fitness_icons/Fitness-icons/SVG/scale.svg';

function screen() {
  return map.screens[state.index];
}

function progress() {
  return Math.round(((state.index + 1) / map.screens.length) * 100);
}

function getAge(ageBucket) {
  if (!ageBucket) return 35;
  if (ageBucket.includes('18-29')) return 25;
  if (ageBucket.includes('30-39')) return 35;
  if (ageBucket.includes('40-49')) return 45;
  if (ageBucket.includes('50-59')) return 55;
  if (ageBucket.includes('60')) return 65;
  return 35;
}

function activityFactor(activity) {
  if (activity === 'Почти весь день сижу') return 1.2;
  if (activity === 'Хожу по делам, но спорта нет') return 1.35;
  if (activity === 'Иногда тренируюсь, нерегулярно') return 1.45;
  if (activity === 'Двигаюсь много') return 1.6;
  return 1.35;
}

const PROGRAMS = [
  {
    id: 'usmanova-method',
    title: 'Метод Усмановой',
    type: 'Флагман',
    category: 'Тренировки дома',
    imageUrl: 'https://fs.getcourse.ru/fileservice/file/download/a/934144/sc/129/h/9993958238de93cfb42027db3748b8fe.png',
    localImage: '/assets/images/programs/usmanova-method.png',
    description: 'Освоите технику и втянетесь в регулярные тренировки без травм и через силу. Первая программа, с которой начинают ученицы Кати.',
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
    description: 'Первый видимый результат за 21 день: уходит первый жир, появляется тонус и лёгкость. Подходит для старта с нуля.',
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
    description: 'Первый объём и подтянутость ягодиц с собственным весом. Для тех, кто впервые целенаправленно работает над попой.',
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
    description: 'Следующий уровень после 1.0: плотные и упругие ягодицы с резинкой и утяжелителями. Подходит для подготовленных.',
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
    description: 'Для тех, кто худеет годами и всё равно недоволен собой. Помогает начать тренироваться из любви, а не из злости.',
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
];

const UNIVERSAL_FALLBACK_IDS = ['usmanova-method', 'slimness', 'ai-nutritionist'];
const CHALLENGING_PROGRAM_IDS = new Set(['fat-burning', 'elastic-butt-2', 'gym-program']);

function unique(items) {
  return Array.from(new Set((items || []).filter(Boolean)));
}

function includesOneOf(value, variants) {
  if (!value) return false;
  return variants.some((variant) => value.includes(variant));
}

function calculateBmiSafeFromInput(input) {
  if (!input.currentWeight || !input.height) return 0;
  if (input.currentWeight <= 0 || input.height <= 0) return 0;
  const heightM = input.height / 100;
  return input.currentWeight / (heightM * heightM);
}

function isBeginner(input) {
  return includesOneOf(input.experience, ['Новичок', 'был перерыв']);
}

function isLowActivity(input) {
  return includesOneOf(input.activity, ['Почти весь день сижу', 'спорта нет']);
}

function isProgramAllowed(program, input, beginnerUser) {
  if ((program.showOnlyWhen || []).includes('pregnancy')) {
    return false;
  }

  if ((program.showOnlyWhen || []).includes('bestShapeBeforeBirth') && !includesOneOf(input.bestShape, ['До родов'])) {
    return false;
  }

  const buttFocused = (input.zones || []).some((zone) => zone === 'Ягодицы' || zone === 'Бёдра и галифе');
  if (buttFocused && beginnerUser && program.id === 'elastic-butt-2') {
    return false;
  }

  return true;
}

function pickGoalTag(goal) {
  if (goal.includes('Минус вес')) return 'минус вес';
  if (goal.includes('Плоский живот')) return 'плоский живот';
  if (goal.includes('Подтянутое')) return 'тонус';
  if (goal.includes('Лёгкость')) return 'энергия';
  if (goal.includes('здоровое')) return 'без боли в спине';
  return 'под вашу цель';
}

function pickFormatTag(trainingPlace) {
  if (trainingPlace === 'В зале') return 'зал';
  if (trainingPlace === 'Дома') return 'дом';
  if (trainingPlace === 'И дома, и в зале') return 'дом и зал';
  if (trainingPlace === 'На улице') return 'на улице';
  return 'по формату';
}

function buildRelevanceTags(program, matchedZones, matchedGoals, trainingPlace) {
  const dynamic = [];

  if (matchedZones.length > 0) dynamic.push(String(matchedZones[0]).toLowerCase());
  if (matchedGoals.length > 0) dynamic.push(pickGoalTag(String(matchedGoals[0])));
  if (trainingPlace && program.formats.includes(trainingPlace)) dynamic.push(pickFormatTag(trainingPlace));

  return unique(dynamic.concat(program.tags || [])).slice(0, 3);
}

function scoreProgram(program, input, goalCandidates, beginnerUser, lowActivity, highBmi) {
  const zones = input.zones || [];
  const matchedZones = zones.filter((zone) => program.zones.includes(zone));
  const matchedGoals = goalCandidates.filter((goal) => program.goals.includes(goal));
  const formatMatched = Boolean(input.trainingPlace && program.formats.includes(input.trainingPlace));
  const levelMatched = Boolean(
    (input.experience && program.levels.includes(input.experience)) || (input.activity && program.levels.includes(input.activity))
  );

  let score = program.priority;
  score += matchedZones.length * 65;
  if (matchedGoals.length > 0) {
    score += 62 + (matchedGoals.length - 1) * 14;
  }
  if (formatMatched) score += 28;
  if (levelMatched) score += 22;

  const isWeightLossGoal = goalCandidates.some((goal) => goal.includes('Минус вес, стройность'));
  const isToneGoal = goalCandidates.some((goal) => goal.includes('Подтянутое тело, тонус') || goal.includes('Подтянутое, с тонусом'));
  const isEnergyGoal = goalCandidates.some((goal) => goal.includes('Лёгкость и энергия'));
  const bellyFocused = zones.includes('Живот и талия');
  const buttFocused = zones.includes('Ягодицы') || zones.includes('Бёдра и галифе');
  const gymFocused = input.trainingPlace === 'В зале';

  if (bellyFocused && program.id === 'flat-belly') score += 170;
  if (buttFocused && program.id === 'elastic-butt-1') score += 160;
  if (buttFocused && !beginnerUser && program.id === 'elastic-butt-2') score += 110;
  if (gymFocused && program.id === 'gym-program') score += 150;

  if (isWeightLossGoal) {
    if (program.id === 'slimness') score += 80;
    if (program.id === 'usmanova-method') score += 70;
    if (program.id === 'flat-belly') score += 55;
    if (program.id === 'ai-nutritionist') score += 52;
    if (program.id === 'nutrition-course') score += 48;
  }

  if (isToneGoal) {
    if (program.id === 'usmanova-method') score += 72;
    if (program.id === 'elastic-butt-1') score += 62;
    if (program.id === 'elastic-butt-2') score += 46;
    if (program.id === 'gym-program') score += 52;
  }

  if (bellyFocused) {
    if (program.id === 'slimness') score += 34;
    if (program.id === 'nutrition-course') score += 36;
    if (program.id === 'ai-nutritionist') score += 32;
  }

  if (buttFocused) {
    if (program.id === 'elastic-butt-1') score += 36;
    if (program.id === 'elastic-butt-2' && !beginnerUser) score += 20;
  }

  if (gymFocused && (program.formats.includes('В зале') || program.formats.includes('И дома, и в зале'))) {
    score += 24;
  }

  if (beginnerUser) {
    if (program.id === 'usmanova-method') score += 40;
    if (program.id === 'slimness') score += 34;
    if (program.id === 'elastic-butt-1') score += 26;
    if (program.id === 'ai-nutritionist') score += 22;
  }

  if (isEnergyGoal) {
    if (program.id === 'usmanova-method') score += 42;
    if (program.id === 'self-love-1') score += 48;
    if (program.id === 'ai-nutritionist') score += 34;
    if (program.id === 'slimness') score += 28;
  }

  if (includesOneOf(input.bestShape, ['До родов']) && program.id === 'postpartum-recovery') {
    score += 95;
  }

  if ((beginnerUser || lowActivity || highBmi) && CHALLENGING_PROGRAM_IDS.has(program.id)) {
    score -= 135;
  }

  return {
    item: program,
    score,
    matchedZones,
    matchedGoals,
  };
}

function selectPinnedProgramIds(input, beginnerUser) {
  const zones = input.zones || [];
  const pinned = [];

  if (zones.includes('Живот и талия')) pinned.push('flat-belly');

  const buttFocused = zones.includes('Ягодицы') || zones.includes('Бёдра и галифе');
  if (buttFocused) {
    pinned.push('elastic-butt-1');
    if (!beginnerUser) pinned.push('elastic-butt-2');
  }

  if (input.trainingPlace === 'В зале') pinned.push('gym-program');

  return unique(pinned);
}

function recommendResultPrograms(input) {
  const goalCandidates = unique([input.resultFocus || '', input.goalBody || '']);
  const beginnerUser = isBeginner(input);
  const lowActivity = isLowActivity(input);
  const highBmi = calculateBmiSafeFromInput(input) >= 30;
  const safeMode = beginnerUser || lowActivity || highBmi;

  const scoredPrograms = PROGRAMS
    .filter((program) => isProgramAllowed(program, input, beginnerUser))
    .map((program) => scoreProgram(program, input, goalCandidates, beginnerUser, lowActivity, highBmi))
    .sort((a, b) => b.score - a.score || b.item.priority - a.item.priority);

  const pinnedIds = selectPinnedProgramIds(input, beginnerUser);
  const scoredById = new Map(scoredPrograms.map((program) => [program.item.id, program]));

  const selected = [];
  const selectedIds = new Set();

  const tryAdd = (program) => {
    if (!program) return;
    if (selectedIds.has(program.item.id)) return;
    if (selected.length >= 4) return;
    selected.push(program);
    selectedIds.add(program.item.id);
  };

  pinnedIds.forEach((id) => tryAdd(scoredById.get(id)));

  const orderedByComplexity = safeMode
    ? scoredPrograms.filter((program) => !CHALLENGING_PROGRAM_IDS.has(program.item.id)).concat(scoredPrograms.filter((program) => CHALLENGING_PROGRAM_IDS.has(program.item.id)))
    : scoredPrograms;

  orderedByComplexity.forEach((program) => tryAdd(program));

  if (selected.length < 2) {
    UNIVERSAL_FALLBACK_IDS.forEach((id) => tryAdd(scoredById.get(id)));
  }

  return selected.slice(0, 4).map((program) => ({
    id: program.item.id,
    title: program.item.title,
    type: program.item.type,
    description: program.item.description,
    tags: program.item.tags,
    relevanceTags: buildRelevanceTags(program.item, program.matchedZones, program.matchedGoals, input.trainingPlace),
    imageUrl: program.item.imageUrl,
    localImage: program.item.localImage,
  }));
}

const currentImageByBodyType = {
  'Стройная, хочу тонус': '/assets/quiz/before/current_01_slim_soft.png.png',
  'Чуть поправилась': '/assets/quiz/before/current_02_soft.png.png',
  'Есть заметный лишний вес': '/assets/quiz/before/current_03_fuller.png.png',
  'Набрала больше, чем хотелось бы': '/assets/quiz/before/current_03_fuller.png.png',
};

const targetImageByGoalBody = {
  'Стройное и лёгкое': '/assets/quiz/before/target_01_slim_light.png.png',
  'Подтянутое, с тонусом': '/assets/quiz/before/target_02_toned_fit.png.png',
  'С формами, но без лишнего': '/assets/quiz/before/target_01_slim_light.png.png',
  'Просто здоровое и без боли в спине': '/assets/quiz/before/target_01_slim_light.png.png',
};

function getCurrentImageByBmi(bmi) {
  if (!bmi || Number.isNaN(bmi)) {
    return '/assets/quiz/before/current_02_soft.png.png';
  }

  if (bmi < 25) {
    return '/assets/quiz/before/current_01_slim_soft.png.png';
  }

  if (bmi < 30) {
    return '/assets/quiz/before/current_02_soft.png.png';
  }

  return '/assets/quiz/before/current_03_fuller.png.png';
}

function getTargetImage(goalBody, resultFocus) {
  if (goalBody && targetImageByGoalBody[goalBody]) {
    return targetImageByGoalBody[goalBody];
  }

  if (String(resultFocus || '').toLowerCase().includes('тонус')) {
    return '/assets/quiz/before/target_02_toned_fit.png.png';
  }

  return '/assets/quiz/before/target_01_slim_light.png.png';
}

function getResultImages(input) {
  const currentImage =
    input.currentBodyType && currentImageByBodyType[input.currentBodyType]
      ? currentImageByBodyType[input.currentBodyType]
      : getCurrentImageByBmi(input.bmi);

  const targetImage = getTargetImage(input.goalBody, input.resultFocus);

  return {
    currentImage,
    targetImage,
  };
}

function buildResult() {
  const currentWeight = Number(state.answers.current_weight || 70);
  const targetWeight = Number(state.answers.target_weight || currentWeight);
  const height = Number(state.answers.height || 165);
  const age = getAge(state.answers.age);
  const bmr = Math.round(10 * currentWeight + 6.25 * height - 5 * age - 161);
  const maintenance = Math.round((bmr * activityFactor(state.answers.activity)) / 10) * 10;
  const diff = Number((currentWeight - targetWeight).toFixed(1));
  const calorieNorm = Math.max(1200, Math.round((diff > 0 ? maintenance * 0.85 : maintenance) / 10) * 10);
  const protein = Math.round(targetWeight * 1.6);
  const fat = Math.round(targetWeight * 0.8);
  const carbs = Math.max(0, Math.round((calorieNorm - protein * 4 - fat * 9) / 4));
  const bmi = Number((currentWeight / Math.pow(height / 100, 2)).toFixed(1));

  let bmiLabel = 'высокий вес';
  if (bmi < 18.5) bmiLabel = 'ниже нормы';
  else if (bmi < 25) bmiLabel = 'норма';
  else if (bmi < 30) bmiLabel = 'выше нормы';

  const zones = Array.isArray(state.answers.zones) ? state.answers.zones : [];
  const goal = state.answers.result_focus || state.answers.goal_body || '';

  const inputs = [];
  if (goal) inputs.push({ label: 'Цель', value: goal });
  if (zones.length) inputs.push({ label: 'Зоны', value: zones.join(', ') });
  if (state.answers.training_place) inputs.push({ label: 'Формат', value: state.answers.training_place });
  if (state.answers.experience) inputs.push({ label: 'Уровень', value: state.answers.experience });
  else if (state.answers.activity) inputs.push({ label: 'Активность', value: state.answers.activity });

  const programs = recommendResultPrograms({
    ageBucket: state.answers.age,
    activity: state.answers.activity,
    currentWeight,
    targetWeight,
    height,
    goalBody: state.answers.goal_body,
    resultFocus: state.answers.result_focus,
    zones,
    trainingPlace: state.answers.training_place,
    experience: state.answers.experience,
    bestShape: state.answers.best_shape,
  });

  const images = getResultImages({
    currentBodyType: state.answers.body_now,
    goalBody: state.answers.goal_body,
    resultFocus: state.answers.result_focus,
    bmi,
  });

  return {
    bmi,
    bmiLabel,
    calorieNorm,
    protein,
    fat,
    carbs,
    weightDiff: Math.abs(diff),
    weightLoss: diff > 0,
    currentImage: images.currentImage,
    targetImage: images.targetImage,
    inputs,
    programs,
  };
}

function parseNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return undefined;
}

function bmiStateLabel(value) {
  if (value < 18.5) return 'ниже нормы';
  if (value < 25) return 'в норме';
  if (value < 30) return 'выше нормы';
  return 'значительно выше нормы';
}

function buildInputBmiCard(screenId, inputValue) {
  let currentWeight = parseNumber(state.answers.current_weight);
  let height = parseNumber(state.answers.height);

  if (screenId === 'current_weight') {
    currentWeight = parseNumber(inputValue);
  }

  if (screenId === 'height') {
    height = parseNumber(inputValue);
  }

  if (screenId === 'target_weight') {
    currentWeight = parseNumber(inputValue) ?? currentWeight;
  }

  const hasMetrics = Boolean(currentWeight && height && currentWeight > 0 && height > 0);
  if (!hasMetrics) {
    return {
      title: 'Рассчитываем ИМТ',
      text: 'ИМТ помогает точнее подобрать безопасный темп, нагрузку и питание под вас.',
    };
  }

  const bmiValue = Number((currentWeight / Math.pow(height / 100, 2)).toFixed(1));
  return {
    title: 'ИМТ: ' + bmiValue + ' (' + bmiStateLabel(bmiValue) + ')',
    text: 'Это ориентир для персонального плана: учитываем его, чтобы комфортно двигаться к цели.',
  };
}

function numberInputPlaceholder(screenId) {
  if (screenId === 'current_weight') return '72';
  if (screenId === 'height') return '168';
  if (screenId === 'target_weight') return '60';
  return '0';
}

function buildWeightProgress(inputValue) {
  const currentWeight = parseNumber(state.answers.current_weight);
  const targetWeight = parseNumber(inputValue);

  if (!currentWeight || !targetWeight || currentWeight <= 0 || targetWeight <= 0) {
    return undefined;
  }

  const diff = Number((currentWeight - targetWeight).toFixed(1));
  const min = Math.min(currentWeight, targetWeight);
  const max = Math.max(currentWeight, targetWeight);
  const span = max - min || 1;
  const pad = span * 0.18;
  const lo = min - pad;
  const hi = max + pad;
  const toPercent = (value) => Math.round(((value - lo) / (hi - lo)) * 100);

  let caption = 'Вы хотите сохранить текущий вес, поможем закрепить результат.';
  if (diff > 0) caption = 'Цель: минус ' + Math.abs(diff) + ' кг. Построим к ней комфортный путь.';
  else if (diff < 0) caption = 'Цель: плюс ' + Math.abs(diff) + ' кг. Поможем набрать форму бережно.';

  return {
    currentWeight,
    targetWeight,
    diff,
    caption,
    currentPercent: toPercent(currentWeight),
    targetPercent: toPercent(targetWeight),
  };
}

function validateCurrent() {
  const s = screen();
  const value = state.answers[s.id];
  const errors = [];

  if (s.type === 'single_choice') {
    if (typeof value !== 'string' || !value) errors.push('Выберите один вариант.');
  }
  if (s.type === 'multi_choice') {
    if (!Array.isArray(value) || value.length === 0) errors.push('Выберите хотя бы один вариант.');
  }
  if (s.type === 'number_input') {
    const n = Number(value);
    if (Number.isNaN(n)) errors.push('Введите корректное числовое значение.');
    const range = rangeById[s.id];
    if (range && n < range[0]) errors.push('Значение должно быть не меньше ' + range[0] + '.');
    if (range && n > range[1]) errors.push('Значение должно быть не больше ' + range[1] + '.');
  }
  if (s.type === 'lead_gate') {
    const lead = value || {};

    const nameInput = document.getElementById('leadName');
    const emailInput = document.getElementById('leadEmail');
    const consentInput = document.getElementById('leadConsent');
    if (nameInput || emailInput || consentInput) {
      const synced = {
        name: nameInput ? nameInput.value : String(lead.name || ''),
        email: emailInput ? emailInput.value : String(lead.email || ''),
        consentAccepted: consentInput ? Boolean(consentInput.checked) : Boolean(lead.consentAccepted),
      };
      state.answers[s.id] = synced;
      lead.name = synced.name;
      lead.email = synced.email;
      lead.consentAccepted = synced.consentAccepted;
    }

    if (!lead.name || !String(lead.name).trim()) errors.push('Введите ваше имя.');
    const email = String(lead.email || '').trim();
    if (!email) errors.push('Введите вашу почту.');
    else if (!/^\\S+@\\S+\\.\\S+$/.test(email)) errors.push('Введите почту в корректном формате.');
    if (!lead.consentAccepted) errors.push('Подтвердите согласие на обработку персональных данных.');
  }

  state.errors = errors;
  return errors.length === 0;
}

function next() {
  if (!validateCurrent()) {
    render();
    return;
  }
  if (state.index < map.screens.length - 1) state.index += 1;
  state.errors = [];
  render();
}

function back() {
  if (state.index > 0) state.index -= 1;
  if (state.index > 0 && map.screens[state.index] && map.screens[state.index].id === 'plan_loader') {
    state.index -= 1;
  }
  state.errors = [];
  render();
}

function optionClick(opt) {
  const s = screen();
  if (s.type === 'single_choice') {
    state.answers[s.id] = opt;
    state.errors = [];
    render();
    const lockedIndex = state.index;
    setTimeout(() => {
      if (state.index === lockedIndex && state.answers[s.id] === opt) next();
    }, 260);
    return;
  }
  if (s.type === 'multi_choice') {
    const cur = Array.isArray(state.answers[s.id]) ? [...state.answers[s.id]] : [];
    const idx = cur.indexOf(opt);
    if (idx >= 0) cur.splice(idx, 1);
    else cur.push(opt);
    state.answers[s.id] = cur;
  }
  state.errors = [];
  render();
}

function inputValue(value) {
  const s = screen();
  if (s.type === 'number_input') {
    state.answers[s.id] = value === '' ? undefined : Number(value);
  }
  state.errors = [];
}

function inputLead(field, value) {
  const s = screen();
  const lead = state.answers[s.id] || { name: '', email: '', consentAccepted: true };
  lead[field] = value;
  state.answers[s.id] = lead;
  state.errors = [];
}

function toggleLeadConsent(checked) {
  const s = screen();
  const lead = state.answers[s.id] || { name: '', email: '', consentAccepted: true };
  lead.consentAccepted = checked;
  state.answers[s.id] = lead;
  state.errors = [];
}

function goPaywall() {
  const idx = map.screens.findIndex((item) => item.id === 'paywall');
  if (idx >= 0) state.index = idx;
  state.errors = [];
  render();
}

function headerHtml() {
  const p = progress();
  const segmentCount = 5;
  const filled = (p / 100) * segmentCount;
  const hasBack = state.index > 0;
  const backControl = hasBack
    ? '<button class="icon-btn" id="backIconBtn" aria-label="Назад"><span class="icon-btn-icon" aria-hidden="true"></span></button>'
    : '';

  const segments = Array.from({ length: segmentCount }, (_, index) => {
    const ratio = Math.max(0, Math.min(1, filled - index));
    return (
      '<span class="progress-segment">' +
        '<span class="progress-segment-fill" style="transform:scaleX(' + ratio.toFixed(4) + ')"></span>' +
      '</span>'
    );
  }).join('');

  const logoRow = '<div class="header-logo-row" aria-hidden="true"><img class="header-logo" src="/assets/brand/usmanova-fit-logo.png" alt="" /></div>';

  return (
    '<div class="header">' +
      logoRow +
      '<div class="header-progress-row' + (hasBack ? '' : ' is-start') + '">' +
        backControl +
        '<div class="progress">' + segments + '</div>' +
        '<span class="header-percent">' + Math.round(p) + '%</span>' +
      '</div>' +
    '</div>'
  );
}

function legalLinksHtml() {
  return (
    '<div class="legal">' +
      '<a href="' + map.legal_links.offer + '" target="_blank" rel="noreferrer">Оферта</a>' +
      ' · ' +
      '<a href="' + map.legal_links.privacy + '" target="_blank" rel="noreferrer">Политика конфиденциальности</a>' +
      ' · ' +
      '<a href="' + map.legal_links.personal_data + '" target="_blank" rel="noreferrer">Согласие на обработку персональных данных</a>' +
    '</div>'
  );
}

function renderInputIconSvg(label) {
  if (label === 'Цель') {
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="8" />' +
        '<circle cx="12" cy="12" r="3" />' +
        '<path d="M12 2v3M12 19v3M2 12h3M19 12h3" />' +
      '</svg>'
    );
  }

  if (label === 'Зоны') {
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M8 3c2 2 6 2 8 0" />' +
        '<path d="M7 5c1 4 1 10-1 16" />' +
        '<path d="M17 5c-1 4-1 10 1 16" />' +
        '<path d="M8 13c2 1 6 1 8 0" />' +
      '</svg>'
    );
  }

  if (label === 'Формат') {
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M4 11l8-7 8 7" />' +
        '<path d="M6 10v10h12V10" />' +
        '<path d="M10 20v-6h4v6" />' +
      '</svg>'
    );
  }

  return (
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M6 20V10" />' +
      '<path d="M12 20V5" />' +
      '<path d="M18 20v-8" />' +
      '<path d="M4 20h16" />' +
    '</svg>'
  );
}

function renderProgramIconSvg(title) {
  if (title.includes('Живот') || title.includes('талия')) {
    return (
      '<svg viewBox="0 0 56 56" aria-hidden="true">' +
        '<path d="M22 8c3 3 9 3 12 0" />' +
        '<path d="M20 12c2 9 2 22-3 34" />' +
        '<path d="M36 12c-2 9-2 22 3 34" />' +
        '<path d="M20 31c5 3 11 3 16 0" />' +
      '</svg>'
    );
  }

  if (title.includes('Ягодицы') || title.includes('ног') || title.includes('попа')) {
    return (
      '<svg viewBox="0 0 56 56" aria-hidden="true">' +
        '<path d="M18 16c4 8 4 22-2 32" />' +
        '<path d="M38 16c-4 8-4 22 2 32" />' +
        '<path d="M18 22c6 6 14 6 20 0" />' +
        '<path d="M22 38c4 3 8 3 12 0" />' +
      '</svg>'
    );
  }

  return (
    '<svg viewBox="0 0 56 56" aria-hidden="true">' +
      '<path d="M17 36l22-22" />' +
      '<path d="M13 32l11 11" />' +
      '<path d="M32 13l11 11" />' +
      '<path d="M9 36l11 11" />' +
      '<path d="M36 9l11 11" />' +
    '</svg>'
  );
}

function stickyButtonHtml(label) {
  return (
    '<div class="sticky">' +
      '<button class="btn" id="nextBtn">' + label + '</button>' +
    '</div>'
  );
}

function render() {
  if (loaderAutoNextTimer) {
    clearTimeout(loaderAutoNextTimer);
    loaderAutoNextTimer = null;
  }

  const s = screen();
  const value = state.answers[s.id];

  const title = s.question || s.title || '';
  const subtitle = s.subtitle || s.text || '';
  const trustMediaHtml = (s.type === 'trust' || s.type === 'sales_transition')
    ? trustVideoById[s.id]
      ? '<video class="trust-video" src="' + trustVideoById[s.id] + '" poster="' + trustVideoById[s.id].replace(/\.mp4$/, '.webp') + '" autoplay muted loop playsinline preload="metadata"></video>'
      : beforeAfterById[s.id]
        ? '<div class="before-after" aria-hidden="true">' +
            '<figure class="before-after-item"><img class="before-after-image" src="' + beforeAfterById[s.id].before + '" alt="" /><figcaption class="before-after-caption">Сейчас</figcaption></figure>' +
            '<figure class="before-after-item is-after"><img class="before-after-image" src="' + beforeAfterById[s.id].after + '" alt="" /><figcaption class="before-after-caption">Цель</figcaption></figure>' +
          '</div>'
        : trustMediaById[s.id]
          ? '<img class="trust-photo" src="' + trustMediaById[s.id] + '" alt="" aria-hidden="true" />'
          : ''
    : '';
  const researchSlides = s.type === 'trust' && Array.isArray(researchSlidesById[s.id]) ? researchSlidesById[s.id] : [];
  const hasResearchSlides = researchSlides.length > 0;

  let body = '';

  if (s.id === 'age' && s.type === 'single_choice') {
    body += '<div class="age-scale">' +
      (s.options || []).map((opt) => {
        const isSel = value === opt;
        return (
          '<button class="age-chip ' + (isSel ? 'is-selected' : '') + '" data-opt="' + encodeURIComponent(opt) + '">' +
            '<span class="age-chip-value">' + opt + '</span>' +
            (/[\u0430-\u044f\u0451]/i.test(opt) ? '' : '<span class="age-chip-unit">лет</span>') +
          '</button>'
        );
      }).join('') +
    '</div>';
  } else if (s.id === 'result_focus' && s.type === 'single_choice') {
    const icons = Array.isArray(s.option_icons) ? s.option_icons : [];
    body += '<div class="goal-grid">' +
      (s.options || []).map((opt, index) => {
        const isSel = value === opt;
        const icon = icons[index];
        const iconHtml = icon
          ? '<span class="goal-card-icon" style="--opt-icon:url(' + icon + ')"></span>'
          : '';
        return (
          '<button class="goal-card ' + (isSel ? 'is-selected' : '') + '" data-opt="' + encodeURIComponent(opt) + '">' +
            iconHtml +
            '<span class="goal-card-text">' + opt + '</span>' +
          '</button>'
        );
      }).join('') +
    '</div>';
  } else if (s.type === 'single_choice' || s.type === 'multi_choice') {
    const selected = Array.isArray(value) ? value : [];
    const icons = Array.isArray(s.option_icons) ? s.option_icons : [];
    body += '<div class="option-list">' +
      (s.options || []).map((opt, index) => {
        const isSel = s.type === 'single_choice' ? value === opt : selected.includes(opt);
        const icon = icons[index];
        const mediaHtml = !icon
          ? ''
          : icon.toLowerCase().endsWith('.svg')
            ? '<span class="opt-illus" style="--opt-icon:url(' + icon + ')"></span>'
            : '<img class="opt-photo" src="' + icon + '" alt="" aria-hidden="true" />';
        return (
          '<button class="option ' + (isSel ? 'selected' : '') + '" data-opt="' + encodeURIComponent(opt) + '">' +
            mediaHtml +
            '<span class="opt-text">' + opt + '</span>' +
            '<span class="check">' + (isSel ? '<span class="check-icon" aria-hidden="true"></span>' : '') + '</span>' +
          '</button>'
        );
      }).join('') +
    '</div>';
  }

  if (s.type === 'number_input') {
    const numericValue = value ?? '';
    const placeholder = numberInputPlaceholder(s.id);
    const showInputHintCard = true;
    let detailHtml = '';

    if (showInputHintCard) {
      const bmiCard = buildInputBmiCard(s.id, value);
      detailHtml =
        '<div class="bmi-card">' +
          '<span class="bmi-icon" style="--bmi-icon:url(' + bmiIconSrc + ')"></span>' +
          '<div class="bmi-content">' +
            '<p class="bmi-title">' + bmiCard.title + '</p>' +
            '<p class="bmi-text">' + bmiCard.text + '</p>' +
          '</div>' +
        '</div>';
    }

    body +=
      '<div class="metric-section">' +
        '<div class="metric-input-wrap">' +
          '<label class="metric-input">' +
            '<input class="metric-value" type="number" inputmode="numeric" placeholder="' + placeholder + '" value="' + numericValue + '" id="numInput" />' +
            '<span class="metric-unit">' + (s.unit || '') + '</span>' +
          '</label>' +
          '<span class="metric-divider"></span>' +
        '</div>' +
        detailHtml +
      '</div>';
  }

  if (s.type === 'sales_transition' && Array.isArray(s.benefits)) {
    body += '<div class="benefit-list">' + s.benefits.map((b, index) => (
      '<p class="benefit-item" style="--benefit-delay:' + (index * 220) + 'ms">' +
        '<span class="benefit-check"></span>' +
        '<span class="benefit-text">' + b + '</span>' +
      '</p>'
    )).join('') + '</div>';
  }

  if (s.type === 'trust' && researchSlides.length > 0) {
    const current = typeof state.researchSlideById[s.id] === 'number' ? state.researchSlideById[s.id] : 0;
    const slideIndex = Math.max(0, Math.min(current, researchSlides.length - 1));
    state.researchSlideById[s.id] = slideIndex;
    const slide = researchSlides[slideIndex];

    body +=
      '<div class="research-slider">' +
        '<div class="research-stage">' +
          '<button class="research-nav" id="researchPrevBtn" aria-label="Предыдущий слайд" ' + (slideIndex === 0 ? 'disabled' : '') + '><span class="research-nav-icon"></span></button>' +
          '<div class="research-copy">' +
            '<p class="research-text">' + slide.text + '</p>' +
            '<p class="research-source">' + slide.source + '</p>' +
          '</div>' +
          '<button class="research-nav is-next" id="researchNextBtn" aria-label="Следующий слайд" ' + (slideIndex === researchSlides.length - 1 ? 'disabled' : '') + '><span class="research-nav-icon"></span></button>' +
        '</div>' +
        '<div class="research-dots">' +
          researchSlides.map((_, index) => '<button class="research-dot ' + (index === slideIndex ? 'is-active' : '') + '" data-research-index="' + index + '"></button>').join('') +
        '</div>' +
      '</div>';
  }

  if (s.type === 'loader' && Array.isArray(s.steps)) {
    body +=
      '<div class="quiz-plan-loader" aria-label="Сбор персонального плана">' +
        '<div class="quiz-plan-indicator" aria-hidden="true">' +
          '<span class="quiz-plan-ring"></span>' +
          '<span class="quiz-plan-core">' +
            '<span class="quiz-plan-percent">' +
              '<span class="quiz-plan-percent-value is-one">24%</span>' +
              '<span class="quiz-plan-percent-value is-two">57%</span>' +
              '<span class="quiz-plan-percent-value is-three">86%</span>' +
              '<span class="quiz-plan-percent-value is-four">100%</span>' +
            '</span>' +
          '</span>' +
        '</div>' +
        '<div class="quiz-plan-status-list">' +
          s.steps.map((step, index) => (
            '<div class="quiz-plan-status' + (index === s.steps.length - 1 ? ' is-last' : '') + '" style="--step-delay:' + (index * 1000) + 'ms">' +
              '<span class="quiz-plan-status-dot" aria-hidden="true"></span>' +
              '<span>' + step + '</span>' +
            '</div>'
          )).join('') +
        '</div>' +
      '</div>';

    if (s.steps.length > 0) {
      const lockedIndex = state.index;
      loaderAutoNextTimer = setTimeout(() => {
        if (state.index !== lockedIndex) return;
        const active = screen();
        if (active.id !== s.id || active.type !== 'loader') return;
        next();
      }, 4200);
    }
  }

  if (s.type === 'lead_gate') {
    const lead = value || { name: '', email: '', consentAccepted: true };

    body +=
      '<div class="grid">' +
        '<label class="field-wrap"><input class="field" id="leadName" type="text" autocomplete="name" name="name" placeholder="Ваше имя" value="' + (lead.name || '') + '" /></label>' +
        '<label class="field-wrap"><input class="field" id="leadEmail" type="email" autocomplete="email" name="email" placeholder="Ваша почта" value="' + (lead.email || '') + '" /></label>' +
        '<label class="legal"><input class="consent-checkbox" type="checkbox" id="leadConsent" ' + (lead.consentAccepted ? 'checked' : '') + ' /> Я согласна на обработку персональных данных</label>' +
      '</div>';

    body += legalLinksHtml();
  }

  if (s.type === 'personal_result') {
    const result = buildResult();
    const lead = state.answers.lead_gate || { name: '' };
    const currentWeight = Number(state.answers.current_weight || 70);
    const targetWeight = Number(state.answers.target_weight || currentWeight);
    const firstName = String(lead.name || '').trim().split(/\s+/)[0] || '';
    const displayName = firstName || 'Ваш план';
    const resultTitleMain = firstName ? displayName + ', вот ваш план:' : 'Ваш план:';

    const bmiMarker = Math.max(4, Math.min(96, ((result.bmi - 15) / 25) * 100));
    const hasWeightDiff = result.weightDiff > 0;
    const goalDeltaPrefix = result.weightLoss ? '-' : '+';

    body += '<div class="result-screen">';

    body +=
      '<section class="result-showcase">' +
        '<div class="result-showcase-main">' +
          '<header class="result-intro">' +
            '<h2 class="result-title">' +
              '<span class="result-title-main">' + resultTitleMain + '</span>' +
              '<span class="result-title-line">с <strong>' + currentWeight + '</strong> до <strong>' + targetWeight + '</strong> кг</span>' +
            '</h2>' +
            '<p class="result-lead">Мы собрали ориентир по тренировкам и питанию на основе ваших ответов.</p>' +
          '</header>' +

          '<section class="result-hero">' +
            '<h3 class="result-hero-title">Ваш путь к цели</h3>' +
            '<div class="result-journey">' +
              '<div class="result-journey-stat is-current">' +
                '<span class="result-journey-caption">Сейчас</span>' +
                '<span class="result-journey-weight">' + currentWeight + '<span class="result-journey-unit">кг</span></span>' +
              '</div>' +
              '<div class="result-journey-stat is-target">' +
                '<span class="result-journey-caption">Цель</span>' +
                '<span class="result-journey-weight">' + targetWeight + '<span class="result-journey-unit">кг</span></span>' +
              '</div>' +

              '<img class="result-journey-arc" src="/assets/quiz/result/duga.svg" alt="" loading="lazy" decoding="async" aria-hidden="true" />' +

              '<div class="result-journey-figures" aria-hidden="true">' +
                '<span class="result-journey-figure is-current">' +
                  '<img class="result-journey-image" src="' + result.currentImage + '" alt="" loading="lazy" decoding="async" data-result-image="current" />' +
                  '<span class="result-journey-placeholder is-hidden" data-result-placeholder="current">' +
                    '<span class="result-journey-silhouette is-current"></span>' +
                  '</span>' +
                '</span>' +
                '<span class="result-journey-figure is-target">' +
                  '<img class="result-journey-image" src="' + result.targetImage + '" alt="" loading="lazy" decoding="async" data-result-image="target" />' +
                  '<span class="result-journey-placeholder is-hidden" data-result-placeholder="target">' +
                    '<span class="result-journey-silhouette is-target"></span>' +
                  '</span>' +
                '</span>' +
              '</div>' +

              '<img class="result-journey-arrow" src="/assets/quiz/result/arrow.svg" alt="" loading="lazy" decoding="async" aria-hidden="true" />' +

              '<div class="result-journey-goal">' +
                '<span class="result-journey-goal-label">Цель:</span>' +
                (hasWeightDiff
                  ? '<span class="result-journey-goal-value">' + goalDeltaPrefix + result.weightDiff + '<span class="result-journey-goal-unit">кг</span></span>'
                  : '<span class="result-journey-goal-note">сохранить форму</span>') +
              '</div>' +
            '</div>' +
          '</section>' +
        '</div>' +

        '<aside class="result-showcase-aside" aria-hidden="true">' +
          '<img class="result-showcase-photo" src="/assets/quiz/result/usmanova_result.webp" alt="" loading="lazy" decoding="async" />' +
        '</aside>' +
      '</section>';

    if (result.inputs.length) {
      body +=
        '<section class="result-card">' +
          '<h3 class="result-card-title">Ваши вводные</h3>' +
          '<p class="result-card-note">На их основе мы собрали персональный план.</p>' +
          '<div class="result-inputs">' +
            result.inputs.map((item) => (
              '<div class="result-input-chip">' +
                '<span class="result-input-icon" aria-hidden="true">' + renderInputIconSvg(item.label) + '</span>' +
                '<span class="result-input-label">' + item.label + '</span>' +
                '<span class="result-input-value">' + item.value + '</span>' +
              '</div>'
            )).join('') +
          '</div>' +
        '</section>';
    }

    body +=
      '<div class="result-metrics-grid">' +
        '<section class="result-card result-nutrition-card">' +
          '<div class="result-card-heading">' +
            '<span class="result-card-icon is-plate" aria-hidden="true"></span>' +
            '<h3 class="result-card-title">Ориентир по питанию</h3>' +
          '</div>' +
          '<span class="result-nutrition-decor" aria-hidden="true"></span>' +
          '<div class="result-calories">' +
            '<span class="result-calories-value">' + result.calorieNorm + '</span>' +
            '<span class="result-calories-unit">ккал<br />в день</span>' +
          '</div>' +
          '<div class="result-macros">' +
            '<div class="result-macro is-protein">' +
              '<span class="result-macro-label">Белки</span>' +
              '<span class="result-macro-value">' + result.protein + ' г</span>' +
            '</div>' +
            '<div class="result-macro is-fat">' +
              '<span class="result-macro-label">Жиры</span>' +
              '<span class="result-macro-value">' + result.fat + ' г</span>' +
            '</div>' +
            '<div class="result-macro is-carbs">' +
              '<span class="result-macro-label">Углеводы</span>' +
              '<span class="result-macro-value">' + result.carbs + ' г</span>' +
            '</div>' +
          '</div>' +
          '<p class="result-card-note">Это ориентир для старта. Точные значения можно корректировать по самочувствию и динамике.</p>' +
        '</section>' +

        '<section class="result-card result-bmi-card">' +
          '<div class="result-card-heading">' +
            '<span class="result-card-icon is-bmi" aria-hidden="true"></span>' +
            '<h3 class="result-card-title">Индекс массы тела</h3>' +
          '</div>' +
          '<div class="result-bmi-summary">' +
            '<span class="result-bmi-value">' + result.bmi + '</span>' +
            '<span class="result-bmi-status">' + result.bmiLabel + '</span>' +
          '</div>' +
          '<div class="result-bmi-scale" aria-hidden="true">' +
            '<div class="result-bmi-track"></div>' +
            '<span class="result-bmi-marker" style="left: ' + bmiMarker.toFixed(1) + '%"></span>' +
          '</div>' +
          '<div class="result-bmi-legend">' +
            '<span>Низкий</span><span>Норма</span><span>Выше</span><span>Высокий</span>' +
          '</div>' +
          '<p class="result-card-note">Используем этот показатель как ориентир для подбора комфортной нагрузки.</p>' +
        '</section>' +
      '</div>';

    body +=
      '<section class="result-programs">' +
        '<h3 class="result-card-title">Подборка программ для вас</h3>' +
        '<p class="result-programs-subtitle">Мы выбрали программы под вашу цель, зоны и формат тренировок.</p>' +
        '<div class="result-programs-carousel">' +
          '<div class="result-programs-list">' +
          result.programs.map((program) => (
            '<article class="result-program" draggable="false">' +
              '<div class="result-program-image-wrap" aria-hidden="true">' +
                '<img class="result-program-image" src="' + program.localImage + '" alt="' + program.title + '" loading="lazy" decoding="async" draggable="false" data-program-id="' + program.id + '" data-fallback="0" data-remote="' + program.imageUrl + '" />' +
                '<span class="result-program-fallback is-hidden" data-program-fallback="' + program.id + '">' +
                  '<span class="result-program-fallback-icon">' + renderProgramIconSvg(program.title) + '</span>' +
                  '<span class="result-program-fallback-title">' + program.title + '</span>' +
                '</span>' +
              '</div>' +
              '<div class="result-program-copy">' +
                '<div class="result-program-badges">' +
                  '<span class="result-program-badge is-type">' + program.type + '</span>' +
                '</div>' +
                '<h4 class="result-program-title">' + program.title + '</h4>' +
                '<p class="result-program-reason">' + program.description + '</p>' +
              '</div>' +
            '</article>'
          )).join('') +
          '</div>' +
          '<button type="button" class="result-programs-arrow is-left" id="resultProgramsArrowPrevBtn" aria-label="Прокрутить программы влево">' +
            '<span class="result-programs-arrow-icon" aria-hidden="true"></span>' +
          '</button>' +
          '<button type="button" class="result-programs-arrow" id="resultProgramsArrowBtn" aria-label="Прокрутить программы вправо">' +
            '<span class="result-programs-arrow-icon" aria-hidden="true"></span>' +
          '</button>' +
        '</div>' +
      '</section>';

    body += '</div>';
  }

  if (s.type === 'paywall') {
    const result = buildResult();
    const lead = state.answers.lead_gate || { name: '' };
    const currentWeight = Number(state.answers.current_weight || 70);
    const targetWeight = Number(state.answers.target_weight || currentWeight);
    const firstName = String(lead.name || '').trim().split(/\s+/)[0] || '';
    const diff = Math.abs(currentWeight - targetWeight);
    const isLoss = targetWeight < currentWeight;
    const isGain = targetWeight > currentWeight;

    if (state.selectedTariff === undefined) state.selectedTariff = 'Популярно';

    const heading = firstName ? firstName + ', ваш план готов' : 'Ваш план готов';
    const orientir = isLoss
      ? 'Похудеть до ' + targetWeight + ' кг и сохранить форму'
      : isGain
        ? 'Набрать до ' + targetWeight + ' кг и сохранить форму'
        : 'Сохранить вес ' + targetWeight + ' кг и улучшить форму';

    const includeSvgs = [
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5z"/><path d="M9 9h7M9 13h7M9 17h4"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19l5-5 4 4 5-9"/><circle cx="10" cy="14" r="1"/><circle cx="14" cy="18" r="1"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7a5 5 0 0 0 10 0V3"/><path d="M12 15v6"/><path d="M8 21h8"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/></svg>',
    ];
    const includes = [
      { title: 'Программы Кати Усмановой', text: 'Тренировки для дома и зала под разные цели: стройность, тонус, живот, талия, ягодицы и всё тело.' },
      { title: 'Маршрут под вашу цель', text: 'Начните с программ, которые подходят под ваши ответы в квизе.' },
      { title: 'Помощник по питанию', text: 'Помогает проще ориентироваться в питании без жёстких диет и сложных таблиц.' },
      { title: 'Каталог тренировок', text: 'Можно менять направление и постепенно подключать новые программы.' },
      { title: 'Бережный старт', text: 'Подходит, если вы начинаете с нуля или возвращаетесь после перерыва.' },
    ];
    const facts = [
      'Вице-чемпионка мира и чемпионка России по фитнес-бикини',
      'Профессиональный тренер с опытом более 15 лет',
      'Автор первых в России масштабных марафонов стройности',
      'Программы для дома и зала, подход без перегруза',
    ];
    const safetySvgs = [
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/><circle cx="12" cy="15" r="1"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 13h5M10 16h5"/></svg>',
    ];
    const safety = [
      { title: 'Безопасная оплата', text: 'Платёж проходит через защищённую форму.' },
      { title: 'Доступ после оплаты', text: 'После оформления вы получите доступ к программам.' },
      { title: 'Подписку можно отключить', text: 'Отключение доступно в личном кабинете.' },
      { title: 'Юридические документы', text: 'Оферта и правила обработки данных доступны ниже.' },
    ];
    const faq = [
      { q: 'Что входит в подписку?', a: 'В подписку входят программы Кати Усмановой, каталог тренировок и помощник по питанию.' },
      { q: 'Подойдёт ли мне, если я начинаю с нуля?', a: 'Да. Можно начать с мягких программ и постепенно привыкать к нагрузке.' },
      { q: 'Где проходят тренировки?', a: 'В подписке есть программы для дома и зала. Подборка учитывает выбранный вами формат.' },
      { q: 'Как работает автопродление?', a: 'После пробного периода или оплаченного срока подписка продлевается автоматически по условиям выбранного тарифа.' },
      { q: 'Можно ли отключить подписку?', a: 'Да. Подписку можно отключить в личном кабинете.' },
      { q: 'Когда я получу доступ?', a: 'После оплаты доступ открывается через систему оформления заказа.' },
      { q: 'Что делать, если нагрузка покажется сложной?', a: 'Начинайте с мягких программ и выбирайте посильный темп. План используется как ориентир, а не как жёсткое обязательство.' },
    ];
    const tariffNotes = {
      'Лёгкий старт': 'Подходит, чтобы попробовать программы и начать без долгого обязательства.',
      'Популярно': 'Оптимальный вариант, чтобы втянуться и пройти первые программы.',
      'Хит продаж': 'Для спокойной работы над результатом без спешки.',
    };
    const checkSvg = '<svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg>';
    const embedSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg>';

    body += '<div class="paywall">';

    body +=
      '<section class="paywall-hero">' +
        '<div class="paywall-hero-photo">' +
          '<img src="/assets/quiz/result/usmanova_result.webp" alt="Екатерина Усманова" loading="lazy" decoding="async" />' +
        '</div>' +
        '<div class="paywall-hero-copy">' +
          '<h2 class="paywall-hero-title">' + heading + '</h2>' +
          '<p class="paywall-hero-sub">Получите доступ к программам Кати Усмановой, помощнику по питанию и тренировкам, которые подходят под вашу цель.</p>' +
          '<p class="paywall-hero-orientir">' +
            '<span style="width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(255,255,255,.82);color:var(--primary);flex-shrink:0" aria-hidden="true">' +
              '<svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>' +
            '</span>' +
            '<span>' + orientir + '</span>' +
          '</p>' +
          '<div class="paywall-chips">' +
            '<span class="paywall-chip">Программы</span>' +
            '<span class="paywall-chip">Питание</span>' +
            '<span class="paywall-chip">Под вашу цель</span>' +
          '</div>' +
          '<button type="button" class="paywall-cta" id="paywallTopCta">Выбрать доступ</button>' +
        '</div>' +
      '</section>';

    body +=
      '<section class="paywall-section paywall-proof">' +
        '<h3 class="paywall-h">С Катей уже тренируются сотни тысяч женщин</h3>' +
        '<div class="paywall-proof-top">' +
          '<img class="paywall-proof-photo" src="/assets/quiz/hero/hero.webp" alt="Екатерина Усманова" loading="lazy" decoding="async" />' +
          '<div class="paywall-proof-count">' +
            '<strong>580 000+</strong>' +
            '<span>женщин занимаются по программам Кати Усмановой</span>' +
          '</div>' +
        '</div>' +
        '<div class="paywall-facts">' +
          facts.map((fact) => (
            '<span class="paywall-fact">' +
              '<span class="paywall-fact-mark" aria-hidden="true">' + checkSvg + '</span>' +
              '<span>' + fact + '</span>' +
            '</span>'
          )).join('') +
        '</div>' +
        '<div class="paywall-gallery-head">Результаты участниц</div>' +
        '<p class="paywall-gallery-hint">Реальные фотографии участниц программ Кати Усмановой.</p>' +
        '<div class="result-programs-carousel">' +
          '<div class="paywall-gallery" id="paywallGalleryList">' +
            Array.from({ length: 14 }, (unused, galleryIndex) => {
              const num = String(galleryIndex + 1).padStart(2, '0');
              return (
                '<div class="paywall-gallery-item">' +
                  '<span class="paywall-gallery-badge">До и после</span>' +
                  '<img src="/assets/quiz/trust/gallery/student-' + num + '.webp" alt="Результат участницы" loading="lazy" decoding="async" data-gallery="1" />' +
                '</div>'
              );
            }).join('') +
          '</div>' +
          '<button type="button" class="result-programs-arrow is-left" id="paywallGalleryArrowPrev" aria-label="Прокрутить истории влево">' +
            '<span class="result-programs-arrow-icon" aria-hidden="true"></span>' +
          '</button>' +
          '<button type="button" class="result-programs-arrow" id="paywallGalleryArrowNext" aria-label="Прокрутить истории вправо">' +
            '<span class="result-programs-arrow-icon" aria-hidden="true"></span>' +
          '</button>' +
        '</div>' +
      '</section>';

    body +=
      '<section class="paywall-section" id="paywallTariffs">' +
        '<h3 class="paywall-h">Выберите формат доступа</h3>' +
        '<p class="paywall-sub">Подписку можно отключить в личном кабинете.</p>' +
        '<div class="paywall-tariffs">' +
          map.tariffs.map((t) => {
            const isPopular = t.name === 'Популярно';
            const isHit = t.name === 'Хит продаж';
            const isSelected = state.selectedTariff === t.name;
            return (
              '<div class="paywall-tariff' + (isPopular ? ' is-popular' : '') + (isSelected ? ' is-selected' : '') + '">' +
                '<div class="paywall-tariff-head">' +
                  '<span class="paywall-tariff-name">' + t.name + '</span>' +
                  (isPopular ? '<span class="paywall-badge is-soft">Рекомендуем</span>' : '') +
                  (isHit ? '<span class="paywall-badge">Хит продаж</span>' : '') +
                '</div>' +
                '<div class="paywall-tariff-price">' +
                  '<span class="paywall-price-now">' + t.price + ' руб</span>' +
                  '<span class="paywall-price-old">' + t.old_price + ' руб</span>' +
                '</div>' +
                '<div class="paywall-tariff-period">Период: ' + t.period + '</div>' +
                (t.renewal ? '<div class="paywall-tariff-renewal">' + t.renewal + '</div>' : '') +
                (tariffNotes[t.name] ? '<div class="paywall-tariff-note">' + tariffNotes[t.name] + '</div>' : '') +
                '<button type="button" class="paywall-tariff-btn" data-tariff="' + encodeURIComponent(t.name) + '">Выбрать тариф</button>' +
              '</div>'
            );
          }).join('') +
        '</div>' +
      '</section>';

    body +=
      '<section class="paywall-section">' +
        '<h3 class="paywall-h">Что входит в доступ</h3>' +
        '<p class="paywall-sub">Внутри программы и инструменты, которые помогут начать по вашему маршруту.</p>' +
        '<div class="paywall-includes">' +
          includes.map((item, index) => (
            '<article class="paywall-include">' +
              '<span class="paywall-include-icon" aria-hidden="true">' + includeSvgs[index] + '</span>' +
              '<div>' +
                '<h4 class="paywall-include-title">' + item.title + '</h4>' +
                '<p class="paywall-include-text">' + item.text + '</p>' +
              '</div>' +
            '</article>'
          )).join('') +
        '</div>' +
      '</section>';

    body +=
      '<section class="paywall-section">' +
        '<h3 class="paywall-h">Программы, которые подойдут вам</h3>' +
        '<p class="paywall-sub">Мы выбрали их по вашей цели, зонам и формату тренировок.</p>' +
        '<div class="result-programs-carousel">' +
          '<div class="result-programs-list">' +
          result.programs.map((program) => (
            '<article class="result-program" draggable="false">' +
              '<div class="result-program-image-wrap" aria-hidden="true">' +
                '<img class="result-program-image" src="' + program.localImage + '" alt="' + program.title + '" loading="lazy" decoding="async" draggable="false" data-program-id="' + program.id + '" data-fallback="0" data-remote="' + program.imageUrl + '" />' +
                '<span class="result-program-fallback is-hidden" data-program-fallback="' + program.id + '">' +
                  '<span class="result-program-fallback-icon">' + renderProgramIconSvg(program.title) + '</span>' +
                  '<span class="result-program-fallback-title">' + program.title + '</span>' +
                '</span>' +
              '</div>' +
              '<div class="result-program-copy">' +
                '<div class="result-program-badges">' +
                  '<span class="result-program-badge is-type">' + program.type + '</span>' +
                '</div>' +
                '<h4 class="result-program-title">' + program.title + '</h4>' +
                '<p class="result-program-reason">' + program.description + '</p>' +
              '</div>' +
            '</article>'
          )).join('') +
          '</div>' +
          '<button type="button" class="result-programs-arrow is-left" id="resultProgramsArrowPrevBtn" aria-label="Прокрутить программы влево">' +
            '<span class="result-programs-arrow-icon" aria-hidden="true"></span>' +
          '</button>' +
          '<button type="button" class="result-programs-arrow" id="resultProgramsArrowBtn" aria-label="Прокрутить программы вправо">' +
            '<span class="result-programs-arrow-icon" aria-hidden="true"></span>' +
          '</button>' +
        '</div>' +
      '</section>';

    body +=
      '<section class="paywall-section" id="paywallForm">' +
        '<h3 class="paywall-h">Оформление доступа</h3>' +
        '<p class="paywall-sub">Заполните форму ниже, чтобы перейти к оплате.</p>' +
        '<div class="paywall-embed">' +
          '<span class="paywall-embed-icon" aria-hidden="true">' + embedSvg + '</span>' +
          '<span>Здесь будет форма оформления заказа</span>' +
        '</div>' +
      '</section>';

    body +=
      '<section class="paywall-section">' +
        '<h3 class="paywall-h">Оплата и доступ безопасны</h3>' +
        '<div class="paywall-safety">' +
          safety.map((item, index) => (
            '<div class="paywall-safe">' +
              '<span class="paywall-safe-icon" aria-hidden="true">' + safetySvgs[index] + '</span>' +
              '<h4 class="paywall-safe-title">' + item.title + '</h4>' +
              '<p class="paywall-safe-text">' + item.text + '</p>' +
            '</div>'
          )).join('') +
        '</div>' +
      '</section>';

    body +=
      '<section class="paywall-section">' +
        '<h3 class="paywall-h">Частые вопросы</h3>' +
        '<div class="paywall-faq">' +
          faq.map((item) => (
            '<details class="paywall-faq-item">' +
              '<summary>' + item.q + '</summary>' +
              '<div class="paywall-faq-answer">' + item.a + '</div>' +
            '</details>'
          )).join('') +
        '</div>' +
      '</section>';

    body +=
      '<footer class="paywall-footer">' +
        '<div class="paywall-requisites">' +
          '<strong>ООО «Онлайн Фитнес»</strong>' +
          '<span>ИНН 7734434533 · КПП 773401001 · ОГРН 1207700175209</span>' +
          '<span>Москва, улица Щукинская, дом 2</span>' +
          '<span>Служба заботы: help@usmanovasport.ru</span>' +
        '</div>' +
        legalLinksHtml() +
      '</footer>';

    body += '</div>';
  }

  const errors = state.errors.map((e) => '<div class="err">' + e + '</div>').join('');

  const isStart = s.id === 'age';
  const offerHtml = (s.type === 'single_choice' && s.offer) ? '<p class="offer">' + s.offer + '</p>' : '';
  const brandHtml = isStart
    ? '<div class="brand"><img class="brand-photo" src="/assets/quiz/hero/hero.webp" alt="Екатерина Усманова" loading="eager" decoding="async" fetchpriority="high" /></div>'
    : '';
  const consentHtml = isStart
    ? '<div class="consent"><span>Продолжая, вы соглашаетесь с обработкой персональных данных.</span>' + legalLinksHtml() + '</div>'
    : '';

  const nextLabel = s.type === 'lead_gate'
    ? 'Открыть результат'
    : s.type === 'personal_result'
      ? 'Открыть доступ к программам'
      : (s.button || 'Продолжить');

  const stickyKinds = ['multi_choice', 'number_input', 'lead_gate', 'personal_result'];
  const useSticky = stickyKinds.includes(s.type);
  const isTransitionScreen = s.type === 'trust' || s.type === 'sales_transition';
  const isResearchTransition = s.type === 'trust' && hasResearchSlides;
  const isPlanLoader = s.type === 'loader' && Array.isArray(s.steps) && s.steps.length > 0;
  const sectionClass = isTransitionScreen
    ? ('card transition-screen' + (isResearchTransition ? ' is-research' : ''))
    : s.type === 'lead_gate'
      ? 'card lead-gate-screen'
      : s.type === 'personal_result'
        ? 'card result-page'
      : 'card';

  const titleAndSubtitleHtml =
    (title && s.type !== 'personal_result') || (subtitle && !hasResearchSlides)
      ? (isPlanLoader ? '<div class="loader-copy is-centered">' : '') +
        (title && s.type !== 'personal_result' ? '<h1 class="title' + (isPlanLoader ? ' is-centered' : '') + '">' + title + '</h1>' : '') +
        (subtitle && !hasResearchSlides ? '<p class="subtitle' + (isPlanLoader ? ' is-centered' : '') + '">' + subtitle + '</p>' : '') +
        (isPlanLoader ? '</div>' : '')
      : '';

  const actions = s.type === 'paywall'
    ? '<div class="grid"><button class="btn secondary" id="backBtn">Назад</button></div>'
    : s.type === 'single_choice'
      ? ''
      : (s.type === 'loader' && Array.isArray(s.steps) && s.steps.length > 0)
        ? ''
      : useSticky
        ? stickyButtonHtml(nextLabel)
        : '<div class="grid"><button class="btn" id="nextBtn">' + nextLabel + '</button></div>';

  const techNavHtml =
    '<aside class="tech-nav" aria-label="Техническая навигация по экранам">' +
      '<div class="tech-nav-head">' +
        '<span class="tech-nav-title">Техническая навигация</span>' +
        '<span class="tech-nav-meta">' + (state.index + 1) + ' / ' + map.screens.length + '</span>' +
      '</div>' +
      '<div class="tech-nav-list">' +
        map.screens.map((screenItem, screenIndex) => (
          '<button class="tech-nav-chip ' + (screenIndex === state.index ? 'is-active' : '') + '" type="button" data-screen-index="' + screenIndex + '">' +
            '<span class="tech-nav-chip-order">' + String(screenIndex + 1).padStart(2, '0') + '</span>' +
            '<span class="tech-nav-chip-label">' + screenItem.id + '</span>' +
          '</button>'
        )).join('') +
      '</div>' +
    '</aside>';

  appEl.innerHTML =
    '<section class="' + sectionClass + '">' +
      headerHtml() +
      offerHtml +
      brandHtml +
      trustMediaHtml +
      titleAndSubtitleHtml +
      body +
      errors +
      consentHtml +
      actions +
    '</section>' +
    techNavHtml;

  document.querySelectorAll('[data-screen-index]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const nextIndex = Number(chip.getAttribute('data-screen-index'));
      if (Number.isNaN(nextIndex)) return;
      state.index = Math.max(0, Math.min(nextIndex, map.screens.length - 1));
      state.errors = [];
      render();
    });
  });

  document.querySelectorAll('[data-opt]').forEach((el) => {
    el.addEventListener('click', () => optionClick(decodeURIComponent(el.getAttribute('data-opt'))));
  });

  const n = document.getElementById('numInput');
  if (n) n.addEventListener('input', (ev) => inputValue(ev.target.value));

  const leadName = document.getElementById('leadName');
  if (leadName) leadName.addEventListener('input', (ev) => inputLead('name', ev.target.value));
  if (leadName) leadName.addEventListener('change', (ev) => inputLead('name', ev.target.value));

  const leadEmail = document.getElementById('leadEmail');
  if (leadEmail) leadEmail.addEventListener('input', (ev) => inputLead('email', ev.target.value));
  if (leadEmail) leadEmail.addEventListener('change', (ev) => inputLead('email', ev.target.value));

  const leadConsent = document.getElementById('leadConsent');
  if (leadConsent) leadConsent.addEventListener('change', (ev) => toggleLeadConsent(ev.target.checked));

  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (s.type === 'personal_result') goPaywall();
      else next();
    });
  }

  const backBtn = document.getElementById('backBtn');
  if (backBtn) backBtn.addEventListener('click', back);

  const backIconBtn = document.getElementById('backIconBtn');
  if (backIconBtn) backIconBtn.addEventListener('click', back);

  const researchPrevBtn = document.getElementById('researchPrevBtn');
  if (researchPrevBtn && researchSlides.length > 0) {
    researchPrevBtn.addEventListener('click', () => {
      const current = typeof state.researchSlideById[s.id] === 'number' ? state.researchSlideById[s.id] : 0;
      state.researchSlideById[s.id] = Math.max(0, current - 1);
      render();
    });
  }

  const researchNextBtn = document.getElementById('researchNextBtn');
  if (researchNextBtn && researchSlides.length > 0) {
    researchNextBtn.addEventListener('click', () => {
      const current = typeof state.researchSlideById[s.id] === 'number' ? state.researchSlideById[s.id] : 0;
      state.researchSlideById[s.id] = Math.min(researchSlides.length - 1, current + 1);
      render();
    });
  }

  document.querySelectorAll('[data-research-index]').forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.getAttribute('data-research-index'));
      if (Number.isNaN(index)) return;
      state.researchSlideById[s.id] = Math.max(0, Math.min(index, researchSlides.length - 1));
      render();
    });
  });

  document.querySelectorAll('.result-journey-image[data-result-image]').forEach((image) => {
    image.addEventListener('error', () => {
      image.style.display = 'none';
      const key = image.getAttribute('data-result-image');
      if (!key) return;

      const fallback = document.querySelector('[data-result-placeholder="' + key + '"]');
      if (fallback) fallback.classList.remove('is-hidden');
    });
  });

  document.querySelectorAll('.result-program-image[data-program-id]').forEach((image) => {
    image.addEventListener('error', () => {
      const fallbackState = image.getAttribute('data-fallback');
      if (fallbackState !== '1') {
        image.setAttribute('data-fallback', '1');
        const remoteSrc = image.getAttribute('data-remote') || '';
        if (remoteSrc) {
          image.setAttribute('src', remoteSrc);
          return;
        }
      }

      image.style.display = 'none';
      const id = image.getAttribute('data-program-id');
      if (!id) return;

      const fallback = document.querySelector('[data-program-fallback="' + id + '"]');
      if (fallback) fallback.classList.remove('is-hidden');
    });
  });

  const programsList = document.querySelector('.result-programs-list');
  const programsArrow = document.getElementById('resultProgramsArrowBtn');
  const programsArrowPrev = document.getElementById('resultProgramsArrowPrevBtn');
  if (programsList) {
    const syncArrows = () => {
      if (!programsArrowPrev) return;
      if (programsList.scrollLeft > 8) programsArrowPrev.classList.add('is-visible');
      else programsArrowPrev.classList.remove('is-visible');
    };

    let dragPointerId = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartScrollLeft = 0;
    let dragActive = false;
    let dragNextScrollLeft = 0;
    let dragRafId = null;

    const getSnapStep = () => {
      const firstCard = programsList.querySelector('.result-program');
      if (!firstCard) return 0;
      const styles = getComputedStyle(programsList);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
      return firstCard.offsetWidth + (Number.isFinite(gap) ? gap : 0);
    };

    const scrollByStep = (direction) => {
      const step = getSnapStep();
      if (step > 0) {
        const currentIndex = Math.round(programsList.scrollLeft / step);
        const targetIndex = Math.max(0, currentIndex + direction);
        programsList.scrollTo({ left: targetIndex * step, behavior: 'smooth' });
        setTimeout(syncArrows, 280);
        return;
      }

      const shift = Math.max(220, Math.round(programsList.clientWidth * 0.82));
      programsList.scrollBy({ left: shift * direction, behavior: 'smooth' });
      setTimeout(syncArrows, 260);
    };

    if (programsArrow) {
      programsArrow.addEventListener('click', () => scrollByStep(1));
    }
    if (programsArrowPrev) {
      programsArrowPrev.addEventListener('click', () => scrollByStep(-1));
    }

    programsList.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });

    programsList.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragPointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartScrollLeft = programsList.scrollLeft;
      dragActive = false;
      if (dragRafId !== null) {
        cancelAnimationFrame(dragRafId);
        dragRafId = null;
      }
    });

    const stopDrag = (event) => {
      if (dragPointerId !== event.pointerId) return;

      if (dragRafId !== null) {
        cancelAnimationFrame(dragRafId);
        dragRafId = null;
      }

      if (dragActive && programsList.hasPointerCapture(event.pointerId)) {
        programsList.releasePointerCapture(event.pointerId);
      }

      programsList.classList.remove('is-dragging');
      dragPointerId = null;
      dragActive = false;

      syncArrows();
    };

    programsList.addEventListener('pointermove', (event) => {
      if (dragPointerId !== event.pointerId) return;

      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;

      if (!dragActive) {
        const passedThreshold = Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6;
        if (!passedThreshold) return;

        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
          dragPointerId = null;
          return;
        }

        dragActive = true;
        programsList.setPointerCapture(event.pointerId);
        programsList.classList.add('is-dragging');
      }

      event.preventDefault();
      dragNextScrollLeft = dragStartScrollLeft - deltaX;

      if (dragRafId !== null) return;
      dragRafId = requestAnimationFrame(() => {
        dragRafId = null;
        programsList.scrollLeft = dragNextScrollLeft;
        syncArrows();
      });
    });

    programsList.addEventListener('pointerup', stopDrag);
    programsList.addEventListener('pointercancel', stopDrag);
    programsList.addEventListener('scroll', syncArrows, { passive: true });
    syncArrows();
  }

  document.querySelectorAll('.paywall-gallery-item img[data-gallery]').forEach((img) => {
    img.addEventListener('error', () => {
      const item = img.closest('.paywall-gallery-item');
      if (item) item.style.display = 'none';
    });
  });

  const paywallGalleryList = document.getElementById('paywallGalleryList');
  const paywallGalleryArrowNext = document.getElementById('paywallGalleryArrowNext');
  const paywallGalleryArrowPrev = document.getElementById('paywallGalleryArrowPrev');
  if (paywallGalleryList) {
    const syncPaywallGalleryArrows = () => {
      if (!paywallGalleryArrowPrev) return;
      if (paywallGalleryList.scrollLeft > 8) paywallGalleryArrowPrev.classList.add('is-visible');
      else paywallGalleryArrowPrev.classList.remove('is-visible');
    };

    const getPaywallGallerySnapStep = () => {
      const firstCard = paywallGalleryList.querySelector('.paywall-gallery-item');
      if (!firstCard) return 0;
      const styles = getComputedStyle(paywallGalleryList);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
      return firstCard.offsetWidth + (Number.isFinite(gap) ? gap : 0);
    };

    const scrollPaywallGallery = (direction) => {
      const step = getPaywallGallerySnapStep();
      if (step > 0) {
        const currentIndex = Math.round(paywallGalleryList.scrollLeft / step);
        const targetIndex = Math.max(0, currentIndex + direction);
        paywallGalleryList.scrollTo({ left: targetIndex * step, behavior: 'auto' });
        setTimeout(syncPaywallGalleryArrows, 260);
        return;
      }

      const shift = Math.max(220, Math.round(paywallGalleryList.clientWidth * 0.82));
      paywallGalleryList.scrollBy({ left: shift * direction, behavior: 'smooth' });
      setTimeout(syncPaywallGalleryArrows, 240);
    };

    let galleryDragPointerId = null;
    let galleryDragStartX = 0;
    let galleryDragStartY = 0;
    let galleryDragStartScrollLeft = 0;
    let galleryDragActive = false;
    let galleryDragNextScrollLeft = 0;
    let galleryDragRafId = null;

    if (paywallGalleryArrowNext) {
      paywallGalleryArrowNext.addEventListener('click', () => scrollPaywallGallery(1));
    }

    if (paywallGalleryArrowPrev) {
      paywallGalleryArrowPrev.addEventListener('click', () => scrollPaywallGallery(-1));
    }

    paywallGalleryList.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });

    paywallGalleryList.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      galleryDragPointerId = event.pointerId;
      galleryDragStartX = event.clientX;
      galleryDragStartY = event.clientY;
      galleryDragStartScrollLeft = paywallGalleryList.scrollLeft;
      galleryDragActive = false;

      if (galleryDragRafId !== null) {
        cancelAnimationFrame(galleryDragRafId);
        galleryDragRafId = null;
      }
    });

    const stopGalleryDrag = (event) => {
      if (galleryDragPointerId !== event.pointerId) return;

      if (galleryDragRafId !== null) {
        cancelAnimationFrame(galleryDragRafId);
        galleryDragRafId = null;
      }

      if (galleryDragActive && paywallGalleryList.hasPointerCapture(event.pointerId)) {
        paywallGalleryList.releasePointerCapture(event.pointerId);
      }

      paywallGalleryList.classList.remove('is-dragging');
      galleryDragPointerId = null;
      galleryDragActive = false;
      syncPaywallGalleryArrows();
    };

    paywallGalleryList.addEventListener('pointermove', (event) => {
      if (galleryDragPointerId !== event.pointerId) return;

      const deltaX = event.clientX - galleryDragStartX;
      const deltaY = event.clientY - galleryDragStartY;

      if (!galleryDragActive) {
        const passedThreshold = Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6;
        if (!passedThreshold) return;

        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
          galleryDragPointerId = null;
          return;
        }

        galleryDragActive = true;
        paywallGalleryList.setPointerCapture(event.pointerId);
        paywallGalleryList.classList.add('is-dragging');
      }

      event.preventDefault();
      galleryDragNextScrollLeft = galleryDragStartScrollLeft - deltaX;

      if (galleryDragRafId !== null) return;
      galleryDragRafId = requestAnimationFrame(() => {
        galleryDragRafId = null;
        paywallGalleryList.scrollLeft = galleryDragNextScrollLeft;
        syncPaywallGalleryArrows();
      });
    });

    paywallGalleryList.addEventListener('pointerup', stopGalleryDrag);
    paywallGalleryList.addEventListener('pointercancel', stopGalleryDrag);

    paywallGalleryList.addEventListener('scroll', syncPaywallGalleryArrows, { passive: true });
    syncPaywallGalleryArrows();
  }

  const paywallTopCta = document.getElementById('paywallTopCta');
  if (paywallTopCta) {
    paywallTopCta.addEventListener('click', () => {
      const target = document.getElementById('paywallTariffs');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  document.querySelectorAll('.paywall-tariff-btn[data-tariff]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.selectedTariff = decodeURIComponent(btn.getAttribute('data-tariff'));
      document.querySelectorAll('.paywall-tariff').forEach((card) => card.classList.remove('is-selected'));
      const card = btn.closest('.paywall-tariff');
      if (card) card.classList.add('is-selected');
      const form = document.getElementById('paywallForm');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

render();
startCssHotReload();
startMapHotReload();
</script>
</body>
</html>`
}

const server = http.createServer((req, res) => {
  if (req.url === '/__preview_map_version' || req.url === '/__preview_map_version/' || (req.url && req.url.startsWith('/__preview_map_version?'))) {
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    })
    res.end(JSON.stringify({ version: mapVersion() }))
    return
  }

  if (req.url === '/__preview_css_version' || req.url === '/__preview_css_version/' || (req.url && req.url.startsWith('/__preview_css_version?'))) {
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    })
    res.end(JSON.stringify({ version: previewCssVersion() }))
    return
  }

  if (req.url && req.url.startsWith('/assets/')) {
    const pathname = decodeURIComponent(req.url.split('?')[0])
    const filePath = path.join(root, pathname.slice(1))
    const normalized = path.normalize(filePath)

    if (!normalized.startsWith(path.join(root, 'assets'))) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('Forbidden')
      return
    }

    if (!fs.existsSync(normalized) || !fs.statSync(normalized).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('Not found')
      return
    }

    const ext = path.extname(normalized).toLowerCase()
    const contentType = ext === '.svg'
      ? 'image/svg+xml; charset=utf-8'
      : ext === '.css'
        ? 'text/css; charset=utf-8'
      : ext === '.png'
        ? 'image/png'
        : ext === '.webp'
          ? 'image/webp'
          : ext === '.mp4'
            ? 'video/mp4'
          : ext === '.jpg' || ext === '.jpeg'
            ? 'image/jpeg'
            : 'application/octet-stream'

    res.writeHead(200, { 'content-type': contentType })
    res.end(fs.readFileSync(normalized))
    return
  }

  if (!req.url || req.url === '/' || req.url.startsWith('/?')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(htmlPage())
    return
  }

  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
  res.end('Not found')
})

server.listen(port, () => {
  console.log(`Live preview started: http://localhost:${port}`)
})
