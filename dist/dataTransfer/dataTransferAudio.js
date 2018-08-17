"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const dataTransferFrame_1 = require("./dataTransferFrame");
class DataTransferAudio extends dataTransferFrame_1.default {
    start() {
        const command = new __1.Commands.DataTransferUploadRequestCommand();
        command.updateProps({
            transferId: this.transferId,
            transferStoreId: this.storeId,
            transferIndex: 0,
            size: this.data.length,
            mode: __1.Enums.TransferMode.WriteAudio
        });
        this.commandQueue.push(command);
    }
    sendDescription() {
        const command = new __1.Commands.DataTransferFileDescriptionCommand();
        command.updateProps(Object.assign({}, this.description, { fileHash: this.hash, transferId: this.transferId }));
        this.commandQueue.push(command);
    }
}
exports.default = DataTransferAudio;
//# sourceMappingURL=dataTransferAudio.js.map