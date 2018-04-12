const { Atem } = require('./dist')

const myAtem = new Atem({})

myAtem.connect('169.254.159.240')

// myAtem.on('stateChanged', console.log)

input = 1
preview = 4

sources = [
    1, 2, 3, 4, 5, 6, 7, 8, 1000, 2001, 2002, 3010, 3020
]

// setInterval(() => {
//     myAtem.changeProgramInput(sources[input % sources.length], 0)
//     myAtem.changePreviewInput(sources[preview % sources.length], 0)
//     input++
//     preview++
//     // console.log(myAtem.state)
// }, 100)

setTimeout(() => process.kill(0), 100)

// const { createSocket } = require('dgram')
// _socket = createSocket('udp4')
// _socket.bind(this._port + 1)
// _socket.on('message', (packet) => console.log(packet))
