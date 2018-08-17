/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
export declare class ProgramInputCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    properties: {
        source: number;
    };
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
