/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DataTransferErrorCommand extends AbstractCommand {
    rawName: string;
    properties: {
        transferId: number;
        errorCode: number;
    };
    deserialize(rawCommand: Buffer): void;
}
