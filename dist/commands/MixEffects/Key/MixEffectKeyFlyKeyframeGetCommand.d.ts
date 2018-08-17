/// <reference types="node" />
import AbstractCommand from '../../AbstractCommand';
import { AtemState } from '../../../state';
import { UpstreamKeyerFlyKeyframe } from '../../../state/video/upstreamKeyers';
export declare class MixEffectKeyFlyKeyframeGetCommand extends AbstractCommand {
    rawName: string;
    mixEffect: number;
    upstreamKeyerId: number;
    properties: UpstreamKeyerFlyKeyframe;
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
