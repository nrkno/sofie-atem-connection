/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DataTransferDataCommand extends AbstractCommand {
    rawName: string;
    properties: {
        transferId: number;
        size: number;
        body: Buffer;
    };
    serialize(): Buffer;
    deserialize(rawCommand: Buffer): void;
}
