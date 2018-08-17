"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class MixEffectKeyTypeSetCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CKTp';
    }
    serialize() {
        const buffer = Buffer.alloc(8);
        buffer.writeUInt8(this.flag, 0);
        buffer.writeUInt8(this.mixEffect, 1);
        buffer.writeUInt8(this.upstreamKeyerId, 2);
        buffer.writeUInt8(this.properties.keyType, 3);
        buffer[4] = this.properties.flyEnabled ? 1 : 0;
        return Buffer.concat([Buffer.from('CKTp', 'ascii'), buffer]);
    }
}
MixEffectKeyTypeSetCommand.MaskFlags = {
    keyType: 1 << 0,
    flyEnabled: 1 << 1
};
exports.MixEffectKeyTypeSetCommand = MixEffectKeyTypeSetCommand;
//# sourceMappingURL=MixEffectKeyTypeSetCommand.js.map