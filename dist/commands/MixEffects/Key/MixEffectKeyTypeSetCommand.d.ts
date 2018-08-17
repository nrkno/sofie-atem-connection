/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { UpstreamKeyerTypeSettings } from '../../../state/video/upstreamKeyers';
export declare class MixEffectKeyTypeSetCommand extends AbstractCommand {
    static MaskFlags: {
        keyType: number;
        flyEnabled: number;
    };
    rawName: string;
    mixEffect: number;
    upstreamKeyerId: number;
    properties: UpstreamKeyerTypeSettings;
    serialize(): Buffer;
}
