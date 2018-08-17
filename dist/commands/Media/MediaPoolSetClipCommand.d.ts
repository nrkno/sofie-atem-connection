/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
export declare class MediaPoolSetClipCommand extends AbstractCommand {
    rawName: string;
    properties: {
        index: number;
        name: string;
        frames: number;
    };
    serialize(): Buffer;
    updateProps(props: {
        index: number;
        name: string;
        frames: number;
    }): void;
}
