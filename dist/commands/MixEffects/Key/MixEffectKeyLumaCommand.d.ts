/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
import { UpstreamKeyerLumaSettings } from '../../../state/video/upstreamKeyers';
export declare class MixEffectKeyLumaCommand extends AbstractCommand {
    static MaskFlags: {
        preMultiplied: number;
        clip: number;
        gain: number;
        invert: number;
    };
    rawName: string;
    mixEffect: number;
    upstreamKeyerId: number;
    properties: UpstreamKeyerLumaSettings;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
