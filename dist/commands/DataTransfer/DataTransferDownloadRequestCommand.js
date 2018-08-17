"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DataTransferDownloadRequestCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = '';
    }
    serialize() {
        const buffer = Buffer.alloc(12);
        buffer.writeUInt16BE(this.properties.transferId, 0);
        buffer.writeUInt16BE(this.properties.transferStoreId, 2);
        buffer.writeUInt8(this.properties.transferIndex, 7);
        buffer.writeUInt16BE(0x00f9, 8);
        buffer.writeUInt16BE(0x020f, 10);
        return Buffer.concat([Buffer.from('FTSU', 'ascii'), buffer]);
    }
}
exports.DataTransferDownloadRequestCommand = DataTransferDownloadRequestCommand;
//# sourceMappingURL=DataTransferDownloadRequestCommand.js.map