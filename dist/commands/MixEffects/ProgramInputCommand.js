"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class ProgramInputCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'PrgI';
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
        this.properties = {
            source: rawCommand.readUInt16BE(2)
        };
    }
    serialize() {
        const rawCommand = 'CPgI';
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
        mixEffect.programInput = this.properties.source;
    }
}
exports.ProgramInputCommand = ProgramInputCommand;
//# sourceMappingURL=ProgramInputCommand.js.map