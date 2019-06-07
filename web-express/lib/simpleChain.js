const SHA256 = require('crypto-js/sha256');
const Block = require('../model/block.js');
const LevelSandboxClass = require('./levelSandbox.js');

const db = new LevelSandboxClass.LevelSandbox();


class Blockchain{
    constructor(){
        this.addGenesisBlock("First block in the chain - Genesis block");
    }

    generateHash(block) {
        // Use this to create a temporary reference of the class object
        return new Promise(function(resolve, reject) {
            try {
                let hash = SHA256(JSON.stringify(block)).toString();
                resolve(hash);
            } catch (err) {
                reject(err);
            }
        });
    }

    addGenesisBlock(data) {
        let self = this;
        return self.getBlockHeight().then((height) => {
            if (height > -1) {
                return;
            }
            return self.addBlock(data);
        }).catch((err) => { console.log(err); });
    }
    // Add new block
    addBlock(data){
        let self = this;
        let blockHeight;
        let newBlock = new Block.Block(data);
        return self.getBlockHeight().then((height) => {
            blockHeight = height + 1;
            newBlock.height = blockHeight;
            if (blockHeight > 0) {
                return self.getBlock(blockHeight - 1);
            }
            return;
        }).then((prevBlock) => {
            if (prevBlock) {
                newBlock.previousBlockHash = prevBlock.hash;
            }
            return self.generateHash(newBlock);
        }).then((newHash) => {
            newBlock.hash = newHash;
            return db.addLevelDBData(blockHeight, JSON.stringify(newBlock));
        }).catch((err) => { console.log(err); });
    }

    // Get block height
    getBlockHeight(){
        return db.getBlockHeight().then((height) => {
            return height;
        }).catch((err) => { console.log(err); });
    }

    // get block
    getBlock(blockHeight){
        // return object as a single string
        return db.getLevelDBData(blockHeight).then((block) => {
            if (block !== undefined) {
                return JSON.parse(block);
            }
            return;
        }).catch((err) => { console.log(err); });
    }

    // validate block
    validateBlock(blockHeight){
        let self = this;
        let blockHash;
        return self.getBlock(blockHeight).then((block) => {
            blockHash = block.hash;
            block.hash = '';
            return self.generateHash(block);
        }).then((newBlockHash) => {
            if (blockHash===newBlockHash) {
                return true;
            } else {
                console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                return false;
            }
        }).catch((err) => { console.log(err); });
    }

    // Validate blockchain
    validateChain(){
        let errorLog = [];
        let self = this;
        let promiseArr = [];
        let asyncFunc = function (height) {
            let currentBlock;
            return self.validateBlock(height).then((valid) => {
                if (!valid) {
                    errorLog.push(height);
                }
                return self.getBlock(height);
            }).then((block) => {
                currentBlock = block;
                return self.getBlock(height + 1);
            }).then((nextBlock) => {
                if (currentBlock.hash !== nextBlock.previousBlockHash) {
                    errorLog.push(height);
                }
                return;
            })
        }
        return db.getBlockHeight().then((height) => {
            for (var i = 0; i < height; i++) {
                promiseArr.push(asyncFunc(i));
            }
            return Promise.all(promiseArr);
        }).then(() => {
            if (errorLog.length>0) {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: '+errorLog);
            } else {
                console.log('No errors detected');
            }
            return;
        }).catch((err) => { console.log(err); });
    }
}

module.exports.Blockchain = Blockchain;