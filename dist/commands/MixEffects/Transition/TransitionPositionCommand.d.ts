/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
export declare class TransitionPositionCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    properties: {
        readonly inTransition: boolean;
        readonly remainingFrames: number;
        handlePosition: number;
    };
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
