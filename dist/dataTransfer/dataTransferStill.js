"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const dataTransferFrame_1 = require("./dataTransferFrame");
class DataTransferStill extends dataTransferFrame_1.default {
    sendDescription() {
        const command = new __1.Commands.DataTransferFileDescriptionCommand();
        command.updateProps(Object.assign({}, this.description, { fileHash: this.hash, transferId: this.transferId }));
        this.commandQueue.push(command);
    }
}
exports.default = DataTransferStill;
//# sourceMappingURL=dataTransferStill.js.map