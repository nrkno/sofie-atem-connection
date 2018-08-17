import DataTransferFrame from './dataTransferFrame';
export default class DataTransferStill extends DataTransferFrame {
    description: {
        name: string;
        description: string;
    };
    sendDescription(): void;
}
