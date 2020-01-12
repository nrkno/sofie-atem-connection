# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/nrkno/tv-automation-atem-connection/compare/1.2.0...1.3.0) (2020-01-12)


### Features

* add TimeCommand and TimeRequestCommand ([6a95340](https://github.com/nrkno/tv-automation-atem-connection/commit/6a953403be9fd930a47a14b38bd843028174c167))


### Bug Fixes

* add atem-mini ModelId ([b6787a9](https://github.com/nrkno/tv-automation-atem-connection/commit/b6787a92f4ad35b60020219d36878db818adbdfb))
* expose listVisibleInputs to allow explicit usage on an old/cached state ([ee69821](https://github.com/nrkno/tv-automation-atem-connection/commit/ee69821ed25af8e6d8c999bcb5271e8d87b04b9f))

## [1.2.0](https://github.com/nrkno/tv-automation-atem-connection/compare/1.1.0...1.2.0) (2019-12-13)


### Features

* add listVisibleInputs method ([#57](https://github.com/nrkno/tv-automation-atem-connection/issues/57)) ([23c9318](https://github.com/nrkno/tv-automation-atem-connection/commit/23c93185fe05c4bf763aefd301717414a5ec8d88))
* expose setFadeToBlackRate ([fa974a4](https://github.com/nrkno/tv-automation-atem-connection/commit/fa974a4412344054eca0cf9950aa5943381452d7))


### Bug Fixes

* add missing TVS-pro models to Model enum ([8ac6777](https://github.com/nrkno/tv-automation-atem-connection/commit/8ac67776e8a419bb41ac0e543545b73210029673))

## [1.1.0](https://github.com/nrkno/tv-automation-atem-connection/compare/1.0.2...1.1.0) (2019-10-24)


### Features

* refactor circleci config ([a7b0ca2](https://github.com/nrkno/tv-automation-atem-connection/commit/a7b0ca249b9e104833e8abde6d97e82934c8a14d))
* update ci to run for node 8,10,12 ([25f1fb1](https://github.com/nrkno/tv-automation-atem-connection/commit/25f1fb13d6c3d551ecc5f35ad05375858d18dcc7))


### Bug Fixes

* incorrect order in ci release step ([ca0d207](https://github.com/nrkno/tv-automation-atem-connection/commit/ca0d207a04d8a19cd53308d83e05e12c2808f852))
* parse productIdentifierCommand successfully even for unknown models ([d991fdd](https://github.com/nrkno/tv-automation-atem-connection/commit/d991fddabf84e977c7a53197a4208e717d68e782))
* SuperSourceConfigCommand broken ([ccc7d33](https://github.com/nrkno/tv-automation-atem-connection/commit/ccc7d333e226ec0e7f9c09f640789d5520d7061a))

### [1.0.2](https://github.com/nrkno/tv-automation-atem-connection/compare/1.0.1...1.0.2) (2019-10-09)


### Bug Fixes

* media player source still & clip inverted ([6dec48f](https://github.com/nrkno/tv-automation-atem-connection/commit/6dec48f09e4c02d404578095bb7e2cac551d398c))

### [1.0.1](https://github.com/nrkno/tv-automation-atem-connection/compare/1.0.0...1.0.1) (2019-09-21)


### Bug Fixes

* better support for constellation ([b540f11](https://github.com/nrkno/tv-automation-atem-connection/commit/b540f11))
* better support for constellation ([#58](https://github.com/nrkno/tv-automation-atem-connection/issues/58)) ([5bb512d](https://github.com/nrkno/tv-automation-atem-connection/commit/5bb512d))

## [1.0.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.10.0...1.0.0) (2019-09-17)


### Bug Fixes

* broken autoDownstreamKey function and mangled multiviewer window state ([71c61f6](https://github.com/nrkno/tv-automation-atem-connection/commit/71c61f6))
* consistent API for super source methods ([4327660](https://github.com/nrkno/tv-automation-atem-connection/commit/4327660))
* data transfer uses old command names ([e6a6bd0](https://github.com/nrkno/tv-automation-atem-connection/commit/e6a6bd0))
* disable unsupported v8 tests ([8bcafb5](https://github.com/nrkno/tv-automation-atem-connection/commit/8bcafb5))
* dve value range ([33784bc](https://github.com/nrkno/tv-automation-atem-connection/commit/33784bc))
* exclude test helpers in build ([041c37f](https://github.com/nrkno/tv-automation-atem-connection/commit/041c37f))
* exit cleanly after running tests ([c23a9f9](https://github.com/nrkno/tv-automation-atem-connection/commit/c23a9f9))
* ignore failing tests ([8cfcfaf](https://github.com/nrkno/tv-automation-atem-connection/commit/8cfcfaf))
* improve commandParser typings ([1e26d6d](https://github.com/nrkno/tv-automation-atem-connection/commit/1e26d6d))
* Make buffer use in serialize consistent. Remove setting command name in serialize. ([40eec6e](https://github.com/nrkno/tv-automation-atem-connection/commit/40eec6e))
* More command test data mangling ([8bd9009](https://github.com/nrkno/tv-automation-atem-connection/commit/8bd9009))
* multiviewer state initialization ([2547af1](https://github.com/nrkno/tv-automation-atem-connection/commit/2547af1))
* regenerate commands test data ([fe619c4](https://github.com/nrkno/tv-automation-atem-connection/commit/fe619c4))
* restructure all command tests to use new structure ([957ed76](https://github.com/nrkno/tv-automation-atem-connection/commit/957ed76))
* some broken cases ([9ebde2e](https://github.com/nrkno/tv-automation-atem-connection/commit/9ebde2e))
* some more command serialization ([cf66953](https://github.com/nrkno/tv-automation-atem-connection/commit/cf66953))
* some tests ([3f14715](https://github.com/nrkno/tv-automation-atem-connection/commit/3f14715))
* **AudioMixerInputCommand:** sign in deserialization  ([d9a3865](https://github.com/nrkno/tv-automation-atem-connection/commit/d9a3865))
* **MediaPlayerSourceCommand:** order of serialization ([a0a89f3](https://github.com/nrkno/tv-automation-atem-connection/commit/a0a89f3))
* **MixEffectFlyKeyFrameGetCommand:** correct validators ([a1648c1](https://github.com/nrkno/tv-automation-atem-connection/commit/a1648c1))
* tidy up some commented out code ([f1a1252](https://github.com/nrkno/tv-automation-atem-connection/commit/f1a1252))
* topology command ([e5812d9](https://github.com/nrkno/tv-automation-atem-connection/commit/e5812d9))


### Features

* 8.0.1 support ([eaa1e72](https://github.com/nrkno/tv-automation-atem-connection/commit/eaa1e72))
* Add test for api methods which change command based on version ([7208ee4](https://github.com/nrkno/tv-automation-atem-connection/commit/7208ee4))
* add test to verify that all commands have serialization test cases ([3cb9ae7](https://github.com/nrkno/tv-automation-atem-connection/commit/3cb9ae7))
* Enable and fix v8 command tests ([3a7d23d](https://github.com/nrkno/tv-automation-atem-connection/commit/3a7d23d))
* enable running tests in circleci ([662638d](https://github.com/nrkno/tv-automation-atem-connection/commit/662638d))
* expect commands to be split to be a serialize or deserialize (unless they use the same name for both) ([e9704f2](https://github.com/nrkno/tv-automation-atem-connection/commit/e9704f2))
* FadeToBlack control ([660e8dc](https://github.com/nrkno/tv-automation-atem-connection/commit/660e8dc))
* initial multi-version support ([fedc690](https://github.com/nrkno/tv-automation-atem-connection/commit/fedc690))
* prototype serialize command ([010fff2](https://github.com/nrkno/tv-automation-atem-connection/commit/010fff2))
* prototype what separate command converter structures would look like ([378be83](https://github.com/nrkno/tv-automation-atem-connection/commit/378be83))
* restructure some core buffer usage, and move command header (length + name) writing into common command serialization code ([3c8b062](https://github.com/nrkno/tv-automation-atem-connection/commit/3c8b062))
* split some commands ([beae1c4](https://github.com/nrkno/tv-automation-atem-connection/commit/beae1c4))
* stateChanged events report a path instead of the Command ([845909f](https://github.com/nrkno/tv-automation-atem-connection/commit/845909f))

# [0.10.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.9.0...0.10.0) (2019-04-02)


### Bug Fixes

* fix error spam that occurs when the child process attempts to log certain data ([7c9e31c](https://github.com/nrkno/tv-automation-atem-connection/commit/7c9e31c))
* fixed parsing of audioMixer input ([3430cb7](https://github.com/nrkno/tv-automation-atem-connection/commit/3430cb7))
* kill the child process with an error code with an uncaughtException or unhandledRejection occurs ([e5323c9](https://github.com/nrkno/tv-automation-atem-connection/commit/e5323c9))
* rename setAudioChannelXX methods to setAudioMixerInputXXX to harmonize with other audio commands ([77fe521](https://github.com/nrkno/tv-automation-atem-connection/commit/77fe521))
* set enum values explicitly ([bd50491](https://github.com/nrkno/tv-automation-atem-connection/commit/bd50491))
* upgrade dependencies to pass audit ([98d16a8](https://github.com/nrkno/tv-automation-atem-connection/commit/98d16a8))
* upgrade typescript to latest ([b68afbf](https://github.com/nrkno/tv-automation-atem-connection/commit/b68afbf))
* **AudioMixerMasterCommand:** set flag properly ([78fa0b5](https://github.com/nrkno/tv-automation-atem-connection/commit/78fa0b5))


### Features

* add support for MasterChannel ([722d744](https://github.com/nrkno/tv-automation-atem-connection/commit/722d744))



# [0.9.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.8.2...0.9.0) (2019-02-21)


### Bug Fixes

* AudioMixerInputCommand ([69608c7](https://github.com/nrkno/tv-automation-atem-connection/commit/69608c7))


### Features

* audio channels ([1b3bd32](https://github.com/nrkno/tv-automation-atem-connection/commit/1b3bd32))
* top level methods for audio channels ([6c390d3](https://github.com/nrkno/tv-automation-atem-connection/commit/6c390d3))



<a name="0.8.2"></a>
## [0.8.2](https://github.com/nrkno/tv-automation-atem-connection/compare/0.8.1...0.8.2) (2019-01-19)


### Bug Fixes

* one object per multiviewer in the state ([5f53526](https://github.com/nrkno/tv-automation-atem-connection/commit/5f53526))



<a name="0.8.1"></a>
## [0.8.1](https://github.com/nrkno/tv-automation-atem-connection/compare/0.8.0...0.8.1) (2018-11-26)


### Bug Fixes

* **perf:** remove nanotimer for intervals as it uses 100% cpu ([d7bc543](https://github.com/nrkno/tv-automation-atem-connection/commit/d7bc543))
* let node bind to a random port for our udp socket ([b7be165](https://github.com/nrkno/tv-automation-atem-connection/commit/b7be165))
* timers are cleaned when calling disconnect, even when not connected ([d3040d1](https://github.com/nrkno/tv-automation-atem-connection/commit/d3040d1))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.7.0...0.8.0) (2018-11-02)


### Bug Fixes

* improve reliability of resending ([ccaa051](https://github.com/nrkno/tv-automation-atem-connection/commit/ccaa051))


### Features

* Rename downstreamKeyId to downstreamKeyerId to make them all consistent and be consistent with upstream keyer ([58f61ee](https://github.com/nrkno/tv-automation-atem-connection/commit/58f61ee))
* use a nanotimer in socket child for ack'ing ([84482ca](https://github.com/nrkno/tv-automation-atem-connection/commit/84482ca))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.6.1...0.7.0) (2018-10-24)


### Bug Fixes

* **atemSocket:** fix _maxPacketID being off-by-one ([ee70083](https://github.com/nrkno/tv-automation-atem-connection/commit/ee70083))
* **atemSocket:** fix _maxPacketID being off-by-one ([4efecdd](https://github.com/nrkno/tv-automation-atem-connection/commit/4efecdd))
* file description cmd does not always need name / descr. ([8837dd0](https://github.com/nrkno/tv-automation-atem-connection/commit/8837dd0))
* **Data Command:** size property ([df16109](https://github.com/nrkno/tv-automation-atem-connection/commit/df16109))
* **Data Command:** size property ([35a846d](https://github.com/nrkno/tv-automation-atem-connection/commit/35a846d))
* ack'ing after init ([8197ab5](https://github.com/nrkno/tv-automation-atem-connection/commit/8197ab5))
* behaviour around packetId wrapping ([d8e4626](https://github.com/nrkno/tv-automation-atem-connection/commit/d8e4626))
* child process timeout ([8196d8e](https://github.com/nrkno/tv-automation-atem-connection/commit/8196d8e))
* colour space ([bb19e9e](https://github.com/nrkno/tv-automation-atem-connection/commit/bb19e9e))
* colour space ([8f295d3](https://github.com/nrkno/tv-automation-atem-connection/commit/8f295d3))
* convencience method for setting clip in MP ([a8feeef](https://github.com/nrkno/tv-automation-atem-connection/commit/a8feeef))
* convencience method for setting clip in MP ([b5455a3](https://github.com/nrkno/tv-automation-atem-connection/commit/b5455a3))
* do not ack discontinuous packet sequences ([bfb679f](https://github.com/nrkno/tv-automation-atem-connection/commit/bfb679f))
* file description cmd does not always need name / descr. ([683d83b](https://github.com/nrkno/tv-automation-atem-connection/commit/683d83b))
* frame description file name ([bc1224b](https://github.com/nrkno/tv-automation-atem-connection/commit/bc1224b))
* frame description file name ([1c7290d](https://github.com/nrkno/tv-automation-atem-connection/commit/1c7290d))
* **Data Transfer:** stop condition, send description only once ([bca847f](https://github.com/nrkno/tv-automation-atem-connection/commit/bca847f))
* lint ([666cff5](https://github.com/nrkno/tv-automation-atem-connection/commit/666cff5))
* lint ([61ba6f8](https://github.com/nrkno/tv-automation-atem-connection/commit/61ba6f8))
* Media Player Source Command ([3103ca6](https://github.com/nrkno/tv-automation-atem-connection/commit/3103ca6))
* Media Player Source Command ([5c1ebb1](https://github.com/nrkno/tv-automation-atem-connection/commit/5c1ebb1))
* messages without correct transferid will be ignored ([301c545](https://github.com/nrkno/tv-automation-atem-connection/commit/301c545))
* more aggressive resend strategy ([8900ded](https://github.com/nrkno/tv-automation-atem-connection/commit/8900ded))
* optimize inFlightTimeout ([32b3c44](https://github.com/nrkno/tv-automation-atem-connection/commit/32b3c44))
* reject timed out commands ([fd3d045](https://github.com/nrkno/tv-automation-atem-connection/commit/fd3d045))
* revert new packetId on resend ([2fe6368](https://github.com/nrkno/tv-automation-atem-connection/commit/2fe6368))
* socket process exits when parent process does ([#30](https://github.com/nrkno/tv-automation-atem-connection/issues/30)) ([4754cc7](https://github.com/nrkno/tv-automation-atem-connection/commit/4754cc7))
* **Data Transfer:** remove old commands after failing ([09ee4b4](https://github.com/nrkno/tv-automation-atem-connection/commit/09ee4b4))
* **Data Transfer:** remove old commands after failing ([dfa1cfc](https://github.com/nrkno/tv-automation-atem-connection/commit/dfa1cfc))
* **Data Transfer:** stop condition, send description only once ([627c9f2](https://github.com/nrkno/tv-automation-atem-connection/commit/627c9f2))
* **dataTransfer:** ignore unexpected DataTransferCompleteCommands ([1f97a4a](https://github.com/nrkno/tv-automation-atem-connection/commit/1f97a4a))
* **dataTransfer:** ignore unexpected DataTransferCompleteCommands ([517253d](https://github.com/nrkno/tv-automation-atem-connection/commit/517253d))
* **dataTrasnfer:** fail when a DataTransferErrorCommand is received ([ba17501](https://github.com/nrkno/tv-automation-atem-connection/commit/ba17501))
* **dataTrasnfer:** fail when a DataTransferErrorCommand is received ([441ef68](https://github.com/nrkno/tv-automation-atem-connection/commit/441ef68))
* **Media:** fix Util imports ([55a1f28](https://github.com/nrkno/tv-automation-atem-connection/commit/55a1f28))
* **Media:** fix Util imports ([7f0577a](https://github.com/nrkno/tv-automation-atem-connection/commit/7f0577a))


### Features

* clear media pool ([310308b](https://github.com/nrkno/tv-automation-atem-connection/commit/310308b))
* clear media pool ([9f64e58](https://github.com/nrkno/tv-automation-atem-connection/commit/9f64e58))
* **DataTransfer:** add errorCode property to DataTransferErrorCommand ([7e302e1](https://github.com/nrkno/tv-automation-atem-connection/commit/7e302e1))
* Data Commands ([d1bf2ba](https://github.com/nrkno/tv-automation-atem-connection/commit/d1bf2ba))
* Data Commands ([2e14efb](https://github.com/nrkno/tv-automation-atem-connection/commit/2e14efb))
* **DataTransfer:** add errorCode property to DataTransferErrorCommand ([d8b2d5f](https://github.com/nrkno/tv-automation-atem-connection/commit/d8b2d5f))
* **Media:** Media Pool Description Commands ([fbae9b1](https://github.com/nrkno/tv-automation-atem-connection/commit/fbae9b1))
* **Media:** Media Pool Description Commands ([5050fe8](https://github.com/nrkno/tv-automation-atem-connection/commit/5050fe8))
* **Media Pool:** clear / set commands ([40fce0c](https://github.com/nrkno/tv-automation-atem-connection/commit/40fce0c))
* **Media Pool:** clear / set commands ([a2ecc82](https://github.com/nrkno/tv-automation-atem-connection/commit/a2ecc82))
* Media Upload API, File Transfer Manager ([c240477](https://github.com/nrkno/tv-automation-atem-connection/commit/c240477))
* Media Upload API, File Transfer Manager ([c5e4684](https://github.com/nrkno/tv-automation-atem-connection/commit/c5e4684))
* TransferManager ([a9336c9](https://github.com/nrkno/tv-automation-atem-connection/commit/a9336c9))
* TransferManager ([a2588a7](https://github.com/nrkno/tv-automation-atem-connection/commit/a2588a7))
* TransferManager ([e3e69a1](https://github.com/nrkno/tv-automation-atem-connection/commit/e3e69a1))
* TransferManager ([ee3ed26](https://github.com/nrkno/tv-automation-atem-connection/commit/ee3ed26))
* Video Mode command ([b9980e3](https://github.com/nrkno/tv-automation-atem-connection/commit/b9980e3))
* Video Mode command ([c87c0b8](https://github.com/nrkno/tv-automation-atem-connection/commit/c87c0b8))


### Performance Improvements

* **dataTransfer:** increase transfer throughput ([db8e4c4](https://github.com/nrkno/tv-automation-atem-connection/commit/db8e4c4))
* **dataTransfer:** increase transfer throughput ([d96b38d](https://github.com/nrkno/tv-automation-atem-connection/commit/d96b38d))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/nrkno/tv-automation-atem-connection/compare/0.6.0...0.6.1) (2018-10-23)


### Bug Fixes

* behaviour around packetId wrapping ([9c8e3a8](https://github.com/nrkno/tv-automation-atem-connection/commit/9c8e3a8))
* do not ack discontinuous packet sequences ([91f36bf](https://github.com/nrkno/tv-automation-atem-connection/commit/91f36bf))
* do not ack discontinuous packet sequences ([1bde19d](https://github.com/nrkno/tv-automation-atem-connection/commit/1bde19d))
* more aggressive resend strategy ([d1fd66c](https://github.com/nrkno/tv-automation-atem-connection/commit/d1fd66c))
* optimize inFlightTimeout ([0812a63](https://github.com/nrkno/tv-automation-atem-connection/commit/0812a63))
* reject timed out commands ([a8cfa68](https://github.com/nrkno/tv-automation-atem-connection/commit/a8cfa68))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.5.2...0.6.0) (2018-10-16)


### Bug Fixes

* **DVE upstream key:** borderHueWidth is 3600 ([4b2db48](https://github.com/nrkno/tv-automation-atem-connection/commit/4b2db48))


### Features

* parse psu status ([16f677f](https://github.com/nrkno/tv-automation-atem-connection/commit/16f677f))
* Use device ModelId to determine how many psu to track in state ([f0631d1](https://github.com/nrkno/tv-automation-atem-connection/commit/f0631d1))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/nrkno/tv-automation-atem-connection/compare/0.5.1...0.5.2) (2018-09-23)


### Bug Fixes

* **socket:** prevent connection from dying when the main thread is blocked ([#19](https://github.com/nrkno/tv-automation-atem-connection/issues/19)) ([6814713](https://github.com/nrkno/tv-automation-atem-connection/commit/6814713))
* dsk state not being updated ([bcdea2b](https://github.com/nrkno/tv-automation-atem-connection/commit/bcdea2b))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/nrkno/tv-automation-atem-connection/compare/0.5.0...0.5.1) (2018-09-04)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.4.0...0.5.0) (2018-08-17)


### Bug Fixes

* macro state is not an array, it's one "macro player" ([76c8b7b](https://github.com/nrkno/tv-automation-atem-connection/commit/76c8b7b))
* typo in super source boxes capabilities command ([f123694](https://github.com/nrkno/tv-automation-atem-connection/commit/f123694))


### Features

* implement MacroRunStatus command (MRPr) ([98f5650](https://github.com/nrkno/tv-automation-atem-connection/commit/98f5650))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.3.2...0.4.0) (2018-08-15)


### Bug Fixes

* symmetry is a percentage ([3dd03a9](https://github.com/nrkno/tv-automation-atem-connection/commit/3dd03a9))


### Features

* Super Source Properties ([031df18](https://github.com/nrkno/tv-automation-atem-connection/commit/031df18))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/nrkno/tv-automation-atem-connection/compare/0.3.1...0.3.2) (2018-08-14)


### Bug Fixes

* symmetry is a percentage ([93e751d](https://github.com/nrkno/tv-automation-atem-connection/commit/93e751d))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/nrkno/tv-automation-atem-connection/compare/0.3.0...0.3.1) (2018-08-09)


### Bug Fixes

* reported transition position may be 10 000 ([c301808](https://github.com/nrkno/tv-automation-atem-connection/commit/c301808))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.2.3...0.3.0) (2018-08-07)


### Bug Fixes

* emit error upon failing value sanity check ([e11b3fa](https://github.com/nrkno/tv-automation-atem-connection/commit/e11b3fa))
* export util ([004ef9a](https://github.com/nrkno/tv-automation-atem-connection/commit/004ef9a))
* flyKeyFrameId is 1 or 2 ([b0ced83](https://github.com/nrkno/tv-automation-atem-connection/commit/b0ced83))
* use an object when appriopriate ([7d13bd3](https://github.com/nrkno/tv-automation-atem-connection/commit/7d13bd3))
* **atemSocket:** fix _maxPacketID being off-by-one ([28c1400](https://github.com/nrkno/tv-automation-atem-connection/commit/28c1400))


### Features

* value sanity checks ([9d2b021](https://github.com/nrkno/tv-automation-atem-connection/commit/9d2b021))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/nrkno/tv-automation-atem-connection/compare/0.2.2...0.2.3) (2018-08-07)


### Bug Fixes

* **atemSocket:** fix _maxPacketID being off-by-one ([e116c35](https://github.com/nrkno/tv-automation-atem-connection/commit/e116c35))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/nrkno/tv-automation-atem-connection/compare/0.2.1...0.2.2) (2018-08-06)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/nrkno/tv-automation-atem-connection/compare/0.2.0...0.2.1) (2018-07-01)


### Bug Fixes

* typo ([41a29ff](https://github.com/nrkno/tv-automation-atem-connection/commit/41a29ff))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/nrkno/tv-automation-atem-connection/compare/0.1.7...0.2.0) (2018-07-01)


### Features

* disconnect method ([54dfa15](https://github.com/nrkno/tv-automation-atem-connection/commit/54dfa15))



<a name="0.1.7"></a>
## [0.1.7](https://github.com/nrkno/tv-automation-atem-connection/compare/0.1.6...0.1.7) (2018-06-21)


### Bug Fixes

* deserialization of preview,program and aux source ([3c0027e](https://github.com/nrkno/tv-automation-atem-connection/commit/3c0027e))



<a name="0.1.6"></a>
## [0.1.6](https://github.com/nrkno/tv-automation-atem-connection/compare/0.1.5...0.1.6) (2018-06-21)


### Bug Fixes

* supersource info commands ([2e13938](https://github.com/nrkno/tv-automation-atem-connection/commit/2e13938))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/nrkno/tv-automation-atem-connection/compare/0.1.4...0.1.5) (2018-06-15)



<a name="0.1.4"></a>
## [0.1.4](https://github.com/nrkno/tv-automation-atem-connection/compare/0.1.3...0.1.4) (2018-06-15)


### Bug Fixes

* preview command sets the right property in the state ([103fabd](https://github.com/nrkno/tv-automation-atem-connection/commit/103fabd))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/nrkno/tv-automation-atem-connection/compare/0.1.2...0.1.3) (2018-06-09)


### Bug Fixes

* AbstractCommand works with static MaskFlags ([360f266](https://github.com/nrkno/tv-automation-atem-connection/commit/360f266))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/nrkno/tv-automation-atem-connection/compare/0.1.1...0.1.2) (2018-06-07)


### Bug Fixes

* export abstract command ([5c82037](https://github.com/nrkno/tv-automation-atem-connection/commit/5c82037))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/nrkno/tv-automation-atem-connection/compare/0.1.0...0.1.1) (2018-06-07)


### Bug Fixes

* export Abstract Command ([88a12b6](https://github.com/nrkno/tv-automation-atem-connection/commit/88a12b6))
* MaskFlags are a static property ([ddafc4f](https://github.com/nrkno/tv-automation-atem-connection/commit/ddafc4f))



<a name="0.1.0"></a>
# 0.1.0 (2018-06-05)


### Bug Fixes

* **API:** make properties a public member of commands ([a3b69d3](https://github.com/nrkno/tv-automation-atem-connection/commit/a3b69d3))
* **Aux command:** set default bus to 1, add a mask in the raw command ([db4f0ba](https://github.com/nrkno/tv-automation-atem-connection/commit/db4f0ba))
* **DVE Upstream Keyer:** Correct word size ([9ba5635](https://github.com/nrkno/tv-automation-atem-connection/commit/9ba5635))
* add correct ssh fingerprint ([6019e6e](https://github.com/nrkno/tv-automation-atem-connection/commit/6019e6e))
* prevent garbage data from being added to productName ([5b3417a](https://github.com/nrkno/tv-automation-atem-connection/commit/5b3417a))
* rename back to atem-connection ([e1b3e63](https://github.com/nrkno/tv-automation-atem-connection/commit/e1b3e63))
* rename library and add contributer ([a57299e](https://github.com/nrkno/tv-automation-atem-connection/commit/a57299e))
* **DVE Upstream Keyer:** property name should equal flag name ([d684198](https://github.com/nrkno/tv-automation-atem-connection/commit/d684198))
* rename workflow for better readability ([7f1fbd9](https://github.com/nrkno/tv-automation-atem-connection/commit/7f1fbd9))
* safely get the downstream keyer ([25bf0f1](https://github.com/nrkno/tv-automation-atem-connection/commit/25bf0f1))
* **Socket:** local packetId should start at 1 ([2199e5c](https://github.com/nrkno/tv-automation-atem-connection/commit/2199e5c))
* set rawnames ([b68ad41](https://github.com/nrkno/tv-automation-atem-connection/commit/b68ad41))
* **InputPropertiesCommand:** include the inputId of each source in the state tree ([3fdabba](https://github.com/nrkno/tv-automation-atem-connection/commit/3fdabba))
* **Socket:** fix parsing of packet name and length ([dc25ea7](https://github.com/nrkno/tv-automation-atem-connection/commit/dc25ea7))
* **Utility functions:** remove unnecessary utility functions ([a7d0f78](https://github.com/nrkno/tv-automation-atem-connection/commit/a7d0f78))
* tests ([4d3576a](https://github.com/nrkno/tv-automation-atem-connection/commit/4d3576a))
* update config for new features ([4682a64](https://github.com/nrkno/tv-automation-atem-connection/commit/4682a64))
* update ignores ([d79b224](https://github.com/nrkno/tv-automation-atem-connection/commit/d79b224))
* update scripts-info ([8508f98](https://github.com/nrkno/tv-automation-atem-connection/commit/8508f98))
* use ASCII encoding for strings, instead of utf8 ([8978d49](https://github.com/nrkno/tv-automation-atem-connection/commit/8978d49))


### Features

* **Inputs:** implement InPr (read) and CInL (write) commands ([17e1688](https://github.com/nrkno/tv-automation-atem-connection/commit/17e1688))
* **Media Player Status:** get and set play/loop/atBeginning and frames ([664af37](https://github.com/nrkno/tv-automation-atem-connection/commit/664af37))
* **SuperSource:** implement SSBP (read) and CSBP (write) commands ([b21e56e](https://github.com/nrkno/tv-automation-atem-connection/commit/b21e56e))
* Downstream Keyer Settings ([b90cf3a](https://github.com/nrkno/tv-automation-atem-connection/commit/b90cf3a))
* export commands and substates ([9be9e61](https://github.com/nrkno/tv-automation-atem-connection/commit/9be9e61))
* Initialization Complete Command ([ba55c89](https://github.com/nrkno/tv-automation-atem-connection/commit/ba55c89))
* top level connection status events ([1f606ed](https://github.com/nrkno/tv-automation-atem-connection/commit/1f606ed))
* Topology Command ([0380432](https://github.com/nrkno/tv-automation-atem-connection/commit/0380432))
* use external logging function, limit packet logs to debug mode ([b92f175](https://github.com/nrkno/tv-automation-atem-connection/commit/b92f175))



<a name="0.5.1"></a>
## [0.5.1](https://bitbucket.org/superflytv/node-boilerplate/compare/0.5.0...0.5.1) (2018-02-25)


### Bug Fixes

* remove auto-deploy to npm ([5515b71](https://bitbucket.org/superflytv/node-boilerplate/commits/5515b71))



<a name="0.5.0"></a>
# [0.5.0](https://bitbucket.org/superflytv/node-boilerplate/compare/0.4.6...0.5.0) (2018-02-25)


### Bug Fixes

* adding release for one final publication ([7f11b78](https://bitbucket.org/superflytv/node-boilerplate/commits/7f11b78))
* Cleaning up repository ([ba7cafc](https://bitbucket.org/superflytv/node-boilerplate/commits/ba7cafc))
* cleanup ([562fb0c](https://bitbucket.org/superflytv/node-boilerplate/commits/562fb0c))


### Features

* Disable automatic rollout to NPM for now ([18dd79f](https://bitbucket.org/superflytv/node-boilerplate/commits/18dd79f))



<a name="0.4.6"></a>
## [0.4.6](https://github.com/superflytv/node-boilerplate/compare/0.4.5...0.4.6) (2018-02-25)


### Bug Fixes

* add tslib ([2447570](https://github.com/superflytv/node-boilerplate/commit/2447570))



<a name="0.4.5"></a>
## [0.4.5](https://github.com/superflytv/node-boilerplate/compare/0.4.4...0.4.5) (2018-02-25)


### Bug Fixes

* send coverage before release ([b53c1aa](https://github.com/superflytv/node-boilerplate/commit/b53c1aa))



<a name="0.4.4"></a>
## [0.4.4](https://github.com/superflytv/node-boilerplate/compare/0.4.3...0.4.4) (2018-02-25)


### Bug Fixes

* auto rollout to npm on master branch ([ef5d68f](https://github.com/superflytv/node-boilerplate/commit/ef5d68f))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/superflytv/node-boilerplate/compare/0.4.2...0.4.3) (2018-02-25)


### Bug Fixes

* only allow spec.ts files ([027b4f2](https://github.com/superflytv/node-boilerplate/commit/027b4f2))
* use npm for npm deploy, for now ([0bb1911](https://github.com/superflytv/node-boilerplate/commit/0bb1911))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/superflytv/node-boilerplate/compare/0.4.1...0.4.2) (2018-02-25)


### Bug Fixes

* add ssh key to npm step for ssh ([8ca98f5](https://github.com/superflytv/node-boilerplate/commit/8ca98f5))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/superflytv/node-boilerplate/compare/v0.4.0...v0.4.1) (2018-02-25)


### Bug Fixes

* Set skip ci in auto-commit message and rename tag releases ([1338bd0](https://github.com/superflytv/node-boilerplate/commit/1338bd0))



<a name="0.4.0"></a>
# 0.4.0 (2018-02-25)


### Bug Fixes

* add ssh key to release build ([00a03c2](https://github.com/superflytv/node-boilerplate/commit/00a03c2))
* Auto-release on circleci ([64ba8d7](https://github.com/superflytv/node-boilerplate/commit/64ba8d7))
* Bugfix and add not strict for bitbucket ([0d5f60b](https://github.com/superflytv/node-boilerplate/commit/0d5f60b))
* casing issue ([71a7295](https://github.com/superflytv/node-boilerplate/commit/71a7295))
* changing to .org ([746f766](https://github.com/superflytv/node-boilerplate/commit/746f766))
* changing to .org ([b0837bc](https://github.com/superflytv/node-boilerplate/commit/b0837bc))
* Explicit coverage repoting ([1aac204](https://github.com/superflytv/node-boilerplate/commit/1aac204))
* indent style on yaml files ([3b3582b](https://github.com/superflytv/node-boilerplate/commit/3b3582b))
* indentation and paths wrong ([cad01af](https://github.com/superflytv/node-boilerplate/commit/cad01af))
* rearange commands ([c7ad4c1](https://github.com/superflytv/node-boilerplate/commit/c7ad4c1))
* Reordering workflow ([c912127](https://github.com/superflytv/node-boilerplate/commit/c912127))
* set correct ssh fingerprint ([616fc49](https://github.com/superflytv/node-boilerplate/commit/616fc49))
* Set git push command ([b825993](https://github.com/superflytv/node-boilerplate/commit/b825993))
* Set orgname ([9eb70e3](https://github.com/superflytv/node-boilerplate/commit/9eb70e3))
* setting git config ([a61c929](https://github.com/superflytv/node-boilerplate/commit/a61c929))
* Temporarily remove gh-pages publish ([c1cd735](https://github.com/superflytv/node-boilerplate/commit/c1cd735))
* use knownhost in stead of ssh config ([e432a10](https://github.com/superflytv/node-boilerplate/commit/e432a10))
* use knownhost in stead of ssh config ([3f37f75](https://github.com/superflytv/node-boilerplate/commit/3f37f75))


### Features

* full npm release cycle ([955863a](https://github.com/superflytv/node-boilerplate/commit/955863a))
* Initial boiler plate ([fbd16db](https://github.com/superflytv/node-boilerplate/commit/fbd16db))
* rename package for npm release ([53ac25c](https://github.com/superflytv/node-boilerplate/commit/53ac25c))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/superflytv/node-boilerplate/compare/v0.2.2...v0.3.0) (2018-02-25)


### Bug Fixes

* Auto-release on circleci ([64ba8d7](https://github.com/superflytv/node-boilerplate/commit/64ba8d7))
* Explicit coverage repoting ([1aac204](https://github.com/superflytv/node-boilerplate/commit/1aac204))
* indent style on yaml files ([3b3582b](https://github.com/superflytv/node-boilerplate/commit/3b3582b))


### Features

* full npm release cycle ([955863a](https://github.com/superflytv/node-boilerplate/commit/955863a))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/superflytv/node-boilerplate/compare/v0.2.1...v0.2.2) (2018-02-24)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/superflytv/node-boilerplate/compare/v0.2.0...v0.2.1) (2018-02-24)


### Bug Fixes

* Set orgname ([9eb70e3](https://github.com/superflytv/node-boilerplate/commit/9eb70e3))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/superflytv/node-boilerplate/compare/v0.1.0...v0.2.0) (2018-02-24)


### Features

* rename package for npm release ([53ac25c](https://github.com/superflytv/node-boilerplate/commit/53ac25c))



<a name="0.1.0"></a>
# 0.1.0 (2018-02-24)


### Bug Fixes

* casing issue ([71a7295](https://github.com/superflytv/node-boilerplate/commit/71a7295))


### Features

* Initial boiler plate ([fbd16db](https://github.com/superflytv/node-boilerplate/commit/fbd16db))
