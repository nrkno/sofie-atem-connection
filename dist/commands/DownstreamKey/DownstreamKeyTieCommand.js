"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DownstreamKeyTieCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CDsT';
    }
    deserialize() {
        // nothing
    }
    serialize() {
        const rawCommand = 'CDsT';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.downstreamKeyId,
            this.properties.tie,
            0x00, 0x00
        ]);
    }
    applyToState() {
        // nothing
    }
}
exports.DownstreamKeyTieCommand = DownstreamKeyTieCommand;
//# sourceMappingURL=DownstreamKeyTieCommand.js.map