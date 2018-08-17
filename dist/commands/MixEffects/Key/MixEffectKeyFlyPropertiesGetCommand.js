"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
class MixEffectKeyFlyPropertiesGetCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'KeFS';
    }
    deserialize(rawCommand) {
        this.mixEffect = rawCommand[0];
        this.upstreamKeyerId = rawCommand[1];
        this.properties = {
            isASet: rawCommand[2] === 1,
            isBSet: rawCommand[3] === 1,
            isAtKeyFrame: rawCommand[6],
            runToInfiniteIndex: rawCommand[7]
        };
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId);
        upstreamKeyer.flyProperties = Object.assign({}, this.properties);
    }
}
exports.MixEffectKeyFlyPropertiesGetCommand = MixEffectKeyFlyPropertiesGetCommand;
//# sourceMappingURL=MixEffectKeyFlyPropertiesGetCommand.js.map