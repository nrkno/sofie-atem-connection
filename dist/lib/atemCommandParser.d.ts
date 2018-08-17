import AbstractCommand from '../commands/AbstractCommand';
export declare class CommandParser {
    commands: {
        [key: string]: AbstractCommand;
    };
    constructor();
    commandFromRawName(name: string): AbstractCommand | undefined;
}
