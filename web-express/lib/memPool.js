const config = require('../config/config');
const Request = require('../model/request.js');

class MemPool {
    constructor() {
        this.mempool = [];
        this.validatedAddresses = [];
        this.timeoutRequests = [];
    }

    checkRequest(walletAddress){
        let self = this, index;
        return new Promise(function(resolve, reject) {
            try {
                index = self.mempool.findIndex( request => request.walletAddress === walletAddress );
                resolve(index);
            } catch(err) {
                reject(err);
            }
        });
    }

    removeValidationRequest(walletAddress){
        let self = this;
        return self.checkRequest(walletAddress).then((index) => {
            if (index === -1) {
                return;
            }
            self.mempool.splice(index, 1);
            delete this.timeoutRequests[walletAddress];
            return;
        });
    }

  	addRequest(walletAddress){
        let self = this, request;
        return self.checkRequest(walletAddress).then((index) => {
            // add the request if does not exist
            if (index === -1) {
                request = new Request.Request(walletAddress);
                self.mempool.push(request);
                self.timeoutRequests[walletAddress] = setTimeout(function () {
                    self.removeValidationRequest(walletAddress)
                }, config.TimeoutRequestsWindowTime*1000);
                return request;
            }
            // update the request field if the request exists
            request = self.mempool[index];
            request.updateRequest();
            return request;
        });
    }

    checkValidation(walletAddress){
        let self = this, index;
        return new Promise(function(resolve, reject) {
            try {
                index = self.validatedAddresses.findIndex( address => address === walletAddress );
                resolve(index);
            } catch(err) {
                reject(err);
            }
        });
    }

    addValidatedAddress(walletAddress){
        let self = this;
        return self.checkValidation(walletAddress).then((index) => {
            if (index === -1) {
                self.validatedAddresses.push(walletAddress);
            }
            return self.removeValidationRequest(walletAddress);
        });
    }

    removeValidatedAddresses(walletAddress){
        let self = this;
        return self.checkValidation(walletAddress).then((index) => {
            if (index === -1) {
                return;
            }
            return self.validatedAddresses.splice(index, 1);
        });
    }
}

// Export the object
module.exports = new MemPool();