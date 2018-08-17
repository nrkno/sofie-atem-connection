/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DataTransferDownloadRequestCommand extends AbstractCommand {
    rawName: string;
    properties: {
        transferId: number;
        transferStoreId: number;
        transferIndex: number;
    };
    serialize(): Buffer;
}
