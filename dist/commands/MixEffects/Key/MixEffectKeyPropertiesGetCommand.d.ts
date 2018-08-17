/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
import { UpstreamKeyerBase } from '../../../state/video/upstreamKeyers';
export declare class MixEffectKeyPropertiesGetCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    properties: UpstreamKeyerBase;
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
