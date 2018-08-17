"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DownstreamKeyStateCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'DskS';
    }
    deserialize(rawCommand) {
        this.downstreamKeyId = rawCommand[0];
        this.properties = {
            onAir: rawCommand[1] === 1,
            inTransition: rawCommand[2] === 1,
            isAuto: rawCommand[3] === 1,
            remainingFrames: rawCommand[4]
        };
    }
    serialize() {
        // TODO(Lange - 2018-04-26): Commands such as this one don't have a corresponding serialize companion.
        // Perhaps we should restructure the code to make commands like this less awkward, and avoid
        // needing to define a stub serialize method.
        return new Buffer(0);
    }
    applyToState(state) {
        state.video.downstreamKeyers[this.downstreamKeyId] = Object.assign({}, this.properties, state.video.downstreamKeyers[this.downstreamKeyId]);
    }
}
exports.DownstreamKeyStateCommand = DownstreamKeyStateCommand;
//# sourceMappingURL=DownstreamKeyStateCommand.js.map