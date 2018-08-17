/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { MacroAction } from '../../enums';
export declare class MacroActionCommand extends AbstractCommand {
    rawName: string;
    index: number;
    properties: {
        action: MacroAction;
    };
    deserialize(): void;
    serialize(): Buffer;
    applyToState(): void;
}
