/// <reference types="node" />
import { AtemState } from '../state';
export default abstract class AbstractCommand {
    static MaskFlags?: {
        [key: string]: number;
    };
    abstract rawName: string;
    packetId: number;
    flag: number;
    resolve: (cmd: AbstractCommand) => void;
    reject: (cmd: AbstractCommand) => void;
    abstract properties: any;
    deserialize?(rawCommand: Buffer): void;
    serialize?(): Buffer;
    applyToState?(state: AtemState): void;
    updateProps(newProps: object): void;
    protected _updateProps(newProps: Object): void;
}
