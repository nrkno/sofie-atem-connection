/// <reference types="node" />
import { Commands } from '..';
import DataTransfer from './dataTransfer';
export default class DataTransferFrame extends DataTransfer {
    frameId: number;
    hash: string;
    lastSent: Date;
    data: Buffer;
    _sent: number;
    start(): void;
    sendDescription(): void;
    handleCommand(command: Commands.AbstractCommand): void;
    gotLock(): void;
    queueCommand(chunkCount: number, chunkSize: number): void;
    setHash(): void;
}
