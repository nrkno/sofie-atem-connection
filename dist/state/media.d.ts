import * as Enums from '../enums';
export interface MediaPlayer {
    playing: boolean;
    loop: boolean;
    atBeginning: boolean;
    clipFrame: number;
}
export interface MediaPlayerSource {
    sourceType: Enums.MediaSourceType;
    clipIndex: number;
    stillIndex: number;
}
export declare class MediaState {
    stillPool: Array<StillFrame>;
    clipPool: Array<ClipBank>;
    players: Array<MediaPlayer & MediaPlayerSource>;
}
export declare class StillFrame {
    isUsed: boolean;
    hash: string;
    fileName: string;
}
export declare class ClipBank {
    isUsed: boolean;
    name: string;
    frameCount: number;
    frames: Array<StillFrame>;
}
