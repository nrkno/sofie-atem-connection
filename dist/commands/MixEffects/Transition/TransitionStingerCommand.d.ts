/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
import { StingerTransitionSettings } from '../../../state/video';
export declare class TransitionStingerCommand extends AbstractCommand {
    static MaskFlags: {
        source: number;
        preMultipliedKey: number;
        clip: number;
        gain: number;
        invert: number;
        preroll: number;
        clipDuration: number;
        triggerPoint: number;
        mixRate: number;
    };
    rawName: string;
    mixEffect: number;
    properties: StingerTransitionSettings;
    updateProps(newProps: Partial<StingerTransitionSettings>): void;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
