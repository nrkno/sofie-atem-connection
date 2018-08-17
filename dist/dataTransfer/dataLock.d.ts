import { Commands } from '..';
import DataTransfer from './dataTransfer';
export default class DataLock {
    storeId: number;
    state: number;
    transfer: DataTransfer | undefined;
    queue: Array<DataTransfer>;
    commandQueue: Array<Commands.AbstractCommand>;
    constructor(storeId: number, commandQueue: Array<Commands.AbstractCommand>);
    enqueue(transfer: DataTransfer): void;
    dequeueAndRun(): void;
    lockObtained(): void;
    lostLock(): void;
    updateLock(locked: boolean): void;
    transferFinished(): void;
    transferErrored(code: number): void;
}
