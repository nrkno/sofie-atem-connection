/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
import { UpstreamKeyerFlySettings } from '../../../state/video/upstreamKeyers';
export declare class MixEffectKeyFlyPropertiesGetCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    upstreamKeyerId: number;
    properties: UpstreamKeyerFlySettings;
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
