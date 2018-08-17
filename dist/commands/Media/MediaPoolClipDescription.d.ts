/// <reference types="node" />
import { AtemState } from '../../state';
import { ClipBank } from '../../state/media';
import AbstractCommand from '../AbstractCommand';
export declare class MediaPoolClipDescriptionCommand extends AbstractCommand {
    rawName: string;
    mediaPool: number;
    properties: ClipBank;
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
