const { ERROR_INVALID_PARAM } = require("../constants/errors");


const helpers = {
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(email).toLowerCase()))
        {
            throw ERROR_INVALID_PARAM('email');
        }
    },
    validateUsername(username) {
        const re = /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/;
        if(!re.test(username))
        {
            throw ERROR_INVALID_PARAM('username');
        }
    },
    validatePassword(password) {
        //TODO: validation for password
        const re = /.+/;
        if(!re.test(password))
        {
            throw ERROR_INVALID_PARAM('password');
        }        
    },
    sanitizedUserData(userData) {
        return {
            ...userData,
            password: undefined,
            passwordSalt: undefined
        }
    }
}

module.exports = helpers;