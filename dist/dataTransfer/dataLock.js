"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class DataLock {
    constructor(storeId, commandQueue) {
        this.queue = [];
        this.commandQueue = [];
        this.storeId = storeId;
        this.commandQueue = commandQueue;
    }
    enqueue(transfer) {
        this.queue.push(transfer);
        this.dequeueAndRun();
    }
    dequeueAndRun() {
        if (this.transfer === undefined && this.queue.length > 0) {
            this.transfer = this.queue.shift();
            // obtain lock
            const command = new __1.Commands.LockStateCommand();
            command.updateProps({
                index: this.storeId,
                locked: true
            });
            this.commandQueue.push(command);
        }
    }
    lockObtained() {
        this.state = 1;
        if (this.transfer && this.transfer.state === __1.Enums.TransferState.Queued) {
            this.transfer.gotLock();
        }
    }
    lostLock() {
        this.state = 0;
        if (this.transfer && this.transfer.state === __1.Enums.TransferState.Finished) {
            this.transfer.finish(this.transfer);
        }
        else if (this.transfer) {
            // @todo: dequeue any old commands
            this.transfer.fail();
        }
        this.transfer = undefined;
        this.dequeueAndRun();
    }
    updateLock(locked) {
        this.state = locked ? 1 : 0;
    }
    transferFinished() {
        if (this.queue.length > 0) {
            this.dequeueAndRun();
        }
        else {
            const command = new __1.Commands.LockStateCommand();
            command.updateProps({
                index: this.storeId,
                locked: false
            });
            this.commandQueue.push(command);
        }
    }
    transferErrored(code) {
        if (this.transfer) {
            // @todo: dequeue any old commands
            this.transfer.fail(code);
        }
        this.transfer = undefined;
        this.dequeueAndRun();
    }
}
exports.default = DataLock;
//# sourceMappingURL=dataLock.js.map