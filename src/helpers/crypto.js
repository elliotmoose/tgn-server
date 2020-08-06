let jwt = require('jsonwebtoken');
const { ERROR_TOKEN_EXPIRED, ERROR_INVALID_TOKEN } = require("../constants/errors");
let cryptoLib = require('crypto');

let crypto = {
    secret: null,    
    salt: null,    
    saltLength: 16,
    initialize (secret) {   
        this.secret = secret;
        this.salt = this.generateSalt();
    },
    generateSalt() {
        return cryptoLib
            .randomBytes(Math.ceil(this.saltLength / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, this.saltLength); /** return required number of characters */
    },
    checkInitialized (){
        if(this.secret === null || this.secret === null)
        {
            console.error("Crypto not initialised with secret/salt yet");
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
    hashPassword (password) {
        this.checkInitialized();
        let hash = cryptoLib.createHmac('sha512', this.salt); /** Hashing algorithm sha512 */
        hash.update(password);
        let value = hash.digest('hex');
        return value;
    },
    validatePassword(password, hash) {
        this.checkInitialized();
        let verifyHash = this.hashPassword(password);
        return verifyHash === hash;
    }
}
module.exports = crypto;
