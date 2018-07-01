# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
