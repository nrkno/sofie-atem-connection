"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class PreviewInputCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'PrvI';
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
        this.properties = {
            source: rawCommand.readUInt16BE(2)
        };
    }
    serialize() {
        const rawCommand = 'CPvI';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.mixEffect,
            0x00,
            this.properties.source >> 8,
            this.properties.source & 0xFF
        ]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        mixEffect.previewInput = this.properties.source;
    }
}
exports.PreviewInputCommand = PreviewInputCommand;
//# sourceMappingURL=PreviewInputCommand.js.map