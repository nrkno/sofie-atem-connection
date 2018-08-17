/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class CutCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    properties: null;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(): void;
}
