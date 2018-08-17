"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class MixEffectKeyFillSourceSetCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CKeF';
    }
    serialize() {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt8(this.mixEffect, 0);
        buffer.writeUInt8(this.upstreamKeyerId, 1);
        buffer.writeUInt16BE(this.properties.fillSource, 2);
        return Buffer.concat([Buffer.from('CKeF', 'ascii'), buffer]);
    }
}
exports.MixEffectKeyFillSourceSetCommand = MixEffectKeyFillSourceSetCommand;
//# sourceMappingURL=MixEffectKeyFillSourceSetCommand.js.map