"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DownstreamKeyRateCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CDsR';
    }
    serialize() {
        const buffer = Buffer.alloc(4);
        buffer[0] = this.downstreamKeyerId;
        buffer[1] = this.properties.rate;
        return Buffer.concat([Buffer.from('CDsR', 'ascii'), buffer]);
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
}
exports.DownstreamKeyRateCommand = DownstreamKeyRateCommand;
//# sourceMappingURL=DownstreamKeyRateCommand.js.map