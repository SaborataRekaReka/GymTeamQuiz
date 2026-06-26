"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizScenarioController = void 0;
const leadStorage_1 = require("./leadStorage");
const quizEngine_1 = require("./quizEngine");
const resultLogic_1 = require("./resultLogic");
const screenMap_1 = require("./screenMap");
const screenRenderer_1 = require("./screenRenderer");
const uiAdapter_1 = require("./uiAdapter");
function buildInputIssue(screenId, message) {
    return { screenId, field: 'value', message };
}
function getCurrentScreen(config, state) {
    return config.screens[state.currentScreenIndex];
}
class QuizScenarioController {
    config;
    state;
    issues;
    constructor(utm = {}) {
        this.config = (0, screenMap_1.loadQuizFlowConfig)();
        this.state = (0, quizEngine_1.createInitialState)(utm);
        this.issues = [];
    }
    getState() {
        return this.state;
    }
    getIssues() {
        return this.issues;
    }
    startQuiz() {
        this.state = (0, quizEngine_1.createInitialState)(this.state.utm);
        this.issues = [];
        return this.renderCurrentScreen();
    }
    renderCurrentScreen() {
        return (0, screenRenderer_1.renderScreen)(this.config, this.state, this.issues);
    }
    renderCurrentScreenForChatium() {
        const model = this.renderCurrentScreen();
        return (0, uiAdapter_1.toChatiumAdapterPayload)(model);
    }
    handleOptionClick(option) {
        const screen = getCurrentScreen(this.config, this.state);
        if (screen.kind === 'single') {
            const result = (0, quizEngine_1.saveAnswer)(this.config, this.state, screen.id, option);
            this.applySaveResult(result);
            return result;
        }
        if (screen.kind === 'multiple') {
            const current = this.state.answersByScreen[screen.id];
            const selected = Array.isArray(current) ? [...current] : [];
            const hasOption = selected.includes(option);
            const next = hasOption ? selected.filter((item) => item !== option) : [...selected, option];
            const result = (0, quizEngine_1.saveAnswer)(this.config, this.state, screen.id, next);
            this.applySaveResult(result);
            return result;
        }
        const fail = {
            state: this.state,
            saved: false,
            issues: [buildInputIssue(screen.id, 'Этот экран не поддерживает выбор варианта.')],
        };
        this.issues = fail.issues;
        return fail;
    }
    handleNumberInput(value) {
        const screen = getCurrentScreen(this.config, this.state);
        if (screen.kind !== 'input') {
            const fail = {
                state: this.state,
                saved: false,
                issues: [buildInputIssue(screen.id, 'Текущий экран не поддерживает числовой ввод.')],
            };
            this.issues = fail.issues;
            return fail;
        }
        const result = (0, quizEngine_1.saveAnswer)(this.config, this.state, screen.id, value);
        this.applySaveResult(result);
        return result;
    }
    handleLeadGateNameInput(value) {
        return this.updateLeadGateField({ name: value });
    }
    handleLeadGateEmailInput(value) {
        return this.updateLeadGateField({ email: value });
    }
    handleConsentToggle(checked) {
        return this.updateLeadGateField({ consentAccepted: checked });
    }
    goNext() {
        const nextResult = (0, quizEngine_1.moveNext)(this.config, this.state);
        this.state = nextResult.state;
        this.issues = nextResult.issues;
        return nextResult;
    }
    goBack() {
        const backResult = (0, quizEngine_1.moveBack)(this.state);
        this.state = backResult.state;
        this.issues = [];
        return backResult;
    }
    async completeLeadGateAndPersistLead() {
        const currentScreen = getCurrentScreen(this.config, this.state);
        if (currentScreen.kind !== 'leadGate')
            return;
        const leadValue = this.state.answersByScreen[currentScreen.id];
        if (!(typeof leadValue === 'object' && leadValue !== null && 'name' in leadValue && 'email' in leadValue && 'consentAccepted' in leadValue)) {
            return;
        }
        const currentWeight = Number(this.state.answersByScreen.current_weight ?? 70);
        const targetWeight = Number(this.state.answersByScreen.target_weight ?? currentWeight);
        const height = Number(this.state.answersByScreen.height ?? 165);
        const result = (0, resultLogic_1.buildPersonalResult)({
            ageBucket: typeof this.state.answersByScreen.age === 'string' ? this.state.answersByScreen.age : undefined,
            activity: typeof this.state.answersByScreen.activity === 'string' ? this.state.answersByScreen.activity : undefined,
            currentWeight,
            targetWeight,
            height,
            goalBody: typeof this.state.answersByScreen.goal_body === 'string' ? this.state.answersByScreen.goal_body : undefined,
            resultFocus: typeof this.state.answersByScreen.result_focus === 'string' ? this.state.answersByScreen.result_focus : undefined,
            zones: Array.isArray(this.state.answersByScreen.zones) ? this.state.answersByScreen.zones : undefined,
            trainingPlace: typeof this.state.answersByScreen.training_place === 'string' ? this.state.answersByScreen.training_place : undefined,
        });
        const leadPayload = {
            name: leadValue.name,
            email: leadValue.email,
            consentAccepted: leadValue.consentAccepted,
            answersByScreen: this.state.answersByScreen,
            height,
            currentWeight,
            targetWeight,
            resultType: result.resultType,
            calorieNorm: result.calorieNorm,
            macros: result.macros,
            utm: this.state.utm,
            createdAt: this.state.startedAt,
        };
        await (0, leadStorage_1.saveLead)(leadPayload);
    }
    async runFullFlowDemo(demoAnswersByScreen) {
        const snapshots = [];
        snapshots.push(this.startQuiz());
        for (const screen of this.config.screens) {
            const answer = demoAnswersByScreen[screen.id];
            if (screen.kind === 'single' && typeof answer === 'string') {
                this.handleOptionClick(answer);
            }
            if (screen.kind === 'multiple' && Array.isArray(answer)) {
                for (const option of answer) {
                    this.handleOptionClick(option);
                }
            }
            if (screen.kind === 'input' && typeof answer === 'number') {
                this.handleNumberInput(answer);
            }
            if (screen.kind === 'leadGate' && typeof answer === 'object' && answer !== null) {
                const lead = answer;
                this.handleLeadGateNameInput(lead.name);
                this.handleLeadGateEmailInput(lead.email);
                this.handleConsentToggle(lead.consentAccepted);
                await this.completeLeadGateAndPersistLead();
            }
            this.goNext();
            snapshots.push(this.renderCurrentScreen());
        }
        return snapshots;
    }
    updateLeadGateField(partial) {
        const screen = getCurrentScreen(this.config, this.state);
        if (screen.kind !== 'leadGate') {
            const fail = {
                state: this.state,
                saved: false,
                issues: [buildInputIssue(screen.id, 'Поля имени, почты и согласия доступны только на лид-гейте.')],
            };
            this.issues = fail.issues;
            return fail;
        }
        const current = this.state.answersByScreen[screen.id];
        const lead = typeof current === 'object' && current !== null && 'name' in current && 'email' in current && 'consentAccepted' in current
            ? current
            : { name: '', email: '', consentAccepted: false };
        const nextLead = {
            ...lead,
            ...partial,
        };
        // Lead-gate fields are updated progressively. Full validation is enforced on "next".
        const nextState = {
            ...this.state,
            answersByScreen: {
                ...this.state.answersByScreen,
                [screen.id]: nextLead,
            },
            updatedAt: new Date().toISOString(),
        };
        const result = {
            state: nextState,
            saved: true,
            issues: [],
        };
        this.applySaveResult(result);
        return result;
    }
    applySaveResult(result) {
        this.state = result.state;
        this.issues = result.issues;
    }
}
exports.QuizScenarioController = QuizScenarioController;
