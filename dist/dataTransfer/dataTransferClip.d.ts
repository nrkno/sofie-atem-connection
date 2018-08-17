import { Commands } from '..';
import DataTransfer from './dataTransfer';
import DataTransferFrame from './dataTransferFrame';
export default class DataTransferClip extends DataTransfer {
    clipIndex: number;
    frames: Array<DataTransferFrame>;
    curFrame: number;
    description: {
        name: string;
    };
    start(): void;
    handleCommand(command: Commands.AbstractCommand): void;
    readonly transferId: number;
    gotLock(): void;
}
