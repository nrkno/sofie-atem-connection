"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractCommand {
    constructor() {
        this.flag = 0;
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    _updateProps(newProps) {
        this.properties = Object.assign({}, this.properties, newProps);
        const maskFlags = this.constructor.MaskFlags;
        if (maskFlags) {
            for (const key in newProps) {
                if (key in maskFlags) {
                    this.flag = this.flag | maskFlags[key];
                }
            }
        }
    }
}
exports.default = AbstractCommand;
//# sourceMappingURL=AbstractCommand.js.map