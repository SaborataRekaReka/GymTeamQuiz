"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadQuizFlowConfig = loadQuizFlowConfig;
const quiz_screen_map_json_1 = __importDefault(require("../data/quiz_screen_map.json"));
const NUMBER_LIMITS_BY_SCREEN = {
    current_weight: { min: 35, max: 220 },
    height: { min: 120, max: 220 },
    target_weight: { min: 35, max: 220 },
};
function normalizeScreen(raw) {
    const base = {
        order: raw.number,
        id: raw.id,
        rawType: raw.type,
        title: raw.question ?? raw.title,
        subtitle: raw.subtitle,
        required: ['single_choice', 'multi_choice', 'number_input', 'lead_gate'].includes(raw.type),
        notes: raw.note ?? raw.footer_note,
    };
    switch (raw.type) {
        case 'single_choice': {
            const screen = {
                ...base,
                kind: 'single',
                options: raw.options ?? [],
            };
            return screen;
        }
        case 'multi_choice': {
            const screen = {
                ...base,
                kind: 'multiple',
                options: raw.options ?? [],
            };
            return screen;
        }
        case 'number_input': {
            const limits = NUMBER_LIMITS_BY_SCREEN[raw.id];
            const screen = {
                ...base,
                kind: 'input',
                inputType: 'number',
                unit: raw.unit,
                min: limits?.min,
                max: limits?.max,
            };
            return screen;
        }
        case 'trust': {
            const screen = {
                ...base,
                kind: 'trust',
                text: raw.text,
                media: raw.media,
                buttonText: raw.button,
            };
            return screen;
        }
        case 'sales_transition': {
            const screen = {
                ...base,
                kind: 'salesTransition',
                text: raw.text,
                media: raw.media,
                benefits: raw.benefits ?? [],
                buttonText: raw.button,
            };
            return screen;
        }
        case 'loader': {
            const screen = {
                ...base,
                kind: 'loader',
                text: raw.text,
                media: raw.media,
                buttonText: raw.button,
                progressType: raw.progress_type,
                steps: raw.steps ?? [],
            };
            return screen;
        }
        case 'lead_gate': {
            const screen = {
                ...base,
                kind: 'leadGate',
                text: raw.text,
                fields: raw.fields ?? ['name', 'email'],
                consentRequired: raw.consent_required ?? true,
            };
            return screen;
        }
        case 'personal_result': {
            const screen = {
                ...base,
                kind: 'result',
                titleTemplate: raw.title_template,
                blocks: raw.blocks ?? [],
            };
            return screen;
        }
        case 'paywall': {
            const screen = {
                ...base,
                kind: 'paywall',
                topFocus: raw.top_focus,
                requiredBlocks: raw.required_blocks ?? [],
            };
            return screen;
        }
        default:
            throw new Error(`Unknown screen type: ${String(raw.type)}`);
    }
}
function loadQuizFlowConfig() {
    const map = quiz_screen_map_json_1.default;
    const screens = map.screens
        .slice()
        .sort((a, b) => a.number - b.number)
        .map(normalizeScreen);
    return {
        project: map.project,
        goal: map.goal,
        screens,
        legalLinks: map.legal_links,
        tariffs: map.tariffs,
        requiredSavedFields: map.required_saved_fields,
    };
}
