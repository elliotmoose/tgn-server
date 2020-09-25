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
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeExpressCallback = void 0;
var ERROR_INTERNAL_SERVER = require("../constants/errors").ERROR_INTERNAL_SERVER;
function makeExpressCallback(controllerMethod) {
    return function (req, res) {
        function respond(data, error) {
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
        }
        controllerMethod(req)
            .then(function (responseData) { return respond(responseData); })
            .catch(function (error) { return respond({}, error); });
    };
}
exports.makeExpressCallback = makeExpressCallback;
