/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
import { AtemCapabilites } from '../../state/info';
export declare class TopologyCommand extends AbstractCommand {
    rawName: string;
    properties: AtemCapabilites;
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
