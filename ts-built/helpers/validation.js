"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers = {
    isValidEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    isValidHandle: function (handle) {
        var re = /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/;
        return re.test(handle);
    },
    isValidPassword: function (password) {
        //TODO: validation for password
        var re = /.+/;
        return re.test(password);
    },
    isNonEmpty: function (value) {
        return value !== undefined && value !== null && value !== '';
    },
};
exports.default = helpers;
//# sourceMappingURL=Validation.js.map