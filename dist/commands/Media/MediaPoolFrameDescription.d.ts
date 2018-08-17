/// <reference types="node" />
import { AtemState } from '../../state';
import { StillFrame } from '../../state/media';
import AbstractCommand from '../AbstractCommand';
export declare class MediaPoolFrameDescriptionCommand extends AbstractCommand {
    rawName: string;
    mediaPool: number;
    frameIndex: number;
    properties: StillFrame;
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
