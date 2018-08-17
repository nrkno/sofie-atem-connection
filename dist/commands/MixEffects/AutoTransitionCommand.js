"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class AutoTransitionCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'DAut';
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
    }
    serialize() {
        const rawCommand = 'DAut';
        return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0x00, 0x00, 0x00]);
    }
    applyToState() {
        // nothing
    }
}
exports.AutoTransitionCommand = AutoTransitionCommand;
//# sourceMappingURL=AutoTransitionCommand.js.map