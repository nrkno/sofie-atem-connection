/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
export declare class MixEffectKeyFillSourceSetCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    upstreamKeyerId: number;
    properties: {
        fillSource: number;
    };
    serialize(): Buffer;
}
