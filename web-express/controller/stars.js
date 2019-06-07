const hex2ascii = require('hex2ascii');
const Blockchain = require('../lib/simpleChain.js');
const validator = require('../lib/validator.js');
const getHashSchema = require('../schema/stars/hash.json');
const getAddressSchema = require('../schema/stars/address.json');

const validationError = function validationError(e) {
    var err = new Error();
    err.validation = e;
    throw err;
}

class StarsController {
    constructor(app) {
        this.app = app;
        this.myBlockChain = new Blockchain.Blockchain();
        this.getStarsHash();
        this.getStarsAddress();
    }

    getStarsHash() {
        this.app.get("/stars/hash/:hash", (req, res, next) => {
            let getInfo = req.params, self = this, promiseArr = [], matchedBlocks = [], i;

            let getHashMatch = function (height, hash) {
                return self.myBlockChain.getBlock(height).then((block) => {
                    if (block.hash === hash) {
                        block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                        matchedBlocks.push(block);
                    }
                    return;
                });
            }

            if (!validator.validate(getInfo, getHashSchema)) {
                validationError(validator.getLastErrors());
            }

            return self.myBlockChain.getBlockHeight().then((blockHeight) => {
                for (i=1; i<=blockHeight; i++) {
                    promiseArr.push(getHashMatch(i, getInfo.hash));
                }
                return Promise.all(promiseArr);
            }).then(() => {
                if (matchedBlocks.length === 1) {
                    return res.send(matchedBlocks[0]);
                }
                validationError([{ code: 'INVALID_VALUE', path: '#/hash', "message": "hash does not exist in the chain" }]);
            }).catch(next);
        });
    }

    getStarsAddress() {
        this.app.get("/stars/address/:walletAddress", (req, res, next) => {
            let getInfo = req.params, self = this, promiseArr = [], matchedBlocks = [], i;

            let getWalletAddressMatch = function (height, walletAddress) {
                return self.myBlockChain.getBlock(height).then((block) => {
                    if (block.body.walletAddress === walletAddress) {
                        block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                        matchedBlocks.push(block);
                    }
                    return;
                });
            }

            if (!validator.validate(getInfo, getAddressSchema)) {
                validationError(validator.getLastErrors());
            }

            return self.myBlockChain.getBlockHeight().then((blockHeight) => {
                for (i=1; i<=blockHeight; i++) {
                    promiseArr.push(getWalletAddressMatch(i, getInfo.walletAddress));
                }
                return Promise.all(promiseArr);
            }).then(() => {
                return res.send(matchedBlocks);
            }).catch(next);
        });
    }
}

module.exports = (app) => { return new StarsController(app);}