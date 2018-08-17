/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { UpstreamKeyerMaskSettings } from '../../../state/video/upstreamKeyers';
export declare class MixEffectKeyMaskSetCommand extends AbstractCommand {
    static MaskFlags: {
        maskEnabled: number;
        maskTop: number;
        maskBottom: number;
        maskLeft: number;
        maskRight: number;
    };
    rawName: string;
    mixEffect: number;
    upstreamKeyerId: number;
    properties: UpstreamKeyerMaskSettings;
    serialize(): Buffer;
}
