"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class TopologyCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = '_top';
    }
    deserialize(rawCommand) {
        this.properties = {
            MEs: rawCommand[0],
            sources: rawCommand[1],
            colorGenerators: rawCommand[2],
            auxilliaries: rawCommand[3],
            talkbackOutputs: rawCommand[4],
            mediaPlayers: rawCommand[5],
            serialPorts: rawCommand[6],
            maxHyperdecks: rawCommand[7],
            DVEs: rawCommand[8],
            stingers: rawCommand[9],
            hasSuperSources: rawCommand[10] === 1
        };
    }
    applyToState(state) {
        state.info.capabilities = Object.assign({}, state.info.capabilities, this.properties);
    }
}
exports.TopologyCommand = TopologyCommand;
//# sourceMappingURL=topologyCommand.js.map