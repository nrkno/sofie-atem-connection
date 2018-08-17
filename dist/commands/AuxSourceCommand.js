"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("./AbstractCommand");
class AuxSourceCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'AuxS';
    }
    deserialize(rawCommand) {
        this.auxBus = rawCommand[0];
        this.properties = {
            source: rawCommand.readUInt16BE(2)
        };
    }
    serialize() {
        const rawCommand = 'CAuS';
        return new Buffer([
            ...Buffer.from(rawCommand),
            0x01,
            this.auxBus,
            this.properties.source >> 8,
            this.properties.source & 0xFF
        ]);
    }
    applyToState(state) {
        state.video.auxilliaries[this.auxBus] = this.properties.source;
    }
}
exports.AuxSourceCommand = AuxSourceCommand;
//# sourceMappingURL=AuxSourceCommand.js.map