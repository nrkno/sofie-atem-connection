"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AudioChannel {
}
exports.AudioChannel = AudioChannel;
class AtemAudioState {
    constructor() {
        this.channels = [];
        this.master = new AudioChannel();
    }
    getMe(index) {
        if (!this.channels[index]) {
            this.channels[index] = new AudioChannel();
        }
        return this.channels[index];
    }
}
exports.AtemAudioState = AtemAudioState;
//# sourceMappingURL=audio.js.map