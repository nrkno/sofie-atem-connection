"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DownstreamKeySourcesCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'DskB';
    }
    deserialize(rawCommand) {
        this.downstreamKeyerId = rawCommand[0];
        this.properties = {
            fillSource: rawCommand.readInt16BE(2),
            cutSource: rawCommand.readInt16BE(4)
        };
    }
    applyToState(state) {
        state.video.getDownstreamKeyer(this.downstreamKeyerId).sources = this.properties;
    }
}
exports.DownstreamKeySourcesCommand = DownstreamKeySourcesCommand;
//# sourceMappingURL=DownstreamKeySourcesCommand.js.map