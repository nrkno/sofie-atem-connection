"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DownstreamKeyAutoCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'DDsA';
    }
    deserialize() {
        // nothing
    }
    serialize() {
        const rawCommand = 'DDsA';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.downstreamKeyId,
            0x00, 0x00, 0x00
        ]);
    }
    applyToState() {
        // nothing
    }
}
exports.DownstreamKeyAutoCommand = DownstreamKeyAutoCommand;
//# sourceMappingURL=DownstreamKeyAutoCommand.js.map