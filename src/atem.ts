import { EventEmitter } from 'events'
import { Util } from './lib/atemUtil'
import { AtemState, MixEffect, AudioChannel } from './lib/atemState'
import { AtemSocket } from './lib/atemSocket'

export enum Model {
	TVS = 0x01,
	OneME = 0x02,
	TwoME = 0x03,
	PS4K = 0x04,
	OneME4K = 0x05,
	TwoME4K = 0x06,
	TwoMEBS4K = 0x07,
	TVSHD = 0x08
}

export enum TransitionStyle {
	MIX = 0x00,
	DIP = 0x01,
	WIPE = 0x02,
	DVE = 0x03,
	STING = 0x04
}

export enum TallyState {
	None = 0x00,
	Program = 0x01,
	Preview = 0x02
}

export interface AtemOptions {
	localPort?: number,
	debug?: boolean,
	externalLog?: (arg0?: any,arg1?: any,arg2?: any,arg3?: any) => void
}

export class Atem extends EventEmitter {
	DEFAULT_PORT = 9910
	RECONNECT_INTERVAL = 5000
	DEBUG = false

	AUDIO_GAIN_RATE = 65381

	event: EventEmitter
	state: AtemState
	private socket: AtemSocket
	private _log: (arg0?: any,arg1?: any,arg2?: any,arg3?: any) => void

	constructor (options: AtemOptions) {
		super()
		this.DEBUG = options.debug === undefined ? false : options.debug
		this._log = options.externalLog || function () { return }

		this.state = new AtemState()
		this.socket = new AtemSocket('172.10.10.240', 9910)
		this.socket.on('receivedStateChange', (name, buffer) => this._setStatus(name, buffer))
	}

	connect (address: string, port?: number) {
		this.socket.connect(address, port)
	}

	changeProgramInput (input: number, me = 0) {
		this.socket._sendCommand('CPgI', Buffer.from([me, 0x00, input >> 8, input & 0xFF]))
	}

	changePreviewInput (input: number, me = 0) {
		this.socket._sendCommand('CPvI', Buffer.from([me, 0x00, input >> 8, input & 0xFF]))
	}

	private _setStatus (name: string, buffer: Buffer) {
		// this.commandEvent.emit(name, null, buffer)

		if (name === '_ver' ) {
			this.state._ver0 = buffer[1]
			this.state._ver1 = buffer[3]
		} else if (name === '_pin') {
			this.state._pin = Util.parseString(buffer)
			this.state.model = buffer[40]
		} else if (name === '_top') {
			this.state.topology.numberOfMEs = buffer[0]
			this.state.topology.numberOfSources = buffer[1]
			this.state.topology.numberOfColorGenerators = buffer[2]
			this.state.topology.numberOfAUXs = buffer[3]
			this.state.topology.numberOfTalkbackOutputs = buffer[4]
			this.state.topology.numberOfMediaPlayers = buffer[5]
			this.state.topology.numberOfSerialPorts = buffer[6]
			this.state.topology.maxNumberOfHyperdecks = buffer[7]
			this.state.topology.numberOfDVEs = buffer[8]
			this.state.topology.numberOfStingers = buffer[9]
			this.state.topology.numberOfSuperSources = buffer[10]

			for (let me = 0; me <= this.state.topology.numberOfMEs; me++) {
				this._getME(buffer[0]).upstreamKeyState = []
				this._getME(buffer[0]).upstreamKeyNextState = []
			}
		} else if (name === '_MeC') {
			this._getME(buffer[0]).numberOfKeyers = buffer[1]
		} else if (name === 'InPr') {
			let channel = Util.parseNumber(buffer.slice(0, 2))
			this.state.channels[channel] = {
				name: Util.parseString(buffer.slice(2, 22)),
				label: Util.parseString(buffer.slice(22, 26))
			}
		} else if (name === 'PrgI') {
			this._getME(buffer[0]).programInput = Util.parseNumber(buffer.slice(2, 4))
		} else if (name === 'PrvI') {
			this._getME(buffer[0]).previewInput = Util.parseNumber(buffer.slice(2, 4))
		} else if (name === 'TrPr') {
			this._getME(buffer[0]).transitionPreview = buffer[1] > 0
		} else if (name === 'TrPs') {
			this._getME(buffer[0]).transitionPosition = Util.parseNumber(buffer.slice(4, 5)) / 10000 // 0 - 10000
			this._getME(buffer[0]).transitionFrameCount = buffer[2] // 0 - 30
		} else if (name === 'FtbS') { // Fade To Black Setting
			this._getME(buffer[0]).fadeToBlack = buffer[1] > 0
		} else if (name === 'TrSS') {
			this._getME(buffer[0]).transitionStyle = buffer[1]
			this._getME(buffer[0]).upstreamKeyNextBackground = (buffer[2] >> 0 & 1) === 0x01
			for (let i = 0; i <= this._getME(buffer[0]).numberOfKeyers; i++) {
				this._getME(buffer[0]).upstreamKeyNextState[i] = (buffer[2] >> (i + 1) & 1) === 0x01
			}
		} else if (name === 'KeOn') {
			this._getME(buffer[0]).upstreamKeyState[buffer[1]] = buffer[2] === 1
		} else if (name === 'DskS') {
			this.state.video.downstreamKeyOn[buffer[0]] = buffer[1] === 1
		} else if (name === 'DskP') {
			this.state.video.downstreamTie[buffer[0]] = buffer[1] === 1
		} else if (name === 'TlIn') { // Tally Input
			this.state.tallies = Util.bufferToArray(buffer.slice(2))
		} else if (name === 'AuxS') { // Auxilliary Setting
			let aux = buffer[0]
			this.state.video.auxilliaries[aux] = Util.parseNumber(buffer.slice(2, 3))
		} else if (name === '_AMC') { // Audio Mixer Config
			this.state.audio.numberOfChannels = buffer[0]
			this.state.audio.hasMonitor = buffer[1] === 1
		} else if (name === 'AMIP') { // Audio Monitor Input Position
			let channelIndex = Util.parseNumber(buffer.slice(0, 2))
			let channel = this._getAudioChannel(channelIndex)
			channel.on = buffer[8] === 1,
			(channel).afv = buffer[8] === 2,
			(channel).gain = Util.parseNumber(buffer.slice(10, 12)) / this.AUDIO_GAIN_RATE,
			(channel).rawGain = Util.parseNumber(buffer.slice(10, 12)),
			// 0xD8F0 - 0x0000 - 0x2710
			(channel).rawPan = Util.parseNumber(buffer.slice(12, 14))
			// 6922
		} else if (name === 'AMMO') { // Audio Monitor Master Output
			this.state.audio.master = {
				...this.state.audio.master,
				afv: buffer[4] === 1,
				gain: Util.parseNumber(buffer.slice(0, 2)) / this.AUDIO_GAIN_RATE,
				rawGain: Util.parseNumber(buffer.slice(0, 2))
			}
		} else if (name === 'AMLv') { // Audio Monitor Level
			let numberOfChannels = Util.parseNumber(buffer.slice(0, 2))
			let channelMappings = []
			let offset = 4

			// Master volume
			for (let i = 0; i < 2; i++) {
				let leftGain = Util.parseNumber(buffer.slice(offset + 1, offset + 4))
				let rightGain = Util.parseNumber(buffer.slice(offset + 5, offset + 8))
				this.state.audio.master = {
					...this.state.audio.master,
					leftLevel: leftGain / 8388607,
					rightLevel: rightGain / 8388607
				}
				offset += 16
			}

			// Channel Mapping
			for (let i = 0; i <= numberOfChannels; i++) {
				channelMappings.push(buffer[offset] << 8 | buffer[offset + 1])
				offset += 2
			}

			// Channels volume
			for (let i = 0; i <= numberOfChannels; i++) {
				let leftGain = Util.parseNumber(buffer.slice(offset + 1, offset + 4))
				let rightGain = Util.parseNumber(buffer.slice(offset + 5, offset + 8))
				this._getAudioChannel(channelMappings[i]).leftLevel = leftGain / 8388607
				this._getAudioChannel(channelMappings[i]).rightLevel = rightGain / 8388607
				offset += 16
			}
		}
	}

	private _getME (index: number): MixEffect {
		if (!this.state.video.ME[index]) {
			let ME = new MixEffect()
			this.state.video.ME[index] = ME
		}
		return this.state.video.ME[index]
	}

	private _getAudioChannel (index: number): AudioChannel {
		if (!this.state.audio.channels[index]) {
			let ME = new AudioChannel()
			this.state.audio.channels[index] = ME
		}
		return this.state.audio.channels[index]
	}
}
