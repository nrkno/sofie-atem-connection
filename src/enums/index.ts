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

export enum ConnectionState {
	None = 0x00,
	SynSent = 0x01,
	Established = 0x02,
	Closed = 0x03
}

export enum PacketFlag {
	AckRequest = 0x01,
	Connect = 0x02,
	Repeat = 0x04,
	Error = 0x08,
	AckReply = 0x10
}

export enum DVEEffect {
	SwooshTopLeft= 0,
	SwooshTop = 1,
	SwooshTopRight = 2,
	SwooshLeft = 3,
	SwooshRight = 4,
	SwooshBottomLeft = 5,
	SwooshBottom = 6,
	SwooshBottomRight = 7,

	SpinCCWTopRight = 13,
	SpinCWTopLeft = 8,
	SpinCCWBottomRight = 15,
	SpinCWBottomLeft = 10,
	SpinCWTopRight = 9,
	SpinCCWTopLeft = 12,
	SpinCWBottomRight = 11,
	SpinCCWBottomLeft = 14,

	SqueezeTopLeft = 16,
	SqueezeTop = 17,
	SqueezeTopRight = 18,
	SqueezeLeft = 19,
	SqueezeRight = 20,
	SqueezeBottomLeft = 21,
	SqueezeBottom = 22,
	SqueezeBottomRight = 23,

	PushTopLeft = 24,
	PushTop = 25,
	PushTopRight = 26,
	PushLeft = 27,
	PushRight = 28,
	PushBottomLeft = 29,
	PushBottom = 30,
	PushBottomRight = 31,

	GraphicCWSpin = 32,
	GraphicCCWSpin = 33,
	GraphicLogoWipe = 34
}

export enum MacroAction {
	Run = 0,
	Stop = 1,
	StopRecord = 2,
	InsertUserWait = 3,
	Continue = 4,
	Delete = 5
}

export enum ExternalPorts {
	None = 0,
	SDI = 1 << 0,
	HDMI = 1 << 1,
	Component = 1 << 2,
	Composite = 1 << 3,
	SVideo = 1 << 4,
	All = SDI | HDMI | Component | Composite | SVideo
}

export enum ExternalPortType {
	Internal = 0,
	SDI = 1,
	HDMI = 2,
	Composite = 3,
	Component = 4,
	SVideo = 5
}

export enum InternalPortType {
	External = 0,
	Black = 1,
	ColorBars = 2,
	ColorGenerator = 3,
	MediaPlayerFill = 4,
	MediaPlayerKey = 5,
	SuperSource = 6,

	MEOutput = 128,
	Auxiliary = 129,
	Mask = 130
}

export enum SourceAvailability {
	None = 0,
	Auxiliary = 1 << 0,
	Multiviewer = 1 << 1,
	SuperSourceArt = 1 << 2,
	SuperSourceBox = 1 << 3,
	KeySource = 1 << 4,
	All = Auxiliary | Multiviewer | SuperSourceArt | SuperSourceBox | KeySource
}

export enum MeAvailability {
	None = 0,
	Me1 = 1 << 0,
	Me2 = 1 << 1,
	All = Me1 | Me2
}
