"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class LockStateCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'LKST';
    }
    deserialize(rawCommand) {
        this.properties = {
            index: rawCommand.readUInt16BE(0),
            locked: rawCommand[2] === 1
        };
    }
    serialize() {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt16BE(this.properties.index, 0);
        buffer[2] = this.properties.locked ? 1 : 0;
        return Buffer.concat([Buffer.from('LOCK', 'ascii'), buffer]);
    }
}
exports.LockStateCommand = LockStateCommand;
//# sourceMappingURL=LockStateCommand.js.map