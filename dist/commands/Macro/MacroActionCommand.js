"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
const enums_1 = require("../../enums");
class MacroActionCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'MAct'; // this seems unnecessary.
    }
    deserialize() {
        //
    }
    serialize() {
        const rawCommand = 'MAct';
        const buffer = new Buffer([...Buffer.from(rawCommand), 0x00, 0x00, this.properties.action, 0x00]);
        switch (this.properties.action) {
            case enums_1.MacroAction.Run:
            case enums_1.MacroAction.Delete:
                buffer[4] = this.index >> 8;
                buffer[5] = this.index & 0xff;
                break;
            default:
                break;
        }
        return buffer;
    }
    applyToState() {
        //
    }
}
exports.MacroActionCommand = MacroActionCommand;
//# sourceMappingURL=MacroActionCommand.js.map