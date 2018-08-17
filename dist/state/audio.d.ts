export declare class AudioChannel {
    on: boolean;
    afv: boolean;
    gain: number;
    rawGain: number;
    rawPan: number;
    leftLevel: number;
    rightLevel: number;
}
export declare class AtemAudioState {
    numberOfChannels: number;
    hasMonitor: boolean;
    channels: Array<AudioChannel>;
    master: AudioChannel;
    getMe(index: number): AudioChannel;
}
