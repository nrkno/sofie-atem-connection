/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { DownstreamKeyerGeneral } from '../../state/video/downstreamKeyers';
export declare class DownstreamKeyGeneralCommand extends AbstractCommand {
    static MaskFlags: {
        preMultiply: number;
        clip: number;
        gain: number;
        invert: number;
    };
    rawName: string;
    downstreamKeyerId: number;
    properties: DownstreamKeyerGeneral;
    serialize(): Buffer;
    updateProps(newProps: Partial<DownstreamKeyerGeneral>): void;
}
