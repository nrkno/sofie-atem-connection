"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class MixEffectKeyOnAirCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'KeOn';
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
        this.upstreamKeyerId = rawCommand[1];
        this.properties = {
            onAir: rawCommand[2] === 1
        };
    }
    serialize() {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt8(this.mixEffect, 0);
        buffer.writeUInt8(this.upstreamKeyerId, 1);
        buffer[2] = this.properties.onAir ? 1 : 0;
        return Buffer.concat([Buffer.from('CKOn', 'ascii'), buffer]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId);
        upstreamKeyer.onAir = this.properties.onAir;
    }
}
exports.MixEffectKeyOnAirCommand = MixEffectKeyOnAirCommand;
//# sourceMappingURL=MixEffectKeyOnAirCommand.js.map