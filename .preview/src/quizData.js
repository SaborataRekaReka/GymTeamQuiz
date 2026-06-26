"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizScreens = exports.quizFlow = void 0;
const screenMap_1 = require("./screenMap");
exports.quizFlow = (0, screenMap_1.loadQuizFlowConfig)();
exports.quizScreens = exports.quizFlow.screens;
