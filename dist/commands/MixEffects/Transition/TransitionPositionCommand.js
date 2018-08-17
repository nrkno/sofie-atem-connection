"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class TransitionPositionCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'TrPs'; // this seems unnecessary.
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
        this.properties = {
            inTransition: rawCommand[1] === 1,
            remainingFrames: rawCommand[2],
            handlePosition: rawCommand[4] << 8 | rawCommand[4]
        };
    }
    serialize() {
        const rawCommand = 'CTPs';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.mixEffect,
            0x00,
            this.properties.handlePosition >> 8,
            this.properties.handlePosition & 0xff
        ]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        mixEffect.transitionFramesLeft = this.properties.remainingFrames;
        mixEffect.transitionPosition = this.properties.handlePosition;
        mixEffect.inTransition = this.properties.inTransition;
    }
}
exports.TransitionPositionCommand = TransitionPositionCommand;
//# sourceMappingURL=TransitionPositionCommand.js.map