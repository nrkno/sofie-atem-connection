/// <reference types="node" />
import { AtemState } from '../../state';
import { MediaPlayer } from '../../state/media';
import AbstractCommand from '../AbstractCommand';
export declare class MediaPlayerStatusCommand extends AbstractCommand {
    static MaskFlags: {
        playing: number;
        loop: number;
        atBeginning: number;
        frame: number;
    };
    rawName: string;
    mediaPlayerId: number;
    properties: MediaPlayer;
    updateProps(newProps: Partial<MediaPlayer>): void;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
