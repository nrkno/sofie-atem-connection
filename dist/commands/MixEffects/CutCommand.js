"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class CutCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'DCut';
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
    }
    serialize() {
        const rawCommand = 'DCut';
        return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0xef, 0xbf, 0x5f]);
    }
    applyToState() {
        // nothing
    }
}
exports.CutCommand = CutCommand;
//# sourceMappingURL=CutCommand.js.map