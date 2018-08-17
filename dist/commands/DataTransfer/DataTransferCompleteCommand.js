"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DataTransferCompleteCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'FTDC';
    }
    deserialize(rawCommand) {
        this.properties = {
            transferId: rawCommand.readUInt16BE(0)
        };
    }
}
exports.DataTransferCompleteCommand = DataTransferCompleteCommand;
//# sourceMappingURL=DataTransferCompleteCommand.js.map