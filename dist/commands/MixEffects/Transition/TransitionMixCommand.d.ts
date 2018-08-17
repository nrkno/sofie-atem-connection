/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
import { MixTransitionSettings } from '../../../state/video';
export declare class TransitionMixCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    properties: MixTransitionSettings;
    updateProps(newProps: Partial<MixTransitionSettings>): void;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
