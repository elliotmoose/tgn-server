"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
var _a = require("../constants/errors"), ERROR_TOKEN_EXPIRED = _a.ERROR_TOKEN_EXPIRED, ERROR_INVALID_TOKEN = _a.ERROR_INVALID_TOKEN;
var cryptoLib = require('crypto');
function makeCrypto(secret) {
    return {
        secret: secret,
        generateSalt: function (saltLength) {
            return cryptoLib
                .randomBytes(Math.ceil(saltLength / 2))
                .toString('hex') /** convert to hexadecimal format */
                .slice(0, saltLength); /** return required number of characters */
        },
        checkInitialized: function () {
            if (this.secret === null || this.secret === null) {
                console.error("Crypto not initialised with secret/salt yet");
            }
        },
        generateJsonWebToken: function (tokenData, expiresIn) {
            if (expiresIn === void 0) { expiresIn = null; }
            this.checkInitialized();
            var encodedToken = jwt.sign(tokenData, this.secret, expiresIn ? { expiresIn: expiresIn } : {});
            return encodedToken;
        },
        decodeJsonWebToken: function (token) {
            try {
                this.checkInitialized();
                /** @type {*} */
                var tokenData = jwt.verify(token, this.secret);
                return tokenData;
            }
            catch (error) {
                switch (error.name) {
                    case 'TokenExpiredError': {
                        throw ERROR_TOKEN_EXPIRED();
                    }
                    case 'JsonWebTokenError': {
                        throw ERROR_INVALID_TOKEN();
                    }
                    default: {
                        throw ERROR_INVALID_TOKEN();
                    }
                }
            }
        },
        hashPassword: function (password, salt) {
            this.checkInitialized();
            var hash = cryptoLib.createHmac('sha512', salt); /** Hashing algorithm sha512 */
            hash.update(password);
            var value = hash.digest('hex');
            return value;
        },
        verifyPassword: function (password, hash, salt) {
            this.checkInitialized();
            var verifyHash = this.hashPassword(password, salt);
            return verifyHash === hash;
        }
    };
}
exports.default = makeCrypto;
//# sourceMappingURL=crypto.js.map