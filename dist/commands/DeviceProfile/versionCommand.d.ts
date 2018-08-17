/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
import { VersionProps } from '../../state/info';
export declare class VersionCommand extends AbstractCommand {
    rawName: string;
    properties: VersionProps;
    updateProps(newProps: Partial<VersionProps>): void;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
