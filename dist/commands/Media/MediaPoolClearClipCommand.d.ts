/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class MediaPoolClearClipCommand extends AbstractCommand {
    rawName: string;
    properties: {
        index: number;
    };
    serialize(): Buffer;
    updateProps(props: {
        index: number;
    }): void;
}
