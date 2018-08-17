/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
export declare class MixEffectKeyCutSourceSetCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    upstreamKeyerId: number;
    properties: {
        cutSource: number;
    };
    serialize(): Buffer;
}
