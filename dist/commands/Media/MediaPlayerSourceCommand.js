"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class MediaPlayerSourceCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'MPCE';
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    deserialize(rawCommand) {
        this.mediaPlayerId = rawCommand[0];
        this.properties = {
            sourceType: rawCommand[1],
            stillIndex: rawCommand[2],
            clipIndex: rawCommand[3]
        };
    }
    serialize() {
        const rawCommand = 'MPSS';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.flag,
            this.mediaPlayerId,
            this.properties.sourceType,
            this.properties.stillIndex,
            this.properties.clipIndex,
            0x00,
            0x00,
            0x00
        ]);
    }
    applyToState(state) {
        state.media.players[this.mediaPlayerId] = Object.assign({}, state.media.players[this.mediaPlayerId], this.properties);
    }
}
MediaPlayerSourceCommand.MaskFlags = {
    sourceType: 1 << 0,
    stillIndex: 1 << 1,
    clipIndex: 1 << 2
};
exports.MediaPlayerSourceCommand = MediaPlayerSourceCommand;
//# sourceMappingURL=MediaPlayerSourceCommand.js.map