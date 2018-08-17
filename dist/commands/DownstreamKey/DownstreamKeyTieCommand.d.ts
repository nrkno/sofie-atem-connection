/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DownstreamKeyTieCommand extends AbstractCommand {
    rawName: string;
    downstreamKeyId: number;
    properties: {
        tie: boolean;
    };
    deserialize(): void;
    serialize(): Buffer;
    applyToState(): void;
}
