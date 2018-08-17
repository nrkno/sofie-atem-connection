"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class DownstreamKeyMaskCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CDsM';
    }
    serialize() {
        const buffer = Buffer.alloc(12);
        buffer[0] = this.flag;
        buffer[1] = this.downstreamKeyerId;
        buffer[2] = this.properties.enabled ? 1 : 0;
        buffer.writeInt16BE(this.properties.top, 4);
        buffer.writeInt16BE(this.properties.bottom, 6);
        buffer.writeInt16BE(this.properties.left, 8);
        buffer.writeInt16BE(this.properties.right, 10);
        return Buffer.concat([Buffer.from('CDsM', 'ascii'), buffer]);
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
}
DownstreamKeyMaskCommand.MaskFlags = {
    enabled: 1 << 0,
    top: 1 << 1,
    bottom: 1 << 2,
    left: 1 << 3,
    right: 1 << 4
};
exports.DownstreamKeyMaskCommand = DownstreamKeyMaskCommand;
//# sourceMappingURL=DownstreamKeyMaskCommand.js.map