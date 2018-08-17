"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = require("dgram");
const events_1 = require("events");
const atemUtil_1 = require("./atemUtil");
const atemCommandParser_1 = require("./atemCommandParser");
const enums_1 = require("../enums");
class AtemSocket extends events_1.EventEmitter {
    constructor(options) {
        super();
        this._connectionState = enums_1.ConnectionState.Closed;
        this._debug = false;
        this._localPacketId = 1;
        this._maxPacketID = (1 << 15) - 1; // Atem expects 15 not 16 bits before wrapping
        this._port = 9910;
        this._reconnectInterval = 5000;
        this._inFlightTimeout = 200;
        this._maxRetries = 5;
        this._lastReceivedAt = Date.now();
        this._inFlight = [];
        this._commandParser = new atemCommandParser_1.CommandParser();
        this._address = options.address || this._address;
        this._port = options.port || this._port;
        this._debug = options.debug || false;
        this.log = options.log || this.log;
        this._createSocket();
    }
    connect(address, port) {
        if (!this._reconnectTimer) {
            this._reconnectTimer = setInterval(() => {
                if (this._lastReceivedAt + this._reconnectInterval > Date.now())
                    return;
                if (this._connectionState === enums_1.ConnectionState.Established) {
                    this._connectionState = enums_1.ConnectionState.Closed;
                    this.emit('disconnect', null, null);
                }
                this._localPacketId = 1;
                this._sessionId = 0;
                this.log('reconnect');
                if (this._address && this._port) {
                    this._sendPacket(atemUtil_1.Util.COMMAND_CONNECT_HELLO);
                    this._connectionState = enums_1.ConnectionState.SynSent;
                }
            }, this._reconnectInterval);
        }
        if (!this._retransmitTimer) {
            this._retransmitTimer = setInterval(() => this._checkForRetransmit(), 50);
        }
        if (address) {
            this._address = address;
        }
        if (port) {
            this._port = port;
        }
        this._sendPacket(atemUtil_1.Util.COMMAND_CONNECT_HELLO);
        this._connectionState = enums_1.ConnectionState.SynSent;
    }
    disconnect() {
        return new Promise((resolve) => {
            if (this._connectionState === enums_1.ConnectionState.Established) {
                this._socket.close(() => {
                    clearInterval(this._retransmitTimer);
                    clearInterval(this._reconnectTimer);
                    this._retransmitTimer = undefined;
                    this._reconnectTimer = undefined;
                    this._connectionState = enums_1.ConnectionState.Closed;
                    this._createSocket();
                    this.emit('disconnect');
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
    log(..._args) {
        // Will be re-assigned by the top-level ATEM class.
    }
    get nextPacketId() {
        return this._localPacketId;
    }
    _sendCommand(command) {
        if (typeof command.serialize !== 'function') {
            return;
        }
        const payload = command.serialize();
        if (this._debug)
            this.log('PAYLOAD', payload);
        const buffer = new Buffer(16 + payload.length);
        buffer.fill(0);
        buffer[0] = (16 + payload.length) / 256 | 0x08;
        buffer[1] = (16 + payload.length) % 256;
        buffer[2] = this._sessionId >> 8;
        buffer[3] = this._sessionId & 0xff;
        buffer[10] = this._localPacketId / 256;
        buffer[11] = this._localPacketId % 256;
        buffer[12] = (4 + payload.length) / 256;
        buffer[13] = (4 + payload.length) % 256;
        payload.copy(buffer, 16);
        this._sendPacket(buffer);
        this._inFlight.push({ packetId: this._localPacketId, lastSent: Date.now(), packet: buffer, resent: 0 });
        this._localPacketId++;
        if (this._maxPacketID < this._localPacketId)
            this._localPacketId = 0;
    }
    _createSocket() {
        this._socket = dgram_1.createSocket('udp4');
        this._socket.bind(1024 + Math.floor(Math.random() * 64511));
        this._socket.on('message', (packet, rinfo) => this._receivePacket(packet, rinfo));
    }
    _receivePacket(packet, rinfo) {
        if (this._debug)
            this.log('RECV ', packet);
        this._lastReceivedAt = Date.now();
        const length = ((packet[0] & 0x07) << 8) | packet[1];
        if (length !== rinfo.size)
            return;
        const flags = packet[0] >> 3;
        // this._sessionId = [packet[2], packet[3]]
        this._sessionId = packet[2] << 8 | packet[3];
        const remotePacketId = packet[10] << 8 | packet[11];
        // Send hello answer packet when receive connect flags
        if (flags & enums_1.PacketFlag.Connect && !(flags & enums_1.PacketFlag.Repeat)) {
            this._sendPacket(atemUtil_1.Util.COMMAND_CONNECT_HELLO_ANSWER);
        }
        // Parse commands, Emit 'stateChanged' event after parse
        if (flags & enums_1.PacketFlag.AckRequest && length > 12) {
            this._parseCommand(packet.slice(12), remotePacketId);
        }
        // Send ping packet, Emit 'connect' event after receive all stats
        if (flags & enums_1.PacketFlag.AckRequest && length === 12 && this._connectionState === enums_1.ConnectionState.SynSent) {
            this._connectionState = enums_1.ConnectionState.Established;
        }
        // Send ack packet (called by answer packet in Skaarhoj)
        if (flags & enums_1.PacketFlag.AckRequest && this._connectionState === enums_1.ConnectionState.Established) {
            this._sendAck(remotePacketId);
            this.emit('ping');
        }
        // Device ack'ed our command
        if (flags & enums_1.PacketFlag.AckReply && this._connectionState === enums_1.ConnectionState.Established) {
            const ackPacketId = packet[4] << 8 | packet[5];
            for (const i in this._inFlight) {
                if (ackPacketId >= this._inFlight[i].packetId) {
                    this.emit('commandAcknowleged', this._inFlight[i].packetId);
                    delete this._inFlight[i];
                }
            }
        }
    }
    _parseCommand(buffer, packetId) {
        const length = buffer.readUInt16BE(0);
        const name = buffer.toString('ascii', 4, 8);
        if (name === 'InCm') {
            this.emit('connect');
        }
        // this.log('COMMAND', `${name}(${length})`, buffer.slice(0, length))
        const cmd = this._commandParser.commandFromRawName(name);
        if (cmd && typeof cmd.deserialize === 'function') {
            cmd.deserialize(buffer.slice(0, length).slice(8));
            cmd.packetId = packetId || -1;
            this.emit('receivedStateChange', cmd);
        }
        if (buffer.length > length) {
            this._parseCommand(buffer.slice(length), packetId);
        }
    }
    _sendPacket(packet) {
        if (this._debug)
            this.log('SEND ', packet);
        this._socket.send(packet, 0, packet.length, this._port, this._address);
    }
    _sendAck(packetId) {
        const buffer = new Buffer(12);
        buffer.fill(0);
        buffer[0] = 0x80;
        buffer[1] = 0x0C;
        buffer[2] = this._sessionId >> 8;
        buffer[3] = this._sessionId & 0xFF;
        buffer[4] = packetId >> 8;
        buffer[5] = packetId & 0xFF;
        buffer[9] = 0x41;
        this._sendPacket(buffer);
    }
    _checkForRetransmit() {
        for (const sentPacket of this._inFlight) {
            if (sentPacket && sentPacket.lastSent + this._inFlightTimeout < Date.now()) {
                if (sentPacket.resent <= this._maxRetries) {
                    sentPacket.lastSent = Date.now();
                    sentPacket.resent++;
                    this.log('RESEND: ', sentPacket);
                    this._sendPacket(sentPacket.packet);
                }
                else {
                    this._inFlight.splice(this._inFlight.indexOf(sentPacket), 1);
                    this.log('TIMED OUT: ', sentPacket.packet);
                    // @todo: we should probably break up the connection here.
                }
            }
        }
    }
}
exports.AtemSocket = AtemSocket;
//# sourceMappingURL=atemSocket.js.map