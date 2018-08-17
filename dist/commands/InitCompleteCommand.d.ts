import AbstractCommand from './AbstractCommand';
export declare class InitCompleteCommand extends AbstractCommand {
    rawName: string;
    downstreamKeyId: number;
    properties: null;
    deserialize(): void;
    applyToState(): void;
}
