"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DataTransferDataCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'FTDa';
    }
    serialize() {
        this.properties.size = this.properties.body.length;
        const buffer = Buffer.alloc(4);
        buffer.writeUInt16BE(this.properties.transferId, 0);
        buffer.writeUInt16BE(this.properties.size, 2);
        return Buffer.concat([Buffer.from('FTDa', 'ascii'), buffer, this.properties.body]);
    }
    deserialize(rawCommand) {
        this.properties = {
            transferId: rawCommand.readUInt16BE(0),
            size: rawCommand.readUInt16BE(2),
            body: rawCommand.slice(4, 4 + rawCommand.readUInt16BE(2))
        };
    }
}
exports.DataTransferDataCommand = DataTransferDataCommand;
//# sourceMappingURL=DataTransferDataCommand.js.map