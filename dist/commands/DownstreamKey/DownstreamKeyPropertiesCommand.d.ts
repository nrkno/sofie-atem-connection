/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
import { DownstreamKeyerProperties } from '../../state/video/downstreamKeyers';
export declare class DownstreamKeyPropertiesCommand extends AbstractCommand {
    rawName: string;
    downstreamKeyerId: number;
    properties: DownstreamKeyerProperties;
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
