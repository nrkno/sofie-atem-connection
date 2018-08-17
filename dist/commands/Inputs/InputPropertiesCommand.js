"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
const enums_1 = require("../../enums");
const atemUtil_1 = require("../../lib/atemUtil");
class InputPropertiesCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'InPr';
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    deserialize(rawCommand) {
        this.inputId = rawCommand.readUInt16BE(0);
        const externalPortsMask = rawCommand[29];
        const externalPorts = [];
        if (externalPortsMask & enums_1.ExternalPorts.SDI) {
            externalPorts.push(enums_1.ExternalPortType.SDI);
        }
        if (externalPortsMask & enums_1.ExternalPorts.HDMI) {
            externalPorts.push(enums_1.ExternalPortType.HDMI);
        }
        if (externalPortsMask & enums_1.ExternalPorts.Component) {
            externalPorts.push(enums_1.ExternalPortType.Component);
        }
        if (externalPortsMask & enums_1.ExternalPorts.Composite) {
            externalPorts.push(enums_1.ExternalPortType.Composite);
        }
        if (externalPortsMask & enums_1.ExternalPorts.SVideo) {
            externalPorts.push(enums_1.ExternalPortType.SVideo);
        }
        this.properties = {
            inputId: rawCommand.readUInt16BE(0),
            longName: atemUtil_1.Util.bufToNullTerminatedString(rawCommand, 2, 20),
            shortName: atemUtil_1.Util.bufToNullTerminatedString(rawCommand, 22, 4),
            externalPorts: externalPorts.length > 0 ? externalPorts : null,
            isExternal: rawCommand[28] === 0,
            externalPortType: rawCommand.readUInt8(31),
            internalPortType: rawCommand.readUInt8(32),
            sourceAvailability: rawCommand.readUInt8(34),
            meAvailability: rawCommand.readUInt8(35)
        };
    }
    serialize() {
        const buffer = Buffer.alloc(32);
        buffer.writeUInt8(this.flag, 0);
        buffer.writeUInt16BE(this.inputId, 2);
        buffer.write(this.properties.longName || '', 4);
        buffer.write(this.properties.shortName || '', 24);
        buffer.writeUInt16BE(this.properties.externalPortType, 28);
        return Buffer.concat([Buffer.from('CInL', 'ascii'), buffer]);
    }
    applyToState(state) {
        // @TODO(Lange - 04/30/2018): We may need something to clean up inputs which
        // don't exist anymore, which can happen when switching the connection from
        // one model of ATEM to another.
        state.inputs[this.inputId] = Object.assign({}, this.properties);
    }
}
InputPropertiesCommand.MaskFlags = {
    longName: 1 << 0,
    shortName: 1 << 1,
    isExternal: 1 << 2
};
exports.InputPropertiesCommand = InputPropertiesCommand;
//# sourceMappingURL=InputPropertiesCommand.js.map