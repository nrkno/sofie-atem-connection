"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class MixEffectKeyChromaCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'KeCk';
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
        this.upstreamKeyerId = rawCommand[1];
        this.properties = {
            hue: rawCommand.readUInt16BE(2),
            gain: rawCommand.readUInt16BE(4),
            ySuppress: rawCommand.readUInt16BE(6),
            lift: rawCommand.readUInt16BE(8),
            narrow: rawCommand[10] === 1
        };
    }
    serialize() {
        const buffer = Buffer.alloc(16);
        buffer.writeUInt8(this.flag, 0);
        buffer.writeUInt8(this.mixEffect, 1);
        buffer.writeUInt8(this.upstreamKeyerId, 2);
        buffer.writeUInt16BE(this.properties.hue, 4);
        buffer.writeUInt16BE(this.properties.gain, 6);
        buffer.writeUInt16BE(this.properties.ySuppress, 8);
        buffer.writeUInt16BE(this.properties.lift, 10);
        buffer[12] = this.properties.narrow ? 1 : 0;
        return Buffer.concat([Buffer.from('CKCk', 'ascii'), buffer]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId);
        upstreamKeyer.chromaSettings = Object.assign({}, this.properties);
    }
}
MixEffectKeyChromaCommand.MaskFlags = {
    hue: 1 << 0,
    gain: 1 << 1,
    ySuppress: 1 << 2,
    lift: 1 << 3,
    narrow: 1 << 4
};
exports.MixEffectKeyChromaCommand = MixEffectKeyChromaCommand;
//# sourceMappingURL=MixEffectKeyChromaCommand.js.map