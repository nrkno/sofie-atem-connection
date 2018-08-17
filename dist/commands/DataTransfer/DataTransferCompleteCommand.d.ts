/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DataTransferCompleteCommand extends AbstractCommand {
    rawName: string;
    properties: {
        transferId: number;
    };
    deserialize(rawCommand: Buffer): void;
}
