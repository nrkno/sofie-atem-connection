/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
export declare class PreviewInputCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    properties: {
        source: number;
    };
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
