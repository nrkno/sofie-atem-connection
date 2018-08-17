"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class MediaPoolSetClipCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'SMPC';
    }
    serialize() {
        const buffer = new Buffer(68);
        buffer[0] = 3;
        buffer[1] = this.properties.index;
        buffer.write(this.properties.name, 2, 44);
        buffer.writeUInt16BE(this.properties.frames, 66);
        return Buffer.concat([Buffer.from('SMPC', 'ascii'), buffer]);
    }
    updateProps(props) {
        this._updateProps(props);
    }
}
exports.MediaPoolSetClipCommand = MediaPoolSetClipCommand;
//# sourceMappingURL=MediaPoolSetClipCommand.js.map