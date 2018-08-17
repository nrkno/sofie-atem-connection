"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MediaState {
    constructor() {
        this.stillPool = [];
        this.clipPool = [];
        this.players = [];
    }
}
exports.MediaState = MediaState;
class StillFrame {
}
exports.StillFrame = StillFrame;
class ClipBank {
    constructor() {
        this.frames = [];
    }
}
exports.ClipBank = ClipBank;
//# sourceMappingURL=media.js.map