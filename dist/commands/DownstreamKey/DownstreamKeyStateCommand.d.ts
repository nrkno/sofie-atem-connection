/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
import { DownstreamKeyerBase } from '../../state/video/downstreamKeyers';
export declare class DownstreamKeyStateCommand extends AbstractCommand {
    rawName: string;
    downstreamKeyId: number;
    properties: DownstreamKeyerBase;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
