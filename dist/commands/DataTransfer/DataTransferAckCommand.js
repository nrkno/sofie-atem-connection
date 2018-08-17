"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DataTransferAckCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'FTUA';
    }
    deserialize(rawCommand) {
        this.properties = {
            transferId: rawCommand.readUInt16BE(0),
            transferIndex: rawCommand.readUInt8(2)
        };
    }
}
exports.DataTransferAckCommand = DataTransferAckCommand;
//# sourceMappingURL=DataTransferAckCommand.js.map