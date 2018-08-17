/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
import { DVETransitionSettings } from '../../../state/video';
export declare class TransitionDVECommand extends AbstractCommand {
    static MaskFlags: {
        rate: number;
        logoRate: number;
        style: number;
        fillSource: number;
        keySource: number;
        enableKey: number;
        preMultiplied: number;
        clip: number;
        gain: number;
        invertKey: number;
        reverse: number;
        flipFlop: number;
    };
    rawName: string;
    mixEffect: number;
    properties: DVETransitionSettings;
    updateProps(newProps: Partial<DVETransitionSettings>): void;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
