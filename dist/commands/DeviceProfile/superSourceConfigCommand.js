"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class SuperSourceConfigCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = '_SSC';
    }
    deserialize(rawCommand) {
        this.properties = {
            superSourceBoxes: rawCommand[0]
        };
    }
    applyToState(state) {
        state.info = Object.assign({}, state.info, this.properties);
    }
}
exports.SuperSourceConfigCommand = SuperSourceConfigCommand;
//# sourceMappingURL=superSourceConfigCommand.js.map