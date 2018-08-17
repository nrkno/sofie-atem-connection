/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { Enums } from '../..';
export declare class DataTransferUploadRequestCommand extends AbstractCommand {
    rawName: string;
    properties: {
        transferId: number;
        transferStoreId: number;
        transferIndex: number;
        size: number;
        mode: Enums.TransferMode;
    };
    serialize(): Buffer;
}
