"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class MixEffectKeyCutSourceSetCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CKeC';
    }
    serialize() {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt8(this.mixEffect, 0);
        buffer.writeUInt8(this.upstreamKeyerId, 1);
        buffer.writeUInt16BE(this.properties.cutSource, 2);
        return Buffer.concat([Buffer.from('CKeC', 'ascii'), buffer]);
    }
}
exports.MixEffectKeyCutSourceSetCommand = MixEffectKeyCutSourceSetCommand;
//# sourceMappingURL=MixEffectKeyCutSourceSetCommand.js.map