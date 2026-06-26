"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderScreen = renderScreen;
exports.renderQuestionScreen = renderQuestionScreen;
exports.renderTrustScreen = renderTrustScreen;
exports.renderLoaderScreen = renderLoaderScreen;
exports.renderLeadGateScreen = renderLeadGateScreen;
exports.renderResultScreen = renderResultScreen;
exports.renderPaywallScreen = renderPaywallScreen;
const quizEngine_1 = require("./quizEngine");
const resultLogic_1 = require("./resultLogic");
function getScreenValue(state, screenId) {
    return state.answersByScreen[screenId];
}
function getErrorNodes(screenId, issues) {
    return issues
        .filter((issue) => issue.screenId === screenId)
        .map((issue) => ({
        type: 'text',
        role: 'error',
        text: issue.message,
    }));
}
function renderQuestionScreen(screen, state, issues) {
    const currentValue = getScreenValue(state, screen.id);
    const nodes = [];
    if (screen.title) {
        nodes.push({ type: 'text', role: 'title', text: screen.title });
    }
    if (screen.subtitle) {
        nodes.push({ type: 'text', role: 'subtitle', text: screen.subtitle });
    }
    if (screen.kind === 'single') {
        const selected = typeof currentValue === 'string' ? currentValue : undefined;
        nodes.push({
            type: 'options',
            selection: 'single',
            options: screen.options.map((option) => ({
                label: option,
                selected: selected === option,
                action: {
                    id: `select_${screen.id}_${option}`,
                    type: 'selectOption',
                    payload: { screenId: screen.id, option },
                },
            })),
        });
    }
    if (screen.kind === 'multiple') {
        const selected = Array.isArray(currentValue) ? currentValue : [];
        nodes.push({
            type: 'options',
            selection: 'multiple',
            options: screen.options.map((option) => ({
                label: option,
                selected: selected.includes(option),
                action: {
                    id: `toggle_${screen.id}_${option}`,
                    type: 'toggleOption',
                    payload: { screenId: screen.id, option },
                },
            })),
        });
    }
    if (screen.kind === 'input') {
        const value = typeof currentValue === 'number' ? String(currentValue) : '';
        nodes.push({
            type: 'input',
            inputType: screen.inputType,
            value,
            unit: screen.unit,
            action: {
                id: `input_${screen.id}`,
                type: 'input',
                payload: { screenId: screen.id },
            },
        });
    }
    nodes.push(...getErrorNodes(screen.id, issues));
    nodes.push({
        type: 'button',
        label: 'Продолжить',
        action: { id: `next_${screen.id}`, type: 'next' },
    });
    if (state.currentScreenIndex > 0) {
        nodes.push({
            type: 'button',
            label: 'Назад',
            action: { id: `back_${screen.id}`, type: 'back' },
        });
    }
    return {
        screenId: screen.id,
        screenOrder: screen.order,
        progressPercent: 0,
        nodes,
    };
}
function renderTrustScreen(screen, state) {
    const nodes = [];
    if (screen.title) {
        nodes.push({ type: 'text', role: 'title', text: screen.title });
    }
    if ((screen.kind === 'trust' || screen.kind === 'salesTransition') && screen.text) {
        nodes.push({ type: 'text', role: 'body', text: screen.text });
    }
    if (screen.kind === 'salesTransition' && screen.benefits.length > 0) {
        nodes.push({ type: 'list', title: 'Что внутри', items: screen.benefits });
    }
    const buttonLabel = screen.kind === 'trust'
        ? (screen.buttonText ?? 'Продолжить')
        : screen.kind === 'salesTransition'
            ? (screen.buttonText ?? 'Продолжить')
            : 'Продолжить';
    nodes.push({
        type: 'button',
        label: buttonLabel,
        action: { id: `next_${screen.id}`, type: 'next' },
    });
    if (state.currentScreenIndex > 0) {
        nodes.push({
            type: 'button',
            label: 'Назад',
            action: { id: `back_${screen.id}`, type: 'back' },
        });
    }
    return {
        screenId: screen.id,
        screenOrder: screen.order,
        progressPercent: 0,
        nodes,
    };
}
function renderLoaderScreen(screen, state) {
    const nodes = [];
    if (screen.title) {
        nodes.push({ type: 'text', role: 'title', text: screen.title });
    }
    if (screen.text) {
        nodes.push({ type: 'text', role: 'body', text: screen.text });
    }
    if (screen.steps.length > 0) {
        nodes.push({ type: 'list', items: screen.steps });
    }
    if (screen.progressType === 'percent') {
        nodes.push({ type: 'progress', percent: 100 });
    }
    nodes.push({
        type: 'button',
        label: screen.buttonText ?? 'Продолжить',
        action: { id: `next_${screen.id}`, type: 'next' },
    });
    if (state.currentScreenIndex > 0) {
        nodes.push({
            type: 'button',
            label: 'Назад',
            action: { id: `back_${screen.id}`, type: 'back' },
        });
    }
    return {
        screenId: screen.id,
        screenOrder: screen.order,
        progressPercent: 0,
        nodes,
    };
}
function renderLeadGateScreen(config, screen, state, issues) {
    const lead = getScreenValue(state, screen.id);
    const leadValue = typeof lead === 'object' && lead !== null && 'name' in lead && 'email' in lead && 'consentAccepted' in lead
        ? lead
        : { name: '', email: '', consentAccepted: false };
    const nodes = [];
    if (screen.title) {
        nodes.push({ type: 'text', role: 'title', text: screen.title });
    }
    if (screen.text) {
        nodes.push({ type: 'text', role: 'body', text: screen.text });
    }
    nodes.push({
        type: 'input',
        inputType: 'text',
        value: leadValue.name,
        action: {
            id: `input_${screen.id}_name`,
            type: 'input',
            payload: { screenId: screen.id, field: 'name' },
        },
    });
    nodes.push({
        type: 'input',
        inputType: 'email',
        value: leadValue.email,
        action: {
            id: `input_${screen.id}_email`,
            type: 'input',
            payload: { screenId: screen.id, field: 'email' },
        },
    });
    nodes.push({
        type: 'checkbox',
        label: 'Я согласна на обработку персональных данных',
        checked: leadValue.consentAccepted,
        action: {
            id: `consent_${screen.id}`,
            type: 'toggleConsent',
            payload: { screenId: screen.id },
        },
    });
    nodes.push({
        type: 'list',
        title: 'Юридические документы',
        items: [
            config.legalLinks.offer,
            config.legalLinks.privacy,
            config.legalLinks.personal_data,
        ],
    });
    nodes.push(...getErrorNodes(screen.id, issues));
    nodes.push({
        type: 'button',
        label: 'Открыть результат',
        action: { id: `next_${screen.id}`, type: 'next' },
    });
    if (state.currentScreenIndex > 0) {
        nodes.push({
            type: 'button',
            label: 'Назад',
            action: { id: `back_${screen.id}`, type: 'back' },
        });
    }
    return {
        screenId: screen.id,
        screenOrder: screen.order,
        progressPercent: 0,
        nodes,
    };
}
function renderResultScreen(screen, state) {
    const lead = state.answersByScreen.lead_gate;
    const leadValue = typeof lead === 'object' && lead !== null && 'name' in lead && 'email' in lead && 'consentAccepted' in lead
        ? lead
        : { name: '', email: '', consentAccepted: false };
    const currentWeight = Number(state.answersByScreen.current_weight ?? 70);
    const targetWeight = Number(state.answersByScreen.target_weight ?? currentWeight);
    const height = Number(state.answersByScreen.height ?? 165);
    const result = (0, resultLogic_1.buildPersonalResult)({
        ageBucket: typeof state.answersByScreen.age === 'string' ? state.answersByScreen.age : undefined,
        activity: typeof state.answersByScreen.activity === 'string' ? state.answersByScreen.activity : undefined,
        currentWeight,
        targetWeight,
        height,
        goalBody: typeof state.answersByScreen.goal_body === 'string' ? state.answersByScreen.goal_body : undefined,
        resultFocus: typeof state.answersByScreen.result_focus === 'string' ? state.answersByScreen.result_focus : undefined,
        zones: Array.isArray(state.answersByScreen.zones) ? state.answersByScreen.zones : undefined,
        trainingPlace: typeof state.answersByScreen.training_place === 'string' ? state.answersByScreen.training_place : undefined,
    });
    const titleTemplate = screen.titleTemplate ?? '{Имя}, вот ваш план: с {вес} до {целевой вес}';
    const title = titleTemplate
        .replace('{Имя}', leadValue.name || 'Ваш план')
        .replace('{вес}', String(currentWeight))
        .replace('{целевой вес}', String(targetWeight));
    const nodes = [
        { type: 'text', role: 'title', text: title },
        {
            type: 'list',
            title: 'Ваши показатели',
            items: [
                `ИМТ: ${result.bmi} (${result.bmiLabel})`,
                `Норма калорий: ${result.calorieNorm}`,
                `Белки: ${result.macros.proteinGrams} г`,
                `Жиры: ${result.macros.fatGrams} г`,
                `Углеводы: ${result.macros.carbsGrams} г`,
            ],
        },
        {
            type: 'list',
            title: 'Подборка программ',
            items: result.recommendedPrograms,
        },
        {
            type: 'button',
            label: 'Перейти к подписке',
            action: { id: `paywall_${screen.id}`, type: 'openPaywall' },
        },
    ];
    if (state.currentScreenIndex > 0) {
        nodes.push({
            type: 'button',
            label: 'Назад',
            action: { id: `back_${screen.id}`, type: 'back' },
        });
    }
    return {
        screenId: screen.id,
        screenOrder: screen.order,
        progressPercent: 0,
        nodes,
    };
}
function renderPaywallScreen(config, screen, state) {
    const nodes = [];
    if (screen.topFocus) {
        nodes.push({ type: 'text', role: 'title', text: screen.topFocus });
    }
    nodes.push({
        type: 'list',
        title: 'Обязательные блоки',
        items: screen.requiredBlocks,
    });
    nodes.push({
        type: 'tariffs',
        items: config.tariffs,
    });
    nodes.push({
        type: 'text',
        role: 'body',
        text: 'Подписка с автопродлением, отключить можно в личном кабинете',
    });
    nodes.push({
        type: 'embedPlaceholder',
        text: 'TODO: здесь будет форма оформления заказа ГетКурса',
    });
    nodes.push({
        type: 'list',
        title: 'Юридические ссылки',
        items: [
            config.legalLinks.offer,
            config.legalLinks.privacy,
            config.legalLinks.personal_data,
        ],
    });
    if (state.currentScreenIndex > 0) {
        nodes.push({
            type: 'button',
            label: 'Назад',
            action: { id: `back_${screen.id}`, type: 'back' },
        });
    }
    return {
        screenId: screen.id,
        screenOrder: screen.order,
        progressPercent: 100,
        nodes,
    };
}
function renderScreen(config, state, issues = []) {
    const screen = config.screens[state.currentScreenIndex];
    const progressPercent = (0, quizEngine_1.calculateProgressPercent)(config, state);
    let model;
    if (screen.kind === 'single' || screen.kind === 'multiple' || screen.kind === 'input') {
        model = renderQuestionScreen(screen, state, issues);
    }
    else if (screen.kind === 'trust' || screen.kind === 'salesTransition') {
        model = renderTrustScreen(screen, state);
    }
    else if (screen.kind === 'loader') {
        model = renderLoaderScreen(screen, state);
    }
    else if (screen.kind === 'leadGate') {
        model = renderLeadGateScreen(config, screen, state, issues);
    }
    else if (screen.kind === 'result') {
        model = renderResultScreen(screen, state);
    }
    else {
        model = renderPaywallScreen(config, screen, state);
    }
    return {
        ...model,
        progressPercent,
    };
}
