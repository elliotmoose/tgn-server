"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a = require("../constants/errors"), ERROR_MISSING_PARAM = _a.ERROR_MISSING_PARAM, ERROR_INTERNAL_SERVER = _a.ERROR_INTERNAL_SERVER, ERROR_INVALID_PARAM = _a.ERROR_INVALID_PARAM, APIError = _a.APIError;
var mongoose = require('mongoose');
var helpers = {
    /**
     * Sends a response, with a status code,
     * @param {import("express").Response} res
     * @param {*} status
     * @param {*} error
     */
    respond: function (res, data, error) {
        if (error === void 0) { error = undefined; }
        var body = {
            data: data,
            error: error
        };
        var status = 200;
        if (error) {
            //force to fit format
            var isExternal = error && error.status && error.message && error.code && error.toJSON;
            var errorFinal = void 0;
            if (!isExternal) {
                console.log(error.stack);
                errorFinal = __assign(__assign({}, ERROR_INTERNAL_SERVER().toJSON()), { err: "" + error.toJSON() });
            }
            else {
                errorFinal = error.toJSON();
            }
            body.error = errorFinal;
            status = errorFinal.status;
        }
        res.status(status).send(body);
    },
    assertRequiredParams: function (fields) {
        Object.keys(fields).forEach(function (key) {
            if (fields[key] === undefined || fields[key] === null || fields[key] === '') {
                throw ERROR_MISSING_PARAM();
            }
        });
    },
    assertParamTypeObjectId: function (param) {
        if (!mongoose.Types.ObjectId.isValid(param)) {
            console.log(new Error("Invalid object id: " + param).stack);
            // console.log(`Invalid object id: ${param}`);
            throw ERROR_INVALID_PARAM("ObjectId");
        }
    },
    assertParamResolved: function (params) {
        Object.keys(params).forEach(function (key) {
            if (params[key] === undefined || params[key] === null || params[key] === '') {
                console.log("Param not resolved: " + key);
                throw ERROR_INTERNAL_SERVER();
            }
        });
    }
};
module.exports = helpers;
