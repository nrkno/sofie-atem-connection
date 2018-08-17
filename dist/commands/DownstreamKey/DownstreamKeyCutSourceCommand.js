"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DownstreamKeyCutSourceCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CDsC';
    }
    serialize() {
        const buffer = Buffer.alloc(4);
        buffer[0] = this.downstreamKeyerId;
        buffer.writeUInt16BE(this.properties.input, 2);
        return Buffer.concat([Buffer.from('CDsC', 'ascii'), buffer]);
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
}
exports.DownstreamKeyCutSourceCommand = DownstreamKeyCutSourceCommand;
//# sourceMappingURL=DownstreamKeyCutSourceCommand.js.map