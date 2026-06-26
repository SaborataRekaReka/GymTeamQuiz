"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toChatiumAdapterPayload = toChatiumAdapterPayload;
function toChatiumAdapterPayload(model) {
    // TODO: Chatium integration. Replace neutral UiNode mapping with Chatium AppUI components.
    // Suggested mapping:
    // UiTextNode -> AppUI.Text
    // UiProgressNode -> AppUI.Progress
    // UiOptionsNode -> AppUI.Card list with tap handlers
    // UiInputNode -> AppUI.Input
    // UiCheckboxNode -> AppUI.Checkbox
    // UiButtonNode -> AppUI.Button
    // UiListNode -> AppUI.List
    // UiTariffListNode -> AppUI.Cards
    // UiEmbedPlaceholderNode -> AppUI.Html/Embed for GetCourse widget
    const blocks = model.nodes.map((node) => ({
        component: node.type,
        props: node,
    }));
    return {
        type: 'chatium_screen_payload',
        screenId: model.screenId,
        blocks,
    };
}
