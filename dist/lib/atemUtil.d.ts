/// <reference types="node" />
import { Enums } from '..';
export declare namespace Util {
    function stringToBytes(str: string): Array<number>;
    function bufToNullTerminatedString(buffer: Buffer, start: number, length: number): string;
    const COMMAND_CONNECT_HELLO: Buffer;
    const COMMAND_CONNECT_HELLO_ANSWER: Buffer;
    /**
     * @todo: BALTE - 2018-5-24:
     * Create util functions that handle proper colour spaces in UHD.
     */
    function convertRGBAToYUV422(width: number, height: number, data: Buffer): Buffer;
    function getResolution(videoMode: Enums.VideoMode): number[];
}
