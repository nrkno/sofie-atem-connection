"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class PreviewTransitionCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'TrPr'; // this seems unnecessary.
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
        this.properties = {
            preview: rawCommand[1] === 1
        };
    }
    serialize() {
        const rawCommand = 'CTPr';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.mixEffect,
            this.properties.preview,
            0x00, 0x00
        ]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        mixEffect.transitionPreview = this.properties.preview;
    }
}
exports.PreviewTransitionCommand = PreviewTransitionCommand;
//# sourceMappingURL=TransitionPreviewCommand.js.map