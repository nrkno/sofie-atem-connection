/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DataTransferAckCommand extends AbstractCommand {
    rawName: string;
    properties: {
        transferId: number;
        transferIndex: number;
    };
    deserialize(rawCommand: Buffer): void;
}
