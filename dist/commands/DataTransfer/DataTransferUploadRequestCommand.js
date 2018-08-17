"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DataTransferUploadRequestCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = '';
    }
    serialize() {
        const buffer = Buffer.alloc(16);
        buffer.writeUInt16BE(this.properties.transferId, 0);
        buffer.writeUInt16BE(this.properties.transferStoreId, 2);
        buffer.writeUInt16BE(this.properties.transferIndex, 6);
        buffer.writeUInt32BE(this.properties.size, 8);
        buffer.writeUInt16BE(this.properties.mode, 12); // @todo: should this be split into 2x enum8?
        return Buffer.concat([Buffer.from('FTSD', 'ascii'), buffer]);
    }
}
exports.DataTransferUploadRequestCommand = DataTransferUploadRequestCommand;
//# sourceMappingURL=DataTransferUploadRequestCommand.js.map