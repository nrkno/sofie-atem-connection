"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commands = require("../commands");
class CommandParser {
    constructor() {
        this.commands = {};
        for (const cmd in Commands) {
            try {
                const rawName = new Commands[cmd]().rawName;
                this.commands[rawName] = Commands[cmd];
            }
            catch (e) {
                // wwwwhatever
            }
        }
    }
    commandFromRawName(name) {
        if (this.commands[name]) {
            // we instantiate a class based on the raw command name
            return new this.commands[name]();
            // return Object.create((this.commands as any)[name]['prototype'])
        }
        return undefined;
    }
}
exports.CommandParser = CommandParser;
//# sourceMappingURL=atemCommandParser.js.map