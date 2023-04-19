import { AtemState } from '../state'
import { ProtocolVersion } from '../enums'
import { Camera } from '../state/camera'
import { DeserializedCommand } from './CommandBase'
//import { DeserializedCommand, WritableCommand } from './CommandBase'

/*
export class CameraControlCommand extends WritableCommand<Camera> {
	public static readonly rawName = 'CCmd'
	public static readonly minimumVersion = ProtocolVersion.V7_2
	public readonly cameraID: number
	public readonly update: Camera
	public readonly isRel: boolean

	constructor(cameraID: number, update: Camera, isRel: boolean | false) {
		super();

		this.cameraID = cameraID;
		this.update = update;
		this.isRel = isRel;
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(24).fill(0);


		buffer.writeUInt8(this.cameraID, 0);

		//Switch by what we need to update
		switch(this.update.command) {
			case "iris": {
				if(this.update.iris !== undefined) {
					buffer.writeUInt8(0, 1);
					buffer.writeUInt8(2, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4);
					buffer.writeUInt8(0x01, 9);
					buffer.writeInt16BE(((1.0 - this.update.iris) * 15360) + 3072, 16);
					return buffer;
				}
				break;
			}
			case "autoIris": {
				if(this.update.autoIris !== undefined) {
					buffer.writeUInt8(0, 1);
					buffer.writeUInt8(5, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					return buffer;
				}
				break;
			}
			case "focus": {
				if(this.update.focus !== undefined) {
					buffer.writeUInt8(0, 1);
					buffer.writeUInt8(0, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4); //Not sure if this is correct
					buffer.writeUInt8(0x01, 9);
					buffer.writeUInt16BE(this.update.focus * 65535, 16);
					return buffer;
				}
				break;
			}
			case "autoFocus": {
				if(this.update.autoFocused !== undefined) {
					buffer.writeUInt8(0, 1);
					buffer.writeUInt8(1, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					return buffer;
				}
				break;
			}
			case "zoomPosition": {
				if(this.update.zoomPosition !== undefined) {
					buffer.writeUInt8(0, 1);
					buffer.writeUInt8(8, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4);
					buffer.writeUInt8(0x01, 9);
					buffer.writeInt16BE(this.update.zoomPosition * 2048, 16);
					return buffer;
				}
				break;
			}
			case "zoomSpeed": {
				if(this.update.zoomSpeed !== undefined) {
					buffer.writeUInt8(0, 1);
					buffer.writeUInt8(9, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4);
					buffer.writeUInt8(0x01, 9);
					buffer.writeInt16BE(this.update.zoomSpeed * 2048, 16);
					return buffer;
				}
				break;
			}
			case "whiteBalance": {
				// if(this.update.iris !== undefined) {
				// 	buffer.writeUInt8(0, 1);
				// 	buffer.writeUInt8(2, 2);
				// 	buffer.writeUInt8(this.isRel ? 1:0, 3);
				// 	buffer.writeUInt8(0x80, 4);
				// 	buffer.writeUInt8(0x01, 9);
				// 	buffer.writeInt16BE(((1.0 - this.update.iris) * 15360) + 3072, 16);
				// 	return buffer;
				// }
				break;
			}
			case "shutter": {
				// if(this.update.iris !== undefined) {
				// 	buffer.writeUInt8(0, 1);
				// 	buffer.writeUInt8(2, 2);
				// 	buffer.writeUInt8(this.isRel ? 1:0, 3);
				// 	buffer.writeUInt8(0x80, 4);
				// 	buffer.writeUInt8(0x01, 9);
				// 	buffer.writeInt16BE(((1.0 - this.update.iris) * 15360) + 3072, 16);
				// 	return buffer;
				// }
				break;
			}
			case "liftRGBY": {
				if(this.update.liftRGBY !== undefined) {
					buffer.writeUInt8(8, 1);
					buffer.writeUInt8(0, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4);
					buffer.writeUInt8(0x04, 9);
					buffer.writeInt16BE(this.update.liftRGBY[0] * 4096, 16);
					buffer.writeInt16BE(this.update.liftRGBY[1] * 4096, 18);
					buffer.writeInt16BE(this.update.liftRGBY[2] * 4096, 20);
					buffer.writeInt16BE(this.update.liftRGBY[3] * 4096, 22);
					return buffer;
				}
				break;
			}
			case "gammaRGBY": {
				if(this.update.gammaRGBY !== undefined) {
					buffer.writeUInt8(8, 1);
					buffer.writeUInt8(1, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4);
					buffer.writeUInt8(0x04, 9);
					buffer.writeInt16BE(this.update.gammaRGBY[0] * 8192, 16);
					buffer.writeInt16BE(this.update.gammaRGBY[1] * 8192, 18);
					buffer.writeInt16BE(this.update.gammaRGBY[2] * 8192, 20);
					buffer.writeInt16BE(this.update.gammaRGBY[3] * 8192, 22);
					return buffer;
				}
				break;
			}
			case "gainRGBY": {
				if(this.update.gainRGBY !== undefined) {
					buffer.writeUInt8(8, 1);
					buffer.writeUInt8(2, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4);
					buffer.writeUInt8(0x04, 9);
					buffer.writeInt16BE(this.update.gainRGBY[0] * 2047.9375, 16);
					buffer.writeInt16BE(this.update.gainRGBY[1] * 2047.9375, 18);
					buffer.writeInt16BE(this.update.gainRGBY[2] * 2047.9375, 20);
					buffer.writeInt16BE(this.update.gainRGBY[3] * 2047.9375, 22);
					return buffer;
				}
				break;
			}
			case "contrast": {
				if(this.update.contrast !== undefined) {
					buffer.writeUInt8(8, 1);
					buffer.writeUInt8(4, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4);
					buffer.writeUInt8(0x02, 9);
					buffer.writeUInt16BE(this.update.contrast * 4096, 18);
					return buffer;
				}
				break;
			}
			case "lumMix": {
				if(this.update.lumMix !== undefined) {
					buffer.writeUInt8(8, 1);
					buffer.writeUInt8(5, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4);
					buffer.writeUInt8(0x01, 9);
					buffer.writeInt16BE(this.update.lumMix * 2048, 16);
					return buffer;
				}
				break;
			}
			case "hueSat": {
				if(this.update.hue !== undefined && this.update.saturation !== undefined) {
					buffer.writeUInt8(8, 1);
					buffer.writeUInt8(6, 2);
					buffer.writeUInt8(this.isRel ? 1:0, 3);
					buffer.writeUInt8(0x80, 4);
					buffer.writeUInt8(0x02, 9);
					buffer.writeInt16BE(this.update.hue * 1024, 16);
					buffer.writeInt16BE(this.update.saturation * 4096, 18);
					return buffer;
				}
				break;
			}
		}

		return Buffer.alloc(0)
	}
}
*/

export class CameraControlUpdateCommand extends DeserializedCommand<Camera> {
	public static readonly rawName = 'CCdP'
	public static readonly minimumVersion = ProtocolVersion.V7_2
	public readonly cameraID: number
	public readonly changes: {[key: string]: any}

	constructor(cameraID: number, changedValues: {[key: string]: any}, properties: Camera) {
		super(properties)

		this.cameraID = cameraID
		this.changes = changedValues;
	}

	public static deserialize(rawCommand: Buffer): CameraControlUpdateCommand {
		var changed: {[key: string]: any} = {}

		//Default properties
		const properties = {
			bars: false,
			cameraID: rawCommand.readUInt8(0),
			autoIris: false,
			calltally: false,
			tint: 0,
			gaindb: 0,
			shutterValue: 0,
			whiteBalanceValue: 0,
			iris: 0,
			liftR: 0,
			gammaR: 0,
			gainR: 0,
			liftG: 0,
			gammaG: 0,
			gainG: 0,
			liftB: 0,
			gammaB: 0,
			gainB: 0,
			liftY: 0,
			gammaY: 0,
			gainY: 0,
			lumMix: 0,
			hue: 0,
			contrast: 0,
			pivot: 0,
			saturation: 0,
			command: "none"
		}

		//If our packet size is not expected just return no changes
		if(rawCommand.length != 24) {
			return new CameraControlUpdateCommand(rawCommand.readUInt8(0), changed, properties)
		}
		
		// add calltally parser
		//
		
		// console.log(`Neki: ${rawCommand.readUInt8(1)}, ${rawCommand.readUInt8(2)}`);

		//Read in the values
		switch(rawCommand.readUInt8(1)) {
			case 0: {
				//Lens
				switch(rawCommand.readUInt8(2)) {
					case 2: {
						//Iris
						changed["iris"] = rawCommand.readUInt16BE(16);
						changed["autoIris"] = false;
						changed["command"] = "iris";
						break;
					}
					case 5: {
						//Auto Iris
						changed["autoIris"] = true;
						changed["command"] = "autoIris";
						break;
					}
				}
				break;
			}
			
			case 1: {
				//Camera
				switch(rawCommand.readUInt8(2)) {
					/*
					case 0x0D: {
						//Lower gain (These may not be correct!)
						switch(rawCommand.readUInt16BE(16)) {
							case 0xF4B3: {changed["gain"] = "-12dB"; break;}
							case 0xFA00: {changed["gain"] = "-6dB"; break;}
						}
						changed["gainValue"] = rawCommand.readUInt16BE(16);
						changed["command"] = "gain";
						break;
					}
					case 0x01: {
						//Gain (These may not be correct!)
						switch(rawCommand.readUInt16BE(16)) {
							case 572: {changed["gain"] = "0dB"; break;}
							case 1084: {changed["gain"] = "6dB"; break;}
							case 2108: {changed["gain"] = "12dB"; break;}
							case 4156: {changed["gain"] = "18dB"; break;}
							case 8252: {changed["gain"] = "24dB"; break;}
						}
						changed["gainValue"] = rawCommand.readUInt16BE(16);
						changed["command"] = "gain";
						break;
					}
					*/
					case 0x02: {
						//White bal
						changed["whiteBalanceValue"] = rawCommand.readUInt16BE(16);
						//Tint
						changed["tint"] = rawCommand.readInt8(19);
						changed["command"] = "whiteBalance+tint";
						break;
					}
					case 0x05: {
						//Shutter
						switch(rawCommand.readUInt16BE(18)) 
						{
							case 41667: {changed["shutterValue"] = 0; break;}	// "1/24"
							case 40000: {changed["shutterValue"] = 1; break;}	// "1/25"
							case 33333: {changed["shutterValue"] = 2; break;}	// "1/30"
							case 20000: {changed["shutterValue"] = 3; break;}	// "1/50"
							case 16667: {changed["shutterValue"] = 4; break;}	// "1/60"
							case 13333: {changed["shutterValue"] = 5; break;}	// "1/75"
							case 11111: {changed["shutterValue"] = 6; break;}	// "1/90"
							case 10000: {changed["shutterValue"] = 7; break;}	// "1/100"
							case 8333: {changed["shutterValue"] = 8; break;}	// "1/120"
							case 6667: {changed["shutterValue"] = 9; break;}	// "1/150"
							case 5556: {changed["shutterValue"] = 10; break;}	// "1/180"
							case 4000: {changed["shutterValue"] = 11; break;}	// "/250"
							case 2778: {changed["shutterValue"] = 12; break;}	// "1/360"
							case 2000: {changed["shutterValue"] = 13; break;}	// "1/500"
							case 1379: {changed["shutterValue"] = 14; break;} 	// "1/725"
							case 1000: {changed["shutterValue"] = 15; break;}	// "1/1000"
							case 690: {changed["shutterValue"] = 16; break;}	// "1/1450"
							case 500: {changed["shutterValue"] = 17; break;}	// "1/2000"
						}
						//changed["shutterValue"] = rawCommand.readUInt16BE(18);
						changed["command"] = "shutter";
						break;
					}
					case 13: {
						//gaindB
						changed["gaindb"] = rawCommand.readInt8(16);
						changed["command"] = "gaindb";
						break;
					}
				}
				break;
			}
			case 4: {
				//Bars
				switch(rawCommand.readUInt8(2)) {
					case 4: {
						//Bars
						switch(rawCommand.readUInt8(16)) {
							case 0: {changed["bars"] = false; break;}
							case 30: {changed["bars"] = true; break;}
						}
						//changed["bars"] = rawCommand.readUInt8(16);
						changed["command"] = "bars";
						//console.log(changed["bars"]);
						break;
					}
				}
				break;
			}
			case 8: {
				//Chip
				switch(rawCommand.readUInt8(2)) {
					case 0: {
						//Lift
						changed["liftR"] = rawCommand.readInt16BE(16);
						changed["liftG"] = rawCommand.readInt16BE(18);
						changed["liftB"] = rawCommand.readInt16BE(20);
						changed["liftY"] = rawCommand.readInt16BE(22);
						//changed["liftRGBY"] = [changed["liftR"], changed["liftG"], changed["liftB"], changed["liftY"]];
						changed["command"] = "lift";
						break;
					}
					case 1: {
						//Gamma
						changed["gammaR"] = rawCommand.readInt16BE(16);
						changed["gammaG"] = rawCommand.readInt16BE(18);
						changed["gammaB"] = rawCommand.readInt16BE(20);
						changed["gammaY"] = rawCommand.readInt16BE(22);
						//changed["gammaRGBY"] = [changed["gammaR"], changed["gammaG"], changed["gammaB"], changed["gammaY"]];
						changed["command"] = "gamma";
						break;
					}
					case 2: {
						//Gain
						changed["gainR"] = rawCommand.readUInt16BE(16);
						changed["gainG"] = rawCommand.readUInt16BE(18);
						changed["gainB"] = rawCommand.readUInt16BE(20);
						changed["gainY"] = rawCommand.readUInt16BE(22);
						//changed["gainRGBY"] = [changed["gainR"], changed["gainG"], changed["gainB"], changed["gainY"]];
						changed["command"] = "gain";
						break;
					}
					case 4: {
						//Contrast
						changed["contrast"] = rawCommand.readUInt16BE(18);
						//Pivot
						changed["pivot"] = rawCommand.readUInt16BE(16);
						changed["command"] = "contrast+pivot";
						break;
					}
					case 5: {
						//Lum
						changed["lumMix"] = rawCommand.readUInt16BE(16);
						changed["command"] = "lumMix";
						break;
					}
					case 6: {
						//Sat
						changed["hue"] = rawCommand.readUInt16BE(16);
						changed["saturation"] = rawCommand.readInt16BE(18);
						changed["command"] = "hue+sat";
						break;
					}
				}

				break;
			}
		}

		return new CameraControlUpdateCommand(rawCommand.readUInt8(0), changed, properties)
	}

	public applyToState(state: AtemState): string {
		if(state.cameras[this.cameraID] === undefined) {
			state.cameras[this.cameraID] = this.properties;
		}
		else {
			for(var key in this.changes) {
				switch(key) {
					case "iris": {state.cameras[this.cameraID]!.iris = this.changes[key]; break;}
					case "autoIris": {state.cameras[this.cameraID]!.autoIris = this.changes[key]; break;}
					case "whiteBalanceValue": {state.cameras[this.cameraID]!.whiteBalanceValue = this.changes[key]; break;}
					case "liftR": {state.cameras[this.cameraID]!.liftR = this.changes[key]; break;}
					case "gammaR": {state.cameras[this.cameraID]!.gammaR = this.changes[key]; break;}
					case "gainR": {state.cameras[this.cameraID]!.gainR = this.changes[key]; break;}
					case "liftG": {state.cameras[this.cameraID]!.liftG = this.changes[key]; break;}
					case "gammaG": {state.cameras[this.cameraID]!.gammaG = this.changes[key]; break;}
					case "gainG": {state.cameras[this.cameraID]!.gainG = this.changes[key]; break;}
					case "liftB": {state.cameras[this.cameraID]!.liftB = this.changes[key]; break;}
					case "gammaB": {state.cameras[this.cameraID]!.gammaB = this.changes[key]; break;}
					case "gainB": {state.cameras[this.cameraID]!.gainB = this.changes[key]; break;}
					case "liftY": {state.cameras[this.cameraID]!.liftY = this.changes[key]; break;}
					case "gammaY": {state.cameras[this.cameraID]!.gammaY = this.changes[key]; break;}
					case "gainY": {state.cameras[this.cameraID]!.gainY = this.changes[key]; break;}
					//case "liftRGBY": {state.cameras[this.cameraID]!.liftRGBY = this.changes[key]; break;}
					//case "gainRGBY": {state.cameras[this.cameraID]!.gainRGBY = this.changes[key]; break;}
					//case "gammaRGBY": {state.cameras[this.cameraID]!.gammaRGBY = this.changes[key]; break;}
					case "lumMix": {state.cameras[this.cameraID]!.lumMix = this.changes[key]; break;}
					case "hue": {state.cameras[this.cameraID]!.hue = this.changes[key]; break;}
					case "shutterValue": {state.cameras[this.cameraID]!.shutterValue = this.changes[key]; break;}
					case "contrast": {state.cameras[this.cameraID]!.contrast = this.changes[key]; break;}
					case "pivot": {state.cameras[this.cameraID]!.pivot = this.changes[key]; break;}
					case "bars": {state.cameras[this.cameraID]!.bars = this.changes[key]; break;}
					case "tint": {state.cameras[this.cameraID]!.tint = this.changes[key]; break;}
					case "gaindb": {state.cameras[this.cameraID]!.gaindb = this.changes[key]; break;}
					case "saturation": {state.cameras[this.cameraID]!.saturation = this.changes[key]; break;}
					case "command": {state.cameras[this.cameraID]!.command = this.changes[key]; break;}
					default: {console.log("Error: Unknown camera control key " + key); break;}
				}
			}
		}
		return `camera.${this.cameraID}`
	}
}
