const config = require('../config/config');

class Request {
	constructor(data){
		this.walletAddress = data;
        this.validationWindow = config.TimeoutRequestsWindowTime;
        this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
        this.message = "";
        
        this.updateRequest();
    }
    
    updateRequest(){
        let newTimeStamp = new Date().getTime().toString().slice(0,-3);
        let timeElapse = newTimeStamp - this.requestTimeStamp;
        let timeLeft = this.validationWindow - timeElapse;
        
        this.validationWindow = timeLeft;
        this.requestTimeStamp = newTimeStamp;
        this.message = this.walletAddress + ":" + newTimeStamp + ":starRegistry";
    }
}

module.exports.Request = Request;