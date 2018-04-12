export interface IAbstractCommand {
	rawName: string

	deserialize: (rawCommand: Buffer) => void
	serialize: () => Buffer
	getAttributes: () => any
}

export default class AbstractCommand implements IAbstractCommand {
	rawName: string

	deserialize: (rawCommand: Buffer) => void
	serialize: () => Buffer
	getAttributes: () => any
}
