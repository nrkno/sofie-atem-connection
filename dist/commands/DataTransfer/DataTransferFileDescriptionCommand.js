"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DataTransferFileDescriptionCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = '';
    }
    serialize() {
        const buffer = Buffer.alloc(212);
        buffer.writeUInt16BE(this.properties.transferId, 0);
        if (this.properties.name)
            buffer.write(this.properties.name, 2, 64);
        if (this.properties.description)
            buffer.write(this.properties.description, 66, 128);
        buffer.write(this.properties.fileHash, 194, 16);
        return Buffer.concat([Buffer.from('FTFD', 'ascii'), buffer]);
    }
}
exports.DataTransferFileDescriptionCommand = DataTransferFileDescriptionCommand;
//# sourceMappingURL=DataTransferFileDescriptionCommand.js.map