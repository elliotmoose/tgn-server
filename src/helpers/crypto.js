let jwt = require('jsonwebtoken');
const { ERROR_TOKEN_EXPIRED, ERROR_INVALID_TOKEN } = require("../constants/errors");

let crypto = {
    secret: null,    
    initialize (secret) {   
        this.secret = secret;
    },
    checkInitialized (){
        if(this.secret === null)
        {
            console.error("Crypto not initialised with secret yet");
        }
    },
    generateJsonWebToken (tokenData, expiresIn=null) {        
        this.checkInitialized();
        let encodedToken = jwt.sign(tokenData, this.secret, expiresIn ? {expiresIn} : {});
        return encodedToken;
    },
    decodeJsonWebToken (token) {
        try {
            this.checkInitialized();
            /** @type {*} */
            let tokenData = jwt.verify(token, this.secret);            
            return tokenData;
        } catch (error) {
            switch (error.name) {
                case 'TokenExpiredError': {
                    throw ERROR_TOKEN_EXPIRED;
                }
                case 'JsonWebTokenError': {
                    throw ERROR_INVALID_TOKEN;
                }
                default: {
                    throw ERROR_INVALID_TOKEN;
                }
            }
        }

    },
}

module.exports = crypto;
