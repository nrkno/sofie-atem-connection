"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
const atemUtil_1 = require("../../lib/atemUtil");
class MediaPoolFrameDescriptionCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'MPfe';
    }
    deserialize(rawCommand) {
        this.mediaPool = rawCommand[0];
        this.frameIndex = rawCommand.readUInt16BE(2);
        this.properties = {
            isUsed: rawCommand[4] === 1,
            hash: atemUtil_1.Util.bufToNullTerminatedString(rawCommand, 5, 16),
            fileName: atemUtil_1.Util.bufToNullTerminatedString(rawCommand, 24, rawCommand[23])
        };
    }
    applyToState(state) {
        if (this.mediaPool === 0) {
            state.media.stillPool[this.frameIndex] = this.properties;
        }
        else if (this.mediaPool < 3) {
            state.media.clipPool[this.mediaPool - 1].frames[this.frameIndex] = this.properties;
        }
    }
}
exports.MediaPoolFrameDescriptionCommand = MediaPoolFrameDescriptionCommand;
//# sourceMappingURL=MediaPoolFrameDescription.js.map