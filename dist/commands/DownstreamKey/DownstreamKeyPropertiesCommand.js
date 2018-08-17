"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DownstreamKeyPropertiesCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'DskP';
    }
    deserialize(rawCommand) {
        this.downstreamKeyerId = rawCommand[0];
        this.properties = {
            tie: rawCommand[1] === 1,
            rate: rawCommand[2],
            preMultiply: rawCommand[3] === 1,
            clip: rawCommand.readUInt16BE(4),
            gain: rawCommand.readUInt16BE(6),
            invert: rawCommand[8] === 1,
            mask: {
                enabled: rawCommand[9] === 1,
                top: rawCommand.readInt16BE(10),
                bottom: rawCommand.readInt16BE(12),
                left: rawCommand.readInt16BE(14),
                right: rawCommand.readInt16BE(16)
            }
        };
    }
    applyToState(state) {
        state.video.getDownstreamKeyer(this.downstreamKeyerId).properties = this.properties;
    }
}
exports.DownstreamKeyPropertiesCommand = DownstreamKeyPropertiesCommand;
//# sourceMappingURL=DownstreamKeyPropertiesCommand.js.map