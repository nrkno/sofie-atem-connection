/// <reference types="node" />
import { Commands } from '..';
import DataLock from './dataLock';
export declare class DataTransferManager {
    commandQueue: Array<Commands.AbstractCommand>;
    stillsLock: DataLock;
    clip1Lock: DataLock;
    clip2Lock: DataLock;
    audio1Lock: DataLock;
    audio2Lock: DataLock;
    transferIndex: number;
    constructor(sendCommand: (command: Commands.AbstractCommand) => Promise<Commands.AbstractCommand>);
    handleCommand(command: Commands.AbstractCommand): void;
    uploadStill(index: number, data: Buffer, name: string, description: string): Promise<{}>;
    uploadClip(index: number, data: Array<Buffer>, name: string): Promise<{}>;
    uploadAudio(index: number, data: Buffer, name: string): Promise<{}>;
}
