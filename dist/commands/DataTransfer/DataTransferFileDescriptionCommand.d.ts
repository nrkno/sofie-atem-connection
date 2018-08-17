/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DataTransferFileDescriptionCommand extends AbstractCommand {
    rawName: string;
    properties: {
        transferId: number;
        name: string;
        description: string;
        fileHash: string;
    };
    serialize(): Buffer;
}
