"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class VersionCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = '_ver';
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    deserialize(rawCommand) {
        this.properties = {
            major: rawCommand[1],
            minor: rawCommand[3]
        };
    }
    serialize() {
        return new Buffer(0);
    }
    applyToState(state) {
        state.info.apiVersion = Object.assign({}, this.properties);
    }
}
exports.VersionCommand = VersionCommand;
//# sourceMappingURL=versionCommand.js.map