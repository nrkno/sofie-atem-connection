export class NodeBoilerpate {
	constructor (private someData: string) {}
	public inverse () {
		return this.someData.split('').reverse().join('')
	}
}
