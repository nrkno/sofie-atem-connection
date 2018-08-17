"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DownstreamKeyOnAirCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CDsL';
    }
    deserialize() {
        // nothing
    }
    serialize() {
        const rawCommand = 'CDsL';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.downstreamKeyId,
            this.properties.onAir,
            0x00, 0x00
        ]);
    }
    applyToState() {
        // nothing
    }
}
exports.DownstreamKeyOnAirCommand = DownstreamKeyOnAirCommand;
//# sourceMappingURL=DownstreamKeyOnAirCommand.js.map