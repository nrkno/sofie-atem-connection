fs             = require 'fs'
crypto         = require 'crypto'
dgram          = require 'dgram'
{EventEmitter} = require 'events'
{PNG}          = require 'pngjs'

DEBUG = if process.env['ATEM_DEBUG'] then process.env['ATEM_DEBUG'] == 'true' else false

class ATEM
  DEFAULT_PORT = 9910
  RECONNECT_INTERVAL = 5000

  COMMAND_CONNECT_HELLO = [
    0x10, 0x14, 0x53, 0xAB,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x3A, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00
  ]

  COMMAND_CONNECT_HELLO_ANSWER = [
    0x80, 0x0C, 0x53, 0xAB,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x03, 0x00, 0x00
  ]

  AUDIO_GAIN_RATE = 65381

  @Model =
    'TVS':     0x01
    '1ME':     0x02
    '2ME':     0x03
    'PS4K':    0x04
    '1ME4K':   0x05
    '2ME4K':   0x06
    '2MEBS4K': 0x07

  @TransitionStyle =
    MIX:   0x00
    DIP:   0x01
    WIPE:  0x02
    DVE:   0x03
    STING: 0x04

  @TallyState =
    None:    0x00
    Program: 0x01
    Preview: 0x02

  @ConnectionState =
    None:        0x00
    SynSent:     0x01
    Established: 0x02
    Closed:      0x03

  @PacketFlag =
    Sync:    0x01 # Ack called by Skaarhoj
    Connect: 0x02 # Init called by Skaarhoj
    Repeat:  0x04
    Error:   0x08
    Ack:     0x16

  state:
    topology:
      numberOfMEs: null
      numberOfSources: null
      numberOfColorGenerators: null
      numberOfAUXs: null
      numberOfDownstreamKeys: null
      numberOfStingers: null
      numberOfDVEs: null
      numberOfSuperSources: null
    tallys: []
    channels: {}
    video:
      ME: [
        # programInput: null
        # previewInput: null
        # transitionPreview: null
        # transitionPosition: null
        # transitionFrameCount: null
        # fadeToBlack: null
        # upstreamKeyNextState: []
        # upstreamKeyState: []
      ]
      downstreamKeyOn: []
      downstreamKeyTie: []
      auxs: {}
    audio:
      hasMonitor: null
      numberOfChannels: null
      channels: {}

  connectionState: ATEM.ConnectionState.Closed
  localPackedId: 1
  sessionId: []
  remotePacketId: []

  constructor: (options = {}) ->
    @forceOldStyle = options.forceOldStyle || false
    @localPort = options.localPort || 1024 + Math.floor(Math.random() * 64511) # 1024-65535

    @event = new EventEmitter
    @commandEvent = new EventEmitter
    @event.on 'ping', (err) =>
      @lastConnectAt = new Date().getTime()

    @socket = dgram.createSocket 'udp4'
    @socket.on 'message', @_receivePacket
    @socket.bind @localPort

    setInterval( =>
      return if @lastConnectAt + RECONNECT_INTERVAL > new Date().getTime()
      if @connectionState == ATEM.ConnectionState.Established
        @connectionState = ATEM.ConnectionState.Closed
        @event.emit 'disconnect', null, null
      @localPackedId = 1
      @sessionId = []
      @connect(@address, @port)
    , RECONNECT_INTERVAL)

  connect: (@address, @port = DEFAULT_PORT, local_port = 0) ->
    @_sendPacket COMMAND_CONNECT_HELLO
    @connectionState = ATEM.ConnectionState.SynSent

  on: (name, callback) ->
    @event.on name, callback

  once: (name, callback) ->
    @event.once name, callback

  _sendAck: ->
    buffer = new Buffer(12)
    buffer.fill(0)
    buffer[0] = 0x80
    buffer[1] = 0x0C
    buffer[2] = @sessionId[0]
    buffer[3] = @sessionId[1]
    buffer[4] = @remotePacketId[0]
    buffer[5] = @remotePacketId[1]
    buffer[9] = 0x41
    @_sendPacket buffer

  _sendCommand: (command, payload) ->
    payload = new Buffer(payload) unless Buffer.isBuffer(payload)
    buffer = new Buffer(20 + payload.length)
    buffer.fill(0)
    buffer[0] = (20+payload.length)/256 | 0x08
    buffer[1] = (20+payload.length)%256
    buffer[2] = @sessionId[0]
    buffer[3] = @sessionId[1]
    buffer[10] = @localPackedId/256
    buffer[11] = @localPackedId%256
    buffer[12] = (8+payload.length)/256
    buffer[13] = (8+payload.length)%256
    buffer[16] = command.charCodeAt 0
    buffer[17] = command.charCodeAt 1
    buffer[18] = command.charCodeAt 2
    buffer[19] = command.charCodeAt 3
    payload.copy(buffer, 20)
    @_sendPacket buffer
    @localPackedId++

  _sendPacket: (buffer) ->
    buffer = new Buffer(buffer) unless Buffer.isBuffer(buffer)

    console.log 'SEND', buffer if DEBUG
    @socket.send buffer, 0, buffer.length, @port, @address

  _receivePacket: (message, remote) =>
    length = ((message[0] & 0x07) << 8) | message[1]
    return if length != remote.size

    console.log 'RECV', message if DEBUG
    flags = message[0] >> 3
    @sessionId = [message[2], message[3]]
    @remotePacketId = [message[10], message[11]]

    # Send hello answer packet when receive connect flags
    if flags & ATEM.PacketFlag.Connect && !(flags & ATEM.PacketFlag.Repeat)
      @_sendPacket COMMAND_CONNECT_HELLO_ANSWER

    # Parse commands, Emit 'stateChanged' event after parse
    if flags & ATEM.PacketFlag.Sync && length > 12
      @_parseCommand message.slice(12)
      @event.emit 'stateChanged', null, @state

    # Send ping packet, Emit 'connect' event after receive all stats
    if flags & ATEM.PacketFlag.Sync && length == 12 && @connectionState == ATEM.ConnectionState.SynSent
      @connectionState = ATEM.ConnectionState.Established
      @event.emit 'connect', null, null

    # Send ack packet (called by answer packet in Skaarhoj)
    if flags & ATEM.PacketFlag.Sync && @connectionState == ATEM.ConnectionState.Established
      @_sendAck()
      @event.emit 'ping', null, null

  _parseCommand: (buffer) ->
    length = @_parseNumber(buffer[0..1])
    name = @_parseString(buffer[4..7])

    console.log 'COMMAND', "#{name}(#{length})", buffer.slice(0, length) if DEBUG

    @_setStatus name, buffer.slice(0, length).slice(8)
    if buffer.length > length
      @_parseCommand buffer.slice(length)

    if @forceOldStyle # Support 0.1.x
      for key, value of @state.video.ME[0]
        @state.video[key] = value

  _setStatus: (name, buffer) ->
    @commandEvent.emit name, null, buffer

    switch name
      when '_ver'
        @state._ver0 = buffer[1]
        @state._ver1 = buffer[3]

      when '_pin'
        @state._pin = @_parseString(buffer)
        @state.model = buffer[40] # XXX: is this sure?

      when '_top'
        @state.topology.numberOfMEs = buffer[0]
        @state.topology.numberOfSources = buffer[1]
        @state.topology.numberOfColorGenerators = buffer[2]
        @state.topology.numberOfAUXs = buffer[3]
        @state.topology.numberOfDownstreamKeys = buffer[4]
        @state.topology.numberOfStingers = buffer[5]
        @state.topology.numberOfDVEs = buffer[6]
        @state.topology.numberOfSuperSources = buffer[7]
        for me in [0...@state.topology.numberOfMEs]
          @state.video.ME[me] = {
            upstreamKeyState: []
            upstreamKeyNextState: []
          }

      when '_MeC'
        me = buffer[0]
        @state.video.ME[me].numberOfKeyers = buffer[1]

      when 'InPr'
        channel = @_parseNumber(buffer[0..1])
        @state.channels[channel] =
          name: @_parseString(buffer[2..21])
          label: @_parseString(buffer[22..25])

      when 'PrgI'
        me = buffer[0]
        @state.video.ME[me].programInput = @_parseNumber(buffer[2..3])

      when 'PrvI'
        me = buffer[0]
        @state.video.ME[me].previewInput = @_parseNumber(buffer[2..3])

      when 'TrPr'
        me = buffer[0]
        @state.video.ME[me].transitionPreview = if buffer[1] > 0 then true else false

      when 'TrPs'
        me = buffer[0]
        @state.video.ME[me].transitionPosition = @_parseNumber(buffer[4..5])/10000 # 0 - 10000
        @state.video.ME[me].transitionFrameCount = buffer[2] # 0 - 30

      when 'FtbS' # Fade To Black Setting
        me = buffer[0]
        @state.video.ME[me].fadeToBlack = if buffer[1] > 0 then true else false

      when 'TrSS'
        me = buffer[0]
        @state.video.ME[me].transitionStyle = buffer[1]
        @state.video.ME[me].upstreamKeyNextBackground = (buffer[2] >> 0 & 1) == 0x01
        for i in [0...@state.video.ME[me].numberOfKeyers]
          @state.video.ME[me].upstreamKeyNextState[i] = (buffer[2] >> (i+1) & 1) == 0x01

      when 'KeOn'
        me = buffer[0]
        @state.video.ME[me].upstreamKeyState[buffer[1]] = if buffer[2] == 1 then true else false

      when 'DskS'
        @state.video.downstreamKeyOn[buffer[0]] = if buffer[1] == 1 then true else false

      when 'DskP'
        @state.video.downstreamKeyTie[buffer[0]] = if buffer[1] == 1 then true else false

      when 'TlIn' # Tally Input
        @state.tallys = @_bufferToArray(buffer[2..])

      when 'AuxS' # Auxially Setting
        aux = buffer[0]
        @state.video.auxs[aux] = @_parseNumber(buffer[2..3])

      when '_AMC' # Audio Mixer Config
        @state.audio.numberOfChannels = @_parseNumber(buffer[0])
        @state.audio.hasMonitor = buffer[1] == 1

      when 'AMIP' # Audio Monitor Input Position
        channel = @_parseNumber buffer[0..1]
        @state.audio.channels[channel] =
          on: if buffer[8] == 1 then true else false
          afv: if buffer[8] == 2 then true else false
          gain: @_parseNumber(buffer[10..11])/AUDIO_GAIN_RATE
          rawGain: @_parseNumber(buffer[10..11])
          # 0xD8F0 - 0x0000 - 0x2710
          rawPan: @_parseNumber(buffer[12..13])
          # 6922

      #AMMO(16)  <Buffer 00 10 00 00 41 4d 4d 4f 80 00 00 00 01 01 00 02>
      #AMMO(16)  <Buffer 00 10 00 00 41 4d 4d 4f 80 00 00 00 00 01 00 02>
      when 'AMMO' # Audio Monitor Master Output
        @state.audio.master =
          afv: if buffer[4] == 1 then true else false
          gain: @_parseNumber(buffer[0..1])/AUDIO_GAIN_RATE
          rawGain: @_parseNumber(buffer[0..1])

      when 'AMLv' # Audio Monitor Level
        numberOfChannels = @_parseNumber(buffer[0..1])
        channelMappings = []
        offset = 4

        # Master volume
        for i in [0..1]
          leftGain = @_parseNumber(buffer[offset+1..offset+3])
          rightGain = @_parseNumber(buffer[offset+5..offset+7])
          @_merge(@state.audio.master, { leftLevel: leftGain/8388607, rightLevel: rightGain/8388607 })
          offset += 16

        # Channel mapping
        for i in [0...numberOfChannels]
          channelMappings.push(buffer[offset] << 8 | buffer[offset + 1])
          offset += 2

        # Channels volume
        for i in [0...numberOfChannels]
          leftGain = @_parseNumber(buffer[offset+1..offset+3])
          rightGain = @_parseNumber(buffer[offset+5..offset+7])
          @_merge(@state.audio.channels[channelMappings[i]], { leftLevel: leftGain/8388607, rightLevel: rightGain/8388607 })
          offset += 16

  # Convert number from bytes.
  _parseNumber: (bytes) ->
    num = 0
    for byte, i in bytes
      num += byte
      num = num << 8 if (i < bytes.length-1)
    num

  # Convert string from character array.
  # If appear null character in array, ignore thereafter chars.
  _parseString: (bytes) ->
    str = ''
    for char in bytes
      break if char == 0
      str += String.fromCharCode(char)
    str

  _bufferToArray: (buffers) ->
    arr = []
    for buffer in buffers
      arr.push(buffer)
    arr

  _numberToBytes: (number, numberOfBytes) ->
    bytes = []
    for i in [0...numberOfBytes]
      shift = numberOfBytes - i - 1
      bytes.push((number >> (8 * shift)) & 0xFF)
    bytes

  _stringToBytes: (str) ->
    bytes = []
    for i in [0...str.length]
      bytes.push(str.charCodeAt(i))
    bytes

  _merge: (obj1, obj2) ->
    obj2 = {} unless obj2?
    for key2 of obj2
      obj1[key2] = obj2[key2] if obj2.hasOwnProperty(key2)

  changeProgramInput: (input, me = 0) ->
    @_sendCommand('CPgI', [me, 0x00, input >> 8, input & 0xFF])

  changePreviewInput: (input, me = 0) ->
    @_sendCommand('CPvI', [me, 0x00, input >> 8, input & 0xFF])

  fadeToBlack: (me = 0) ->
    @_sendCommand('FtbA', [me, 0x00, 0x00, 0x00])

  autoTransition: (me = 0) ->
    @_sendCommand('DAut', [me, 0x00, 0x00, 0x00])

  cutTransition: (me = 0) ->
    @_sendCommand('DCut', [me, 0xef, 0xbf, 0x5f])

  changeTransitionPosition: (position, me = 0) ->
    @_sendCommand('CTPs', [me, 0x00, position/256, position%256])
    if position >= 10000
      @_sendCommand('CTPs', [me, 0x00, 0x00, 0x00])

  changeTransitionPreview: (state, me = 0) ->
    @_sendCommand('CTPr', [me, state, 0x00, 0x00])

  changeTransitionType: (type, me = 0) ->
    @_sendCommand('CTTp', [0x01, me, type, 0x00])

  changeTransitionMix: (frames, me = 0) ->
    @_sendCommand('CTMx', [me, frames, 0x00, 0x00])

  changeUpstreamKeyState: (number, state, me = 0) ->
    @_sendCommand('CKOn', [me, number, state, 0x00])

  changeUpstreamKeyNextBackground: (state, me = 0) ->
    @state.video.ME[me].upstreamKeyNextBackground = state
    stateBit = @state.video.ME[me].upstreamKeyNextBackground
    for i in [0...@state.video.ME[me].numberOfKeyers]
      stateBit += @state.video.ME[me].upstreamKeyNextState[i] << (i+1)
    @_sendCommand('CTTp', [0x02, me, 0x00, stateBit])

  changeUpstreamKeyNextState: (number, state, me = 0) ->
    @state.video.ME[me].upstreamKeyNextState[number] = state
    stateBit = @state.video.ME[me].upstreamKeyNextBackground
    for i in [0...@state.video.ME[me].numberOfKeyers]
      stateBit += @state.video.ME[me].upstreamKeyNextState[i] << (i+1)
    @_sendCommand('CTTp', [0x02, me, 0x00, stateBit])

  changeAuxInput: (aux, input) ->
    @_sendCommand('CAuS', [0x01, aux, input >> 8, input & 0xFF])

  changeDownstreamKeyOn: (number, state) ->
    @_sendCommand('CDsL', [number, state, 0xff, 0xff])

  changeDownstreamKeyTie: (number, state) ->
    @_sendCommand('CDsT', [number, state, 0xff, 0xff])

  autoDownstreamKey: (number) ->
    @_sendCommand('DDsA', [number, 0x00, 0x00, 0x00])

  changeAudioMasterGain: (gain) ->
    gain = gain * AUDIO_GAIN_RATE
    @_sendCommand('CAMM', [0x01, 0x00, gain/256, gain%256, 0x00, 0x00, 0x00, 0x00])

  changeAudioChannelGain: (channel, gain) ->
    gain = gain * AUDIO_GAIN_RATE
    @_sendCommand('CAMI', [0x02, 0x00, channel/256, channel%256, 0x00, 0x00, gain/256, gain%256, 0x00, 0x00, 0x00, 0x00])

  # CAMI command structure:    CAMI    [01=buttons, 02=vol, 04=pan (toggle bits)] - [input number, 0-…] - [buttons] - [buttons] - [vol] - [vol] - [pan] - [pan]
  changeAudioChannelState: (channel, status) ->
    @_sendCommand('CAMI', [0x01, 0x00, channel >> 8, channel & 0xFF, status, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])

  sendAudioLevelNumber: (enable = true) ->
    @_sendCommand('SALN', [enable, 0x00, 0x00, 0x00])

  startRecordMacro: (number, name, description) -> # ATEM response with "MRcS"
    nameLength = name?.length || 0
    descriptionLength = description?.length || 0
    bytes = [0x00, number]
    bytes = bytes.concat(@_numberToBytes(nameLength, 2))
    bytes = bytes.concat(@_numberToBytes(descriptionLength, 2))
    bytes = bytes.concat(@_stringToBytes(name)) if nameLength > 0
    bytes = bytes.concat(@_stringToBytes(description)) if descriptionLength > 0

    @_sendCommand('MSRc', bytes)

  # Macros
  stopRecordMacro: -> # ATEM response with "MRcS"
    @_sendCommand('MAct', [0xFF, 0xFF, 0x02, 0x81]) # Filling number field with 0xFF means special action

  runMacro: (number) -> # ATEM response with "MRPr"
    @_sendCommand('MAct', [0x00, number, 0x00, 0x7d])

  deleteMacro: (number) -> # ATEM response with "MPrp"
    @_sendCommand('MAct', [0x00, number, 0x05, 0x00])

  # File
  lockMediaPool: (bankIndex, frameIndex) ->
    payload = [bankIndex/256, bankIndex%256, frameIndex/256, frameIndex%256, 0x00, 0x01, 0x00, 0x46]
    @_sendCommand('PLCK', payload)

  unlockMediaPool: (bankIndex) ->
    payload = [bankIndex/256, bankIndex%256, 0x00, 0xbf]
    @_sendCommand('LOCK', payload)

  # bankIndex: 0x00(Stils), 0x01(Clip1), 0x02(Clip2)
  fileSendNotice: (id, bankIndex, frameIndex, size, mode = 1) ->
    payload = []
    payload[0] = id[0]
    payload[1] = id[1]
    payload[2] = bankIndex/256
    payload[3] = bankIndex%256
    payload[4] = 0
    payload[5] = 0
    payload[6] = frameIndex/256
    payload[7] = frameIndex%256
    payload = payload.concat(@_numberToBytes(size, 4))
    payload[12] = 0
    payload[13] = mode
    payload[14] = 0
    payload[15] = 0
    @_sendCommand('FTSD', payload)

  sendFileData: (id, buffer) ->
    payload = new Buffer(buffer.length + 4)
    payload[0] = id[0]
    payload[1] = id[1]
    payload[2] = buffer.length/256
    payload[3] = buffer.length%256
    buffer.copy(payload, 4)
    @_sendCommand('FTDa', payload)

  sendFileDescription: (id, name, hash) ->
    payload = new Buffer(212)
    payload.fill(0)
    payload[0] = id[0]
    payload[1] = id[1]
    payload.write(name, 2, 192, 'ascii')
    hash.copy(payload, 194)
    # payload.write(194, 16, hash)
    @_sendCommand('FTFD', payload)

class FileUploader
  @lastId = null
  chunkBufferOffset: 0

  constructor: (@atem) ->
    console.log 'Must set atem' unless @atem

  uploadFromPNGFile: (file, bankIndex, frameIndex) ->
    @uploadFromPNGBuffer(fs.readFileSync(file))

  uploadFromPNGBuffer: (pngBuffer, bankIndex = 0, frameIndex = 0) ->
    # Check already used this uploader
    new PNG(filterType: 4).parse(pngBuffer, (err, parsed) =>
      if err?
        console.log 'PNG Parse Error!', err
        return

      if @chunkBufferOffset != 0
        console.log 'Already Used Instance!'
        return

      @id = crypto.randomBytes(2) while !@id? || FileUploader.lastId == @id
      @lastId = @id
      @width = parsed.width
      @height = parsed.height
      @buffer = @convertPNGToYUV422(parsed.width, parsed.height, parsed.data)

      hashObject = crypto.createHash('md5')
      hashObject.update(@buffer)
      @hash = hashObject.digest()

      @atem.commandEvent.once 'LKST', (err, payload) => # lock status
        console.log '=> lock data', payload if DEBUG
        lockedBankIndex = payload[1]
        locked = payload[2] == 1
        @atem.fileSendNotice(@id, bankIndex, frameIndex, @buffer.length) if lockedBankIndex == bankIndex && locked
      @atem.commandEvent.once 'FTCD', (err, payload) =>
        console.log '=> send description', payload if DEBUG
        @atem.sendFileDescription(@id, '', @hash)
      @atem.commandEvent.on 'FTCD', (err, payload) => # continue data
        console.log '=> continue data', payload, @chunkBufferOffset, @chunkBufferSize, @chunkCount, @buffer.length - @chunkBufferOffset  if DEBUG
        @chunkCount = payload[9]
        @chunkBufferSize = @atem._parseNumber(payload[6..7]) - 4
        clearInterval(@chunkIntervalId) if @chunkIntervalId?
        @chunkIntervalId =
          setInterval( =>
            clearInterval(@chunkIntervalId) if --@chunkCount == 0
            if @chunkBufferOffset + @chunkBufferSize > @buffer.length
              @atem.sendFileData(@id, @buffer.slice(@chunkBufferOffset, @buffer.length))
              clearInterval(@chunkIntervalId)
            else
              @atem.sendFileData(@id, @buffer.slice(@chunkBufferOffset, @chunkBufferOffset + @chunkBufferSize))
            @chunkBufferOffset += @chunkBufferSize
          , 1)
      @atem.commandEvent.once 'FTDC', (err, payload) => # data close
        console.log '=> data close', payload if DEBUG
        @atem.unlockMediaPool(bankIndex)
      @atem.commandEvent.once 'FTDE', (err, payload) => # data error
        console.log '=> data error', payload if DEBUG

      @atem.lockMediaPool(bankIndex, frameIndex)
    )

  # Convert pixels in pairs for 4:2:2 compression
  # From https://github.com/petersimonsson/libqatemcontrol
  convertPNGToYUV422: (width, height, data) ->
    buffer = new Buffer(width * height * 4)

    i = 0
    while i < width * height * 4
      r1 = data[i+0]
      g1 = data[i+1]
      b1 = data[i+2]
      a1 = data[i+3] * 3.7
      r2 = data[i+4]
      g2 = data[i+5]
      b2 = data[i+6]
      a2 = data[i+7] * 3.7

      y1 = (((66  * r1 + 129 * g1 +  25 * b1 + 128) >> 8) + 16 ) * 4 - 1
      u1 = (((-38 * r1 -  74 * g1 + 112 * b1 + 128) >> 8) + 128) * 4 - 1
      y2 = (((66  * r2 + 129 * g2 +  25 * b2 + 128) >> 8) + 16 ) * 4 - 1
      v2 = (((112 * r2 -  94 * g2 -  18 * b2 + 128) >> 8) + 128) * 4 - 1

      buffer[i+0] = a1 >> 4
      buffer[i+1] = ((a1 & 0x0f) << 4) | (u1 >> 6)
      buffer[i+2] = ((u1 & 0x3f) << 2) | (y1 >> 8)
      buffer[i+3] = y1 & 0xff
      buffer[i+4] = a2 >> 4
      buffer[i+5] = ((a2 & 0x0f) << 4) | (v2 >> 6)
      buffer[i+6] = ((v2 & 0x3f) << 2) | (y2 >> 8)
      buffer[i+7] = y2 & 0xff

      i = i + 8

    buffer

module.exports = ATEM
module.exports.FileUploader = FileUploader
