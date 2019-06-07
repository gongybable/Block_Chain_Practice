const hex2ascii = require('hex2ascii');
const Blockchain = require('../lib/simpleChain.js');
const MemPool = require('../lib/memPool.js');
const validator = require('../lib/validator.js');
const postSchema = require('../schema/block/post.json');

const validationError = function validationError(e) {
    var err = new Error();
    err.validation = e;
    throw err;
}

class BlockController {
    constructor(app) {
        this.app = app;
        this.memPool = MemPool;
        this.myBlockChain = new Blockchain.Blockchain();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    getBlockByIndex() {
        this.app.get("/block/:blockheight", (req, res, next) => {
            let height;
            try {
                height = parseInt(req.params.blockheight);
            } catch (err) {
                validationError(err);
            }
            return this.myBlockChain.getBlock(height).then((blockData) => {
                if (blockData === undefined) {
                    validationError([{ code: 'INVALID_VALUE', path: '#/blockheight', "message": "blockheight does not exist" }]);
                }
                if (height !== 0) {
                    blockData.body.star.storyDecoded = hex2ascii(blockData.body.star.story);
                }
                return res.send(blockData);
            }).catch(next);
        });
    }

    postNewBlock() {
        this.app.post("/block", (req, res, next) => {
            let self = this, postInfo = req.body, blockData;

            if (!validator.validate(postInfo, postSchema)) {
                validationError(validator.getLastErrors());
            }

            return self.memPool.checkValidation(postInfo.walletAddress).then((index) => {
                if (index === -1) {
                    validationError([{ code: 'INVALID_VALUE', path: '#/walletAddress', "message": "walletAddress is not validated" }]);
                }
                return self.memPool.removeValidatedAddresses(postInfo.walletAddress);
            }).then(() => {
                blockData = JSON.parse(JSON.stringify(postInfo));
                blockData.star.story = Buffer.from(blockData.star.story).toString('hex')
                return self.myBlockChain.addBlock(blockData);
            }).then((ret) => {
                return res.send(JSON.parse(ret));
            }).catch(next);
        });
    }
}

module.exports = (app) => { return new BlockController(app);}