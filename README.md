[![CircleCI](https://circleci.com/bb/superflytv/node-boilerplate.svg?style=svg&circle-token=cab68274787655e03cdd7be318fe32670b026a97)](https://circleci.com/bb/superflytv/node-boilerplate)

# ATEM-connection

This is a library for connecting to Blackmagic Design ATEM devices, created by SuperFly.tv

_Note: this is a work in progress, expect many new features and also... breaking changes_

## Technology highlights
- Typescript
- Yarn
- Jest
- standard-version
- circleci
- codecov

## Installation

_Coming soon_

## Usage

```javascript
var ATEM = require('applest-atem');

var atem = new ATEM();
atem.connect('192.168.1.220'); // Replace your ATEM switcher. address.

atem.on('connect', function() {
  atem.changeProgramInput(1); // ME1(0)
  atem.changePreviewInput(2); // ME1(0)
  atem.autoTransition(); // ME1(0)
  atem.changeProgramInput(3, 1); // ME2(1)
});

atem.on('stateChanged', function(err, state) {
  console.log(state); // catch the ATEM state.
});
console.log(atem.state); // or use this.
```

### Events

- `connect()`
It will be called on receive first ping packet from ATEM.

- `disconnect()`
It will be called on detect that it cannot communicate to ATEM in `RECONNECT_INTERVAL` seconds.

- `ping()`
It will be called on receive ping packet from ATEM at an interval of one second.

- `stateChanged(err, state)`
It will be called on receive state packet from ATEM.

### File Uploader Usage

```javascript
var ATEM = require('applest-atem');

var atem = new ATEM();
atem.connect('192.168.1.220');
atem.once('stateChanged', function (err, state) { // Delay few seconds from connecting.
  uploader = new ATEM.FileUploader(atem); // Pass the atem instance.
  uploader.uploadFromPNGFile('/Users/Sakura/Desktop/FHD.png'); // Pass a path of valid PNG file.
});
```

## Debug

Set `debug=true` config option, you can see raw packet.
```sh
$ ATEM_DEBUG=true coffee debug.coffee
SEND <Buffer 10 14 53 ab 00 00 00 00 00 3a 00 00 01 00 00 00 00 00 00 00>
SEND <Buffer 80 0c 53 ab 00 00 00 00 00 03 00 00>
SEND <Buffer 80 0c 53 ab 00 00 00 00 00 03 00 00>
SEND <Buffer 80 0c 80 0f 00 01 00 00 00 41 00 00>
RECV _ver(12) <Buffer 00 0c 90 60 5f 76 65 72 00 02 00 10>...
```

## Test

This module run tests by jest (in the future).
```sh
$ yarn unit
```
