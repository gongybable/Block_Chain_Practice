const bitcoinMessage = require('bitcoinjs-message'); 
const MemPool = require('../lib/memPool.js');
const validator = require('../lib/validator.js');
const requestSchema = require('../schema/validation/request.json');
const validateSchema = require('../schema/validation/validate.json');

const validationError = function validationError(e) {
    var err = new Error();
    err.validation = e;
    throw err;
}

class RequestValidation {
    constructor(app) {
        this.app = app;
        this.memPool = MemPool;
        this.postRequestValidation();
        this.postValidate();
    }

    postRequestValidation() {
        this.app.post("/requestValidation", (req, res, next) => {
            let postInfo = req.body, self = this;

            if (!validator.validate(postInfo, requestSchema)) {
                validationError(validator.getLastErrors());
            }

            return self.memPool.addRequest(postInfo.walletAddress).then((ret) => {
                return res.send(ret);
            }).catch(next);
        });
    }

    postValidate() {
        this.app.post("/message-signature/validate", (req, res, next) => {
            let postInfo = req.body, self = this, resp = {}, request, isValid;

            if (!validator.validate(postInfo, validateSchema)) {
                validationError(validator.getLastErrors());
            }

            return self.memPool.checkRequest(postInfo.walletAddress).then((index) => {
                if (index === -1) {
                    validationError([{ code: 'INVALID_VALUE', path: '#/walletAddress', "message": "walletAddress is not requested for validation" }]);
                }
                request = self.memPool.mempool[index];
                isValid = bitcoinMessage.verify(request.message, postInfo.walletAddress, postInfo.signature);

                if (!isValid) {
                    validationError([{ code: 'INVALID_VALUE', path: '#/signature', "message": "signature is not valid" }]);
                }
                return self.memPool.addValidatedAddress(postInfo.walletAddress);
            }).then(() => {
                resp.registerStar = true;
                resp.status = {};
                resp.status.walletAddress = request.walletAddress;
                resp.status.requestTimeStamp = request.requestTimeStamp;
                resp.status.message = request.message;
                resp.status.validationWindow = request.validationWindow;
                resp.status.messageSignature = request.messageSignature;

                return res.send(resp);
            }).catch(next);
        });
    }
}

module.exports = (app) => { return new RequestValidation(app);}