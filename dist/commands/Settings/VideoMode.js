"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class VideoModeCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'VidM';
    }
    deserialize(rawCommand) {
        this.properties = {
            mode: rawCommand[0]
        };
    }
    serialize() {
        const buffer = Buffer.alloc(4);
        buffer[0] = this.properties.mode;
        return Buffer.concat([Buffer.from('CVdM', 'ascii'), buffer]);
    }
    applyToState(state) {
        state.settings.videoMode = this.properties.mode;
    }
}
exports.VideoModeCommand = VideoModeCommand;
//# sourceMappingURL=VideoMode.js.map