const { ERROR_MISSING_PARAM, ERROR_INTERNAL_SERVER, ERROR_INVALID_PARAM, APIError } = require("../constants/errors");
const mongoose = require('mongoose');

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
            //force to fit format
            let isExternal = error instanceof APIError;
            let errorFinal;
            if(!isExternal)
            {
                console.log(error.stack);
                errorFinal = {...ERROR_INTERNAL_SERVER().toJSON(), err: `${error.toJSON()}`};
            }
            else {
                errorFinal = error.toJSON();
            }
            
            body.error = errorFinal;
            status = errorFinal.status;
        }

        res.status(status).send(body);
    },
    assertRequiredParams(fields) {
        Object.keys(fields).forEach((key)=>{
            if(fields[key] === undefined || fields[key] === null || fields[key] === '')
            {
                throw ERROR_MISSING_PARAM();
            }
        });
    },
    assertParamTypeObjectId(param) {
        if(!mongoose.Types.ObjectId.isValid(param))
        {
            console.log(new Error(`Invalid object id: ${param}`).stack);
            // console.log(`Invalid object id: ${param}`);
            throw ERROR_INVALID_PARAM(`ObjectId`);
        }
    },
    assertParamResolved(params) {
        Object.keys(params).forEach((key)=>{
            if(params[key] === undefined || params[key] === null || params[key] === '')
            {
                console.log(`Param not resolved: ${key}`);
                throw ERROR_INTERNAL_SERVER();
            }
        });
    }
}

module.exports = helpers;