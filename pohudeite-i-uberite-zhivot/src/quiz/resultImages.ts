// @shared

export type ResultImagesInput = {
  currentBodyType?: string
  goalBody?: string
  resultFocus?: string
  bmi?: number
}

export type ResultImages = {
  currentImage: string
  targetImage: string
}

// Keep the same visual scale as in the original GymTeamQuiz project.
const IMG_CURRENT_01_SOFT = 'https://fs.chatium.ru/get/image_msk_ccLgx6PWJQ.242x652.png'
const IMG_CURRENT_02_SOFT = 'https://fs.chatium.ru/get/image_msk_RVH1VqMnXR.242x652.png'
const IMG_CURRENT_03_FULLER = 'https://fs.chatium.ru/get/image_msk_AF5NXsf764.242x652.png'

const IMG_TARGET_01_SLIM_LIGHT = 'https://fs.chatium.ru/get/image_msk_WClb1mTPaR.242x652.png'
const IMG_TARGET_02_TONED_FIT = 'https://fs.chatium.ru/get/image_msk_vas736AHFJ.242x652.png'

const currentImageByBodyType: Record<string, string> = {
  'Стройная, хочу тонус': IMG_CURRENT_01_SOFT,
  'Чуть поправилась': IMG_CURRENT_02_SOFT,
  'Есть заметный лишний вес': IMG_CURRENT_03_FULLER,
  'Набрала больше, чем хотелось бы': IMG_CURRENT_03_FULLER,
}

const targetImageByGoalBody: Record<string, string> = {
  'Стройное и лёгкое': IMG_TARGET_01_SLIM_LIGHT,
  'Подтянутое, с тонусом': IMG_TARGET_02_TONED_FIT,
  'С формами, но без лишнего': IMG_TARGET_01_SLIM_LIGHT,
  'Просто здоровое и без боли в спине': IMG_TARGET_01_SLIM_LIGHT,
}

function getCurrentImageByBmi(bmi?: number): string {
  if (!bmi || Number.isNaN(bmi)) {
    return IMG_CURRENT_02_SOFT
  }

  if (bmi < 25) {
    return IMG_CURRENT_01_SOFT
  }

  if (bmi < 30) {
    return IMG_CURRENT_02_SOFT
  }

  return IMG_CURRENT_03_FULLER
}

function getTargetImage(goalBody?: string, resultFocus?: string): string {
  if (goalBody && targetImageByGoalBody[goalBody]) {
    return targetImageByGoalBody[goalBody]
  }

  if (resultFocus?.toLowerCase().includes('тонус')) {
    return IMG_TARGET_02_TONED_FIT
  }

  return IMG_TARGET_01_SLIM_LIGHT
}

export function getResultImages(input: ResultImagesInput): ResultImages {
  // ИМТ - объективный показатель (рост/вес), поэтому он главный источник
  // фигуры. Субъективный ответ body_now используем только если ИМТ нет,
  // иначе можно показать неадекватную фигуру (например «полную» при норме).
  const hasBmi = typeof input.bmi === 'number' && !Number.isNaN(input.bmi) && input.bmi > 0
  const mappedByBodyType = input.currentBodyType ? currentImageByBodyType[input.currentBodyType] : undefined
  const currentImage = hasBmi ? getCurrentImageByBmi(input.bmi) : mappedByBodyType ?? getCurrentImageByBmi(input.bmi)

  const targetImage = getTargetImage(input.goalBody, input.resultFocus)

  return { currentImage, targetImage }
}
