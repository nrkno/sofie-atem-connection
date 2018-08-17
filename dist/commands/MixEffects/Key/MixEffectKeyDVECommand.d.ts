/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
import { UpstreamKeyerDVESettings } from '../../../state/video/upstreamKeyers';
export declare class MixEffectKeyDVECommand extends AbstractCommand {
    static MaskFlags: {
        sizeX: number;
        sizeY: number;
        positionX: number;
        positionY: number;
        rotation: number;
        borderEnabled: number;
        shadowEnabled: number;
        borderBevel: number;
        borderOuterWidth: number;
        borderInnerWidth: number;
        borderOuterSoftness: number;
        borderInnerSoftness: number;
        borderBevelSoftness: number;
        borderBevelPosition: number;
        borderOpacity: number;
        borderHue: number;
        borderSaturation: number;
        borderLuma: number;
        lightSourceDirection: number;
        lightSourceAltitude: number;
        maskEnabled: number;
        maskTop: number;
        maskBottom: number;
        maskLeft: number;
        maskRight: number;
        rate: number;
    };
    rawName: string;
    mixEffect: number;
    upstreamKeyerId: number;
    properties: UpstreamKeyerDVESettings;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
