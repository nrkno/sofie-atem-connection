/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DataTransferUploadContinueCommand extends AbstractCommand {
    rawName: string;
    properties: {
        transferId: number;
        chunkSize: number;
        chunkCount: number;
    };
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
}
