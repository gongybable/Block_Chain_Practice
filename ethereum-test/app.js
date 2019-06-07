var Web3 = require("web3");
var EthereumTransaction = require("ethereumjs-tx");

var web3 = new Web3('HTTP://127.0.0.1:7545')

var sendingAddress = '0xB4e7Ff563bFb7C9820b504c00AB4441d4d20Ad93';
var receivingAddress = '0x283712973118902a88874800c88Ba55ac12C60fE'

web3.eth.getBalance(sendingAddress).then(console.log);
web3.eth.getBalance(receivingAddress).then(console.log)

// /*##########################
// CREATE A TRANSACTION
// ##########################*/
var rawTransaction = { nonce: 0, to: receivingAddress, gasPrice: 20000000, gasLimit: 30000, value: 1000000, data: "" }

// /*##########################
// Sign the Transaction
// ##########################*/
var privateKeySender = 'fcde00f7e9522fa323b27bf72d55691900f3f0866a8cb3944581cb06d11f5f7b';
var privateKeySenderHex = new Buffer.from(privateKeySender, 'hex');
var transaction = new EthereumTransaction(rawTransaction);
transaction.sign(privateKeySenderHex)

/*#########################################
Send the transaction to the network
#########################################*/
var serializedTransaction = transaction.serialize();
web3.eth.sendSignedTransaction(serializedTransaction);