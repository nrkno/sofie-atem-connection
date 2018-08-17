"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class MixEffectKeyMaskSetCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CKMs';
    }
    serialize() {
        const buffer = Buffer.alloc(12);
        buffer.writeUInt8(this.flag, 0);
        buffer.writeUInt8(this.mixEffect, 1);
        buffer.writeUInt8(this.upstreamKeyerId, 2);
        buffer[3] = this.properties.maskEnabled ? 1 : 0;
        buffer.writeInt16BE(this.properties.maskTop, 4);
        buffer.writeInt16BE(this.properties.maskBottom, 6);
        buffer.writeInt16BE(this.properties.maskLeft, 8);
        buffer.writeInt16BE(this.properties.maskRight, 10);
        return Buffer.concat([Buffer.from('CKMs', 'ascii'), buffer]);
    }
}
MixEffectKeyMaskSetCommand.MaskFlags = {
    maskEnabled: 1 << 0,
    maskTop: 1 << 1,
    maskBottom: 1 << 2,
    maskLeft: 1 << 3,
    maskRight: 1 << 4
};
exports.MixEffectKeyMaskSetCommand = MixEffectKeyMaskSetCommand;
//# sourceMappingURL=MixEffectKeyMaskSetCommand.js.map