"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class MediaPoolClearClipCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CMPC';
    }
    serialize() {
        const rawCommand = 'CMPC';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.properties.index,
            0x00,
            0x00,
            0x00
        ]);
    }
    updateProps(props) {
        this._updateProps(props);
    }
}
exports.MediaPoolClearClipCommand = MediaPoolClearClipCommand;
//# sourceMappingURL=MediaPoolClearClipCommand.js.map