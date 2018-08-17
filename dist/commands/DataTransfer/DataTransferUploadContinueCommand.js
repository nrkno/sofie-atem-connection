"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DataTransferUploadContinueCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'FTCD';
    }
    deserialize(rawCommand) {
        this.properties = {
            transferId: rawCommand.readUInt16BE(0),
            chunkSize: rawCommand.readUInt16BE(6),
            chunkCount: rawCommand.readUInt16BE(8)
        };
    }
    serialize() {
        const buffer = Buffer.alloc(16);
        buffer.writeUInt16BE(this.properties.transferId, 0);
        buffer[2] = 26; // https://github.com/LibAtem/LibAtem/blob/master/LibAtem/Commands/DataTransfer/DataTransferUploadContinueCommand.cs#L13
        buffer.writeUInt16BE(this.properties.chunkSize, 6);
        buffer.writeUInt16BE(this.properties.chunkCount, 8);
        buffer[10] = 0x8b00;
        return Buffer.concat([Buffer.from('FTCD', 'ascii'), buffer]);
    }
}
exports.DataTransferUploadContinueCommand = DataTransferUploadContinueCommand;
//# sourceMappingURL=DataTransferUploadContinueCommand.js.map