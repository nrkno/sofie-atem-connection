/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DownstreamKeyOnAirCommand extends AbstractCommand {
    rawName: string;
    downstreamKeyId: number;
    properties: {
        onAir: boolean;
    };
    deserialize(): void;
    serialize(): Buffer;
    applyToState(): void;
}
