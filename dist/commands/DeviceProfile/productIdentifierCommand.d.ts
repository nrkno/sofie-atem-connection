/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
export declare class ProductIdentifierCommand extends AbstractCommand {
    rawName: string;
    properties: {
        deviceName: string;
        model: number;
    };
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
