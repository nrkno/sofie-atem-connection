"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class MediaPlayerStatusCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'RCPS';
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    deserialize(rawCommand) {
        this.mediaPlayerId = rawCommand[0];
        this.properties = {
            playing: rawCommand[1] === 1,
            loop: rawCommand[2] === 1,
            atBeginning: rawCommand[3] === 1,
            clipFrame: rawCommand[4] << 8 | (rawCommand[5])
        };
    }
    serialize() {
        const rawCommand = 'SCPS';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.flag,
            this.mediaPlayerId,
            this.properties.playing,
            this.properties.loop,
            this.properties.atBeginning,
            0x00,
            this.properties.clipFrame >> 8,
            this.properties.clipFrame & 0xFF
        ]);
    }
    applyToState(state) {
        state.media.players[this.mediaPlayerId] = Object.assign({}, state.media.players[this.mediaPlayerId], this.properties);
    }
}
MediaPlayerStatusCommand.MaskFlags = {
    playing: 1 << 0,
    loop: 1 << 1,
    atBeginning: 1 << 2,
    frame: 1 << 3
};
exports.MediaPlayerStatusCommand = MediaPlayerStatusCommand;
//# sourceMappingURL=MediaPlayerStatusCommand.js.map