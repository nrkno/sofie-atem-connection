"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info_1 = require("./info");
const video_1 = require("./video");
const audio_1 = require("./audio");
const media_1 = require("./media");
class AtemState {
    constructor() {
        this.info = new info_1.DeviceInfo();
        this.settings = {
            videoMode: 0
        };
        this.video = new video_1.AtemVideoState();
        this.channels = [];
        this.tallies = [];
        this.audio = new audio_1.AtemAudioState();
        this.media = new media_1.MediaState();
        this.inputs = [];
    }
}
exports.AtemState = AtemState;
//# sourceMappingURL=index.js.map