"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const crypto = require("crypto");
const dataLock_1 = require("./dataLock");
const dataTransferFrame_1 = require("./dataTransferFrame");
const dataTransferStill_1 = require("./dataTransferStill");
const dataTransferClip_1 = require("./dataTransferClip");
const dataTransferAudio_1 = require("./dataTransferAudio");
const MAX_PACKETS_TO_SEND_PER_TICK = 10;
class DataTransferManager {
    constructor(sendCommand) {
        this.commandQueue = [];
        this.stillsLock = new dataLock_1.default(0, this.commandQueue);
        this.clip1Lock = new dataLock_1.default(1, this.commandQueue);
        this.clip2Lock = new dataLock_1.default(2, this.commandQueue);
        this.audio1Lock = new dataLock_1.default(2, this.commandQueue);
        this.audio2Lock = new dataLock_1.default(2, this.commandQueue);
        this.transferIndex = 0;
        setInterval(() => {
            if (this.commandQueue.length <= 0) {
                return;
            }
            const commandsToSend = this.commandQueue.splice(0, MAX_PACKETS_TO_SEND_PER_TICK);
            commandsToSend.forEach(command => {
                sendCommand(command).catch(() => { });
            });
        }, 0);
    }
    handleCommand(command) {
        // try to establish the associated DataLock:
        let lock = this.stillsLock; // assign, because we get a false "used before asssigned error"
        if (command.constructor.name === __1.Commands.LockObtainedCommand.name || command.constructor.name === __1.Commands.LockStateCommand.name) {
            switch (command.properties.index) {
                case 0:
                    lock = this.stillsLock;
                    break;
                case 1:
                    lock = this.clip1Lock;
                    break;
                case 2:
                    lock = this.clip2Lock;
                    break;
                case 3:
                    lock = this.audio1Lock;
                    break;
                case 4:
                    lock = this.audio2Lock;
                    break;
            }
        }
        else if (command.properties.storeId) {
            lock = [this.stillsLock, this.clip1Lock, this.clip2Lock][command.properties.storeId];
        }
        else if (command.properties.transferId !== undefined || command.properties.transferIndex !== undefined) {
            for (const _lock of [this.stillsLock, this.clip1Lock, this.clip2Lock]) {
                if (_lock.transfer && (_lock.transfer.transferId === command.properties.transferId || _lock.transfer.transferId === command.properties.transferIndex)) {
                    lock = _lock;
                }
            }
        }
        else {
            // debugging:
            console.log(command);
            return;
        }
        // handle actual command
        if (command.constructor.name === __1.Commands.LockObtainedCommand.name) {
            lock.lockObtained();
        }
        if (command.constructor.name === __1.Commands.LockStateCommand.name) {
            if (!command.properties.locked)
                lock.lostLock();
            else
                lock.updateLock(command.properties.locked);
        }
        if (command.constructor.name === __1.Commands.DataTransferErrorCommand.name) {
            lock.transferErrored(command.properties.errorCode);
        }
        if (lock.transfer) {
            lock.transfer.handleCommand(command);
            if (lock.transfer.state === __1.Enums.TransferState.Finished) {
                lock.transferFinished();
            }
        }
    }
    uploadStill(index, data, name, description) {
        const transfer = new dataTransferStill_1.default();
        const ps = new Promise((resolve, reject) => {
            transfer.finish = resolve;
            transfer.fail = reject;
        });
        transfer.commandQueue = this.commandQueue;
        transfer.transferId = this.transferIndex++;
        transfer.storeId = 0;
        transfer.frameId = index;
        transfer.data = data;
        transfer.hash = crypto.createHash('md5').update(data).digest().toString();
        transfer.description = { name, description };
        this.stillsLock.enqueue(transfer);
        return ps;
    }
    uploadClip(index, data, name) {
        const transfer = new dataTransferClip_1.default();
        const ps = new Promise((resolve, reject) => {
            transfer.finish = resolve;
            transfer.fail = reject;
        });
        transfer.commandQueue = this.commandQueue;
        transfer.storeId = 1 + index;
        transfer.description = { name };
        for (const frameId in data) {
            const frame = data[frameId];
            const frameTransfer = new dataTransferFrame_1.default();
            frameTransfer.commandQueue = this.commandQueue;
            frameTransfer.transferId = this.transferIndex++;
            frameTransfer.storeId = 1 + index;
            frameTransfer.frameId = Number(frameId);
            frameTransfer.data = frame;
            // frameTransfer.hash = crypto.createHash('md5').update(frame).digest().toString()
            transfer.frames.push(frameTransfer);
        }
        [this.clip1Lock, this.clip2Lock][index].enqueue(transfer);
        return ps;
    }
    uploadAudio(index, data, name) {
        const transfer = new dataTransferAudio_1.default();
        const ps = new Promise((resolve, reject) => {
            transfer.finish = resolve;
            transfer.fail = reject;
        });
        transfer.commandQueue = this.commandQueue;
        transfer.transferId = this.transferIndex++;
        transfer.storeId = 3 + index;
        transfer.description = { name };
        transfer.data = data;
        [this.audio1Lock, this.audio2Lock][index].enqueue(transfer);
        return ps;
    }
}
exports.DataTransferManager = DataTransferManager;
//# sourceMappingURL=index.js.map