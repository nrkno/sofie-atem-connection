/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
import { SuperSourceBox } from '../../state/video';
export declare class SuperSourceBoxParametersCommand extends AbstractCommand {
    static MaskFlags: {
        enabled: number;
        source: number;
        x: number;
        y: number;
        size: number;
        cropped: number;
        cropTop: number;
        cropBottom: number;
        cropLeft: number;
        cropRight: number;
    };
    rawName: string;
    boxId: number;
    properties: SuperSourceBox;
    updateProps(newProps: Partial<SuperSourceBox>): void;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
