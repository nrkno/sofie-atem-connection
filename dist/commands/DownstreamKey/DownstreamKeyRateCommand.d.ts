/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class DownstreamKeyRateCommand extends AbstractCommand {
    rawName: string;
    downstreamKeyerId: number;
    properties: {
        rate: number;
    };
    serialize(): Buffer;
    updateProps(newProps: {
        rate: number;
    }): void;
}
