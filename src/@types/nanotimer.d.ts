/// <reference types="node" />

declare module 'nanotimer' {
    namespace NanoTimer {
        interface TimeoutResults {
            waitTime: number
        }
    }

    class NanoTimer {
        constructor(log?: boolean)
        setTimeout(task: (...args: any[]) => void, args: any[], timeout: string, callback?: (results: NanoTimer.TimeoutResults) => void): void
        clearTimeout(): void
        setInterval(task: (...args: any[]) => void, args: any[], interval: string, callback?: (error: Error) => void): void
        clearInterval(): void
        time(task: (cb: () => void) => void, args: string | any[], interval: string, callback?: (error: Error) => void): number
        hasTimeout(): boolean
    }

    export = NanoTimer
}
