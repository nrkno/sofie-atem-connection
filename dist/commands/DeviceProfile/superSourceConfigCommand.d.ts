/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
export declare class SuperSourceConfigCommand extends AbstractCommand {
    rawName: string;
    properties: {
        superSourceBoxes: number;
    };
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
