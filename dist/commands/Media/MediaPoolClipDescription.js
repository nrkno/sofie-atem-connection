"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
const atemUtil_1 = require("../../lib/atemUtil");
class MediaPoolClipDescriptionCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'MPCS';
    }
    deserialize(rawCommand) {
        this.mediaPool = rawCommand[0];
        this.properties = {
            isUsed: rawCommand[1] === 1,
            name: atemUtil_1.Util.bufToNullTerminatedString(rawCommand, 2, 64),
            frameCount: rawCommand.readUInt16BE(66),
            frames: []
        };
    }
    applyToState(state) {
        const newProps = Object.assign({}, this.properties);
        if (state.media.clipPool[this.mediaPool - 1]) {
            newProps.frames = state.media.clipPool[this.mediaPool - 1].frames;
        }
        state.media.clipPool[this.mediaPool - 1] = newProps;
    }
}
exports.MediaPoolClipDescriptionCommand = MediaPoolClipDescriptionCommand;
//# sourceMappingURL=MediaPoolClipDescription.js.map