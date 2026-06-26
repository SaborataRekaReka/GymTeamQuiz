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

const currentImageByBodyType: Record<string, string> = {
  'Стройная, хочу тонус': '/assets/quiz/before/current_01_slim_soft.png.png',
  'Чуть поправилась': '/assets/quiz/before/current_02_soft.png.png',
  'Есть заметный лишний вес': '/assets/quiz/before/current_03_fuller.png.png',
  'Набрала больше, чем хотелось бы': '/assets/quiz/before/current_03_fuller.png.png',
}

const targetImageByGoalBody: Record<string, string> = {
  'Стройное и лёгкое': '/assets/quiz/before/target_01_slim_light.png.png',
  'Подтянутое, с тонусом': '/assets/quiz/before/target_02_toned_fit.png.png',
  'С формами, но без лишнего': '/assets/quiz/before/target_01_slim_light.png.png',
  'Просто здоровое и без боли в спине': '/assets/quiz/before/target_01_slim_light.png.png',
}

function getCurrentImageByBmi(bmi?: number): string {
  if (!bmi || Number.isNaN(bmi)) {
    return '/assets/quiz/before/current_02_soft.png.png'
  }

  if (bmi < 25) {
    return '/assets/quiz/before/current_01_slim_soft.png.png'
  }

  if (bmi < 30) {
    return '/assets/quiz/before/current_02_soft.png.png'
  }

  return '/assets/quiz/before/current_03_fuller.png.png'
}

function getTargetImage(goalBody?: string, resultFocus?: string): string {
  if (goalBody && targetImageByGoalBody[goalBody]) {
    return targetImageByGoalBody[goalBody]
  }

  if (resultFocus?.toLowerCase().includes('тонус')) {
    return '/assets/quiz/before/target_02_toned_fit.png.png'
  }

  return '/assets/quiz/before/target_01_slim_light.png.png'
}

export function getResultImages(input: ResultImagesInput): ResultImages {
  const currentImage =
    input.currentBodyType && currentImageByBodyType[input.currentBodyType]
      ? currentImageByBodyType[input.currentBodyType]
      : getCurrentImageByBmi(input.bmi)

  const targetImage = getTargetImage(input.goalBody, input.resultFocus)

  return {
    currentImage,
    targetImage,
  }
}