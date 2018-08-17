/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
import { Enums } from '../..';
export declare class VideoModeCommand extends AbstractCommand {
    rawName: string;
    auxBus: number;
    properties: {
        mode: Enums.VideoMode;
    };
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
