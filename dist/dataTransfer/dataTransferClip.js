"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const dataTransfer_1 = require("./dataTransfer");
class DataTransferClip extends dataTransfer_1.default {
    constructor() {
        super(...arguments);
        this.frames = [];
        this.curFrame = 0;
    }
    start() {
        const clearMediaCommand = new __1.Commands.MediaPoolClearClipCommand();
        clearMediaCommand.updateProps({
            index: this.clipIndex
        });
        this.commandQueue.push(clearMediaCommand);
        this.frames[this.curFrame].state = __1.Enums.TransferState.Locked;
        this.frames[this.curFrame].start();
    }
    handleCommand(command) {
        this.frames[this.curFrame].handleCommand(command);
        if (this.state !== __1.Enums.TransferState.Transferring)
            this.state = __1.Enums.TransferState.Transferring;
        if (this.frames[this.curFrame].state === __1.Enums.TransferState.Finished) {
            this.curFrame++;
            if (this.curFrame < this.frames.length) {
                this.frames[this.curFrame].state = __1.Enums.TransferState.Locked;
                this.frames[this.curFrame].start();
            }
            else {
                const command = new __1.Commands.MediaPoolSetClipCommand();
                command.updateProps({
                    index: this.clipIndex,
                    name: this.description.name,
                    frames: this.frames.length
                });
                this.commandQueue.push(command);
                this.state = __1.Enums.TransferState.Finished;
            }
        }
    }
    get transferId() {
        return this.frames[this.curFrame].transferId;
    }
    gotLock() {
        this.state = __1.Enums.TransferState.Locked;
        this.start();
    }
}
exports.default = DataTransferClip;
//# sourceMappingURL=dataTransferClip.js.map