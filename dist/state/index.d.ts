import { DeviceInfo } from './info';
import { AtemVideoState } from './video';
import { AtemAudioState } from './audio';
import { MediaState } from './media';
import { InputChannel } from './input';
export declare class AtemState {
    info: DeviceInfo;
    settings: {
        videoMode: number;
    };
    video: AtemVideoState;
    channels: Array<{
        name: string;
        label: string;
    }>;
    tallies: Array<number>;
    audio: AtemAudioState;
    media: MediaState;
    inputs: Array<InputChannel>;
}
