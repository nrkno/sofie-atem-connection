import { Commands, Enums } from '..';
export default abstract class DataTransfer {
    startedAt: Date;
    state: Enums.TransferState;
    transferId: number;
    storeId: number;
    commandQueue: Array<Commands.AbstractCommand>;
    finish: (transfer: DataTransfer) => void;
    fail: (errorCode?: number) => void;
    abstract start(): void;
    abstract handleCommand(command: Commands.AbstractCommand): void;
    abstract gotLock(): void;
}
