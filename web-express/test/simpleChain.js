const Blockchain = require('../lib/simpleChain.js');

const myBlockChain = new Blockchain.Blockchain();
(function theLoop (i) {
    setTimeout(function () {
        myBlockChain.addBlock("Test Block - " + (i + 1)).then((result) => {
            console.log(result);
            i++;
            if (i < 2) {
                theLoop(i);
            } else {
                myBlockChain.validateChain();
                myBlockChain.validateBlock(1);
                myBlockChain.validateBlock(2);
            }
        });
    }, 1000);
})(0);