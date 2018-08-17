"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class MediaPoolClearStillCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'CSTL';
    }
    serialize() {
        const rawCommand = 'CSTL';
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
exports.MediaPoolClearStillCommand = MediaPoolClearStillCommand;
//# sourceMappingURL=MediaPoolClearStillCommand.js.map