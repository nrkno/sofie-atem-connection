/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class LockStateCommand extends AbstractCommand {
    rawName: string;
    properties: {
        index: number;
        locked: boolean;
    };
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
}
