"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class LockObtainedCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'LKOB';
    }
    deserialize(rawCommand) {
        this.properties = {
            index: rawCommand.readUInt16BE(0)
        };
    }
}
exports.LockObtainedCommand = LockObtainedCommand;
//# sourceMappingURL=LockObtainedCommand.js.map