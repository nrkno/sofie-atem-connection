const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let loadError = null

// Workaround to fix webpack's build warnings: 'the request of a dependency is an expression'
const runtimeRequire0 = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require // eslint-disable-line

function runtimeRequire(name) {
	const candidates = [join(__dirname, name), join(__dirname, 'prebuilds', name)]
	for (const candidate of candidates) {
		if (existsSync(candidate)) return runtimeRequire0(candidate)
	}
}

function isMusl() {
	// For Node 10
	if (!process.report || typeof process.report.getReport !== 'function') {
		try {
			const lddPath = require('child_process').execSync('which ldd').toString().trim()
			return readFileSync(lddPath, 'utf8').includes('musl')
		} catch (e) {
			return true
		}
	} else {
		const { glibcVersionRuntime } = process.report.getReport().header
		return !glibcVersionRuntime
	}
}

switch (platform) {
	case 'android':
		switch (arch) {
			case 'arm64':
				try {
					nativeBinding = runtimeRequire('sofie-atem-connection-rs.android-arm64.node')
				} catch (e) {
					loadError = e
				}
				break
			case 'arm':
				try {
					nativeBinding = runtimeRequire('sofie-atem-connection-rs.android-arm-eabi.node')
				} catch (e) {
					loadError = e
				}
				break
			default:
				throw new Error(`Unsupported architecture on Android ${arch}`)
		}
		break
	case 'win32':
		switch (arch) {
			case 'x64':
				try {
					nativeBinding = runtimeRequire('sofie-atem-connection-rs.win32-x64-msvc.node')
				} catch (e) {
					loadError = e
				}
				break
			case 'ia32':
				try {
					nativeBinding = runtimeRequire('sofie-atem-connection-rs.win32-ia32-msvc.node')
				} catch (e) {
					loadError = e
				}
				break
			case 'arm64':
				try {
					nativeBinding = runtimeRequire('sofie-atem-connection-rs.win32-arm64-msvc.node')
				} catch (e) {
					loadError = e
				}
				break
			default:
				throw new Error(`Unsupported architecture on Windows: ${arch}`)
		}
		break
	case 'darwin':
		try {
			nativeBinding = runtimeRequire('sofie-atem-connection-rs.darwin-universal.node')
			if (nativeBinding) break
		} catch {}
		switch (arch) {
			case 'x64':
				try {
					nativeBinding = runtimeRequire('sofie-atem-connection-rs.darwin-x64.node')
				} catch (e) {
					loadError = e
				}
				break
			case 'arm64':
				try {
					nativeBinding = runtimeRequire('sofie-atem-connection-rs.darwin-arm64.node')
				} catch (e) {
					loadError = e
				}
				break
			default:
				throw new Error(`Unsupported architecture on macOS: ${arch}`)
		}
		break
	case 'freebsd':
		if (arch !== 'x64') {
			throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
		}
		try {
			nativeBinding = runtimeRequire('sofie-atem-connection-rs.freebsd-x64.node')
		} catch (e) {
			loadError = e
		}
		break
	case 'linux':
		switch (arch) {
			case 'x64':
				if (isMusl()) {
					try {
						nativeBinding = runtimeRequire('sofie-atem-connection-rs.linux-x64-musl.node')
					} catch (e) {
						loadError = e
					}
				} else {
					try {
						nativeBinding = runtimeRequire('sofie-atem-connection-rs.linux-x64-gnu.node')
					} catch (e) {
						loadError = e
					}
				}
				break
			case 'arm64':
				if (isMusl()) {
					try {
						nativeBinding = runtimeRequire('sofie-atem-connection-rs.linux-arm64-musl.node')
					} catch (e) {
						loadError = e
					}
				} else {
					try {
						nativeBinding = runtimeRequire('sofie-atem-connection-rs.linux-arm64-gnu.node')
					} catch (e) {
						loadError = e
					}
				}
				break
			case 'arm':
				try {
					nativeBinding = runtimeRequire('sofie-atem-connection-rs.linux-arm-gnueabihf.node')
				} catch (e) {
					loadError = e
				}
				break
			default:
				throw new Error(`Unsupported architecture on Linux: ${arch}`)
		}
		break
	default:
		throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
	if (loadError) {
		throw loadError
	}
	throw new Error(`Failed to load native binding`)
}

module.exports = nativeBinding
