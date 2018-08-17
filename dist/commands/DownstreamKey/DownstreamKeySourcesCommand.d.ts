/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
export declare class DownstreamKeySourcesCommand extends AbstractCommand {
    rawName: string;
    downstreamKeyerId: number;
    properties: {
        fillSource: number;
        cutSource: number;
    };
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
