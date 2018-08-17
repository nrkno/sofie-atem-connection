/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class LockObtainedCommand extends AbstractCommand {
    rawName: string;
    properties: {
        index: number;
    };
    deserialize(rawCommand: Buffer): void;
}
