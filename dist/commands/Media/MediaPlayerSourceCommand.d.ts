/// <reference types="node" />
import { AtemState } from '../../state';
import { MediaPlayerSource } from '../../state/media';
import AbstractCommand from '../AbstractCommand';
import { Enums } from '../..';
export declare class MediaPlayerSourceCommand extends AbstractCommand {
    static MaskFlags: {
        sourceType: number;
        stillIndex: number;
        clipIndex: number;
    };
    rawName: string;
    mediaPlayerId: number;
    properties: MediaPlayerSource;
    updateProps(newProps: Partial<{
        sourceType: Enums.MediaSourceType;
        stillIndex: number;
        clipIndex: number;
    }>): void;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
