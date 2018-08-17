"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class MixEffectKeyLumaCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'KeLm';
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
        this.upstreamKeyerId = rawCommand[1];
        this.properties = {
            preMultiplied: rawCommand[2] === 1,
            clip: rawCommand.readUInt16BE(4),
            gain: rawCommand.readUInt16BE(6),
            invert: rawCommand[8] === 1
        };
    }
    serialize() {
        const buffer = Buffer.alloc(12);
        buffer.writeUInt8(this.flag, 0);
        buffer.writeUInt8(this.mixEffect, 1);
        buffer.writeUInt8(this.upstreamKeyerId, 2);
        buffer[3] = this.properties.preMultiplied ? 1 : 0;
        buffer.writeUInt16BE(this.properties.clip, 4);
        buffer.writeUInt16BE(this.properties.gain, 6);
        buffer[8] = this.properties.invert ? 1 : 0;
        return Buffer.concat([Buffer.from('CKLm', 'ascii'), buffer]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId);
        upstreamKeyer.lumaSettings = Object.assign({}, this.properties);
    }
}
MixEffectKeyLumaCommand.MaskFlags = {
    preMultiplied: 1 << 0,
    clip: 1 << 1,
    gain: 1 << 2,
    invert: 1 << 3
};
exports.MixEffectKeyLumaCommand = MixEffectKeyLumaCommand;
//# sourceMappingURL=MixEffectKeyLumaCommand.js.map