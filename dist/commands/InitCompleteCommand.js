"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("./AbstractCommand");
class InitCompleteCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'InCm';
    }
    deserialize() {
        //
    }
    applyToState() {
        //
    }
}
exports.InitCompleteCommand = InitCompleteCommand;
//# sourceMappingURL=InitCompleteCommand.js.map