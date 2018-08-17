"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class TransitionMixCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'TMxP';
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
        this.properties = {
            rate: rawCommand[1]
        };
    }
    serialize() {
        const rawCommand = 'CTMx';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.mixEffect,
            this.properties.rate,
            0x00, 0x00
        ]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        mixEffect.transitionSettings.mix = Object.assign({}, this.properties);
    }
}
exports.TransitionMixCommand = TransitionMixCommand;
//# sourceMappingURL=TransitionMixCommand.js.map