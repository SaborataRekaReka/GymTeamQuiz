"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBmi = calculateBmi;
exports.getBmiLabel = getBmiLabel;
exports.getAgeFromBucket = getAgeFromBucket;
exports.getActivityFactor = getActivityFactor;
exports.calculateBmrFemale = calculateBmrFemale;
exports.calculateMaintenanceCalories = calculateMaintenanceCalories;
exports.calculateCalorieNorm = calculateCalorieNorm;
exports.calculateMacros = calculateMacros;
exports.calculateWeightDifference = calculateWeightDifference;
exports.detectResultType = detectResultType;
exports.recommendPrograms = recommendPrograms;
exports.buildPersonalResult = buildPersonalResult;
const DEFAULT_AGE = 35;
const DEFAULT_ACTIVITY_FACTOR = 1.35;
const ACTIVITY_FACTORS = {
    'Почти весь день сижу': 1.2,
    'Хожу по делам, но спорта нет': 1.35,
    'Иногда тренируюсь, нерегулярно': 1.45,
    'Двигаюсь много': 1.6,
};
function calculateBmi(weightKg, heightCm) {
    const heightM = heightCm / 100;
    return round(weightKg / (heightM * heightM), 1);
}
function getBmiLabel(bmi) {
    if (bmi < 18.5)
        return 'ниже нормы';
    if (bmi < 25)
        return 'норма';
    if (bmi < 30)
        return 'выше нормы';
    return 'высокий вес';
}
function getAgeFromBucket(ageBucket) {
    if (!ageBucket)
        return DEFAULT_AGE;
    if (ageBucket.includes('18-29'))
        return 25;
    if (ageBucket.includes('30-39'))
        return 35;
    if (ageBucket.includes('40-49'))
        return 45;
    if (ageBucket.includes('50-59'))
        return 55;
    if (ageBucket.includes('60'))
        return 65;
    return DEFAULT_AGE;
}
function getActivityFactor(activity) {
    if (!activity)
        return DEFAULT_ACTIVITY_FACTOR;
    return ACTIVITY_FACTORS[activity] ?? DEFAULT_ACTIVITY_FACTOR;
}
function calculateBmrFemale(weightKg, heightCm, ageYears) {
    return round(10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161);
}
function calculateMaintenanceCalories(bmr, activityFactor) {
    return roundToNearest10(bmr * activityFactor);
}
function calculateCalorieNorm(maintenanceCalories, weightDifferenceKg) {
    if (weightDifferenceKg > 0) {
        return Math.max(1200, roundToNearest10(maintenanceCalories * 0.85));
    }
    return Math.max(1200, roundToNearest10(maintenanceCalories));
}
function calculateMacros(calorieNorm, targetWeight) {
    const proteinGrams = round(targetWeight * 1.6);
    const fatGrams = round(targetWeight * 0.8);
    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const carbCalories = Math.max(0, calorieNorm - proteinCalories - fatCalories);
    const carbsGrams = round(carbCalories / 4);
    return {
        proteinGrams,
        fatGrams,
        carbsGrams,
    };
}
function calculateWeightDifference(currentWeight, targetWeight) {
    return round(currentWeight - targetWeight, 1);
}
function detectResultType(input) {
    const resultFocus = input.resultFocus ?? '';
    const goalBody = input.goalBody ?? '';
    const zones = input.zones ?? [];
    if (resultFocus.includes('Минус вес') || zones.some((zone) => zone.includes('Живот и талия')))
        return 'weight_loss_belly';
    if (goalBody.includes('Подтянутое') || resultFocus.includes('тонус'))
        return 'tone';
    if (goalBody.includes('здоровое') || zones.some((zone) => zone.includes('Спина и осанка')))
        return 'health_back';
    if (resultFocus.includes('Лёгкость'))
        return 'energy';
    return 'general_shape';
}
function recommendPrograms(input) {
    const programs = new Set();
    // TODO: Chatium integration. Replace temporary categories with real subscription programs.
    programs.add('Стартовая программа');
    if (input.zones?.some((zone) => zone.includes('Живот')))
        programs.add('Живот и талия');
    if (input.zones?.some((zone) => zone.includes('Ягодицы') || zone.includes('Бёдра')))
        programs.add('Ягодицы и ноги');
    if (input.zones?.some((zone) => zone.includes('Спина')))
        programs.add('Осанка и спина');
    if (input.trainingPlace === 'Дома')
        programs.add('Домашние тренировки');
    if (input.trainingPlace === 'В зале')
        programs.add('Тренировки для зала');
    return Array.from(programs).slice(0, 5);
}
function buildPersonalResult(input) {
    const age = getAgeFromBucket(input.ageBucket);
    const activityFactor = getActivityFactor(input.activity);
    const bmr = calculateBmrFemale(input.currentWeight, input.height, age);
    const maintenanceCalories = calculateMaintenanceCalories(bmr, activityFactor);
    const weightDifferenceKg = calculateWeightDifference(input.currentWeight, input.targetWeight);
    const calorieNorm = calculateCalorieNorm(maintenanceCalories, weightDifferenceKg);
    const macros = calculateMacros(calorieNorm, input.targetWeight);
    const bmi = calculateBmi(input.currentWeight, input.height);
    return {
        bmi,
        bmiLabel: getBmiLabel(bmi),
        bmr,
        activityFactor,
        maintenanceCalories,
        calorieNorm,
        macros,
        weightDifferenceKg,
        resultType: detectResultType(input),
        recommendedPrograms: recommendPrograms(input),
    };
}
function round(value, precision = 0) {
    const k = 10 ** precision;
    return Math.round(value * k) / k;
}
function roundToNearest10(value) {
    return Math.round(value / 10) * 10;
}
