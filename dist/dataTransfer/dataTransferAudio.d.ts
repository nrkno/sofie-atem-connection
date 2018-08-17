import DataTransferFrame from './dataTransferFrame';
export default class DataTransferAudio extends DataTransferFrame {
    description: {
        name: string;
    };
    start(): void;
    sendDescription(): void;
}
