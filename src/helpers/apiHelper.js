const { ERROR_MISSING_PARAM, ERROR_INTERNAL_SERVER } = require("../constants/errors");

const helpers = {
    /**
     * Sends a response, with a status code, 
     * @param {import("express").Response} res 
     * @param {*} status 
     * @param {*} error 
     */
    respond(res, data, error=undefined) {
        let body = {
            data,
            error
        }

        let status = 200;
        if(error)
        {
            body.error = error;
            status = error.status;
        }

        res.status(status).send(body);
    },
    /**
     * Ensures format for error thrown to routes before sending
     * @param {*} errObject 
     */
    throwError(errObject){
        let isExternal = errObject.status && errObject.message;
        if(isExternal)
        {
            throw errObject;
        }
        else 
        {            
            throw {...ERROR_INTERNAL_SERVER, err: errObject}
        }
    },
    checkRequiredFields(fields) {
        Object.keys(fields).forEach((key)=>{
            if(fields[key] === undefined || fields[key] === null || fields[key] === '')
            {
                throw ERROR_MISSING_PARAM;
            }
        });
    },
}

module.exports = helpers;