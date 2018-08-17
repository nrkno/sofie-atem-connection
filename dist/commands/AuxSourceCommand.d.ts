/// <reference types="node" />
import AbstractCommand from './AbstractCommand';
import { AtemState } from '../state';
export declare class AuxSourceCommand extends AbstractCommand {
    rawName: string;
    auxBus: number;
    properties: {
        source: number;
    };
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
