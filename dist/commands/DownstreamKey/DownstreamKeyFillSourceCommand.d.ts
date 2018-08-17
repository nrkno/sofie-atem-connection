/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DownstreamKeyFillSourceCommand extends AbstractCommand {
    rawName: string;
    downstreamKeyerId: number;
    properties: {
        input: number;
    };
    serialize(): Buffer;
    updateProps(newProps: {
        input: number;
    }): void;
}
