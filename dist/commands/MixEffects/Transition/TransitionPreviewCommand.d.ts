/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
export declare class PreviewTransitionCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    properties: {
        preview: boolean;
    };
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
