"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DataTransferErrorCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'FTDE';
    }
    deserialize(rawCommand) {
        this.properties = {
            transferId: rawCommand.readUInt16BE(0),
            errorCode: rawCommand.readUInt8(2)
        };
    }
}
exports.DataTransferErrorCommand = DataTransferErrorCommand;
//# sourceMappingURL=DataTransferErrorCommand.js.map