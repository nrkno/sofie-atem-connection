"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const crypto = require("crypto");
const dataTransfer_1 = require("./dataTransfer");
class DataTransferFrame extends dataTransfer_1.default {
    constructor() {
        super(...arguments);
        this._sent = 0;
    }
    start() {
        const command = new __1.Commands.DataTransferUploadRequestCommand();
        command.updateProps({
            transferId: this.transferId,
            transferStoreId: this.storeId,
            transferIndex: this.frameId,
            size: this.data.length,
            mode: __1.Enums.TransferMode.Write
        });
        this.commandQueue.push(command);
    }
    sendDescription() {
        if (!this.hash) {
            this.setHash();
        }
        const command = new __1.Commands.DataTransferFileDescriptionCommand();
        command.updateProps({ fileHash: this.hash, transferId: this.transferId });
        this.commandQueue.push(command);
    }
    handleCommand(command) {
        if (command.constructor.name === __1.Commands.DataTransferUploadContinueCommand.name) {
            if (this.state === __1.Enums.TransferState.Locked) {
                this.state = __1.Enums.TransferState.Transferring;
                this.sendDescription();
            }
            this.queueCommand(command.properties.chunkCount, command.properties.chunkSize);
        }
        else if (command.constructor.name === __1.Commands.DataTransferCompleteCommand.name) {
            if (this.state === __1.Enums.TransferState.Transferring) {
                this.state = __1.Enums.TransferState.Finished;
            }
        }
    }
    gotLock() {
        this.state = __1.Enums.TransferState.Locked;
        this.start();
    }
    queueCommand(chunkCount, chunkSize) {
        chunkSize += -4;
        this.lastSent = new Date();
        for (let i = 0; i < chunkCount; i++) {
            if (this._sent > this.data.length)
                return;
            const command = new __1.Commands.DataTransferDataCommand();
            command.updateProps({
                transferId: this.transferId,
                body: this.data.slice(this._sent, this._sent + chunkSize)
            });
            this.commandQueue.push(command);
            this._sent += chunkSize;
        }
    }
    setHash() {
        if (this.data) {
            this.hash = crypto.createHash('md5').update(this.data).digest().toString();
        }
    }
}
exports.default = DataTransferFrame;
//# sourceMappingURL=dataTransferFrame.js.map