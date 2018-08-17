/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DownstreamKeyAutoCommand extends AbstractCommand {
    rawName: string;
    downstreamKeyId: number;
    properties: null;
    deserialize(): void;
    serialize(): Buffer;
    applyToState(): void;
}
