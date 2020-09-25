"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = (function () {
    switch (process.env.NODE_ENV) {
        case 'TEST':
            return {
                PORT: 8080,
                DB: 'mongodb://localhost:27017/TGN_TEST'
            };
        case 'DEV':
            return {
                PORT: 8080,
                DB: 'mongodb://localhost:27017/TGN'
            };
        case 'SERVER_DEV':
            return {
                PORT: 8081,
                DB: 'mongodb://localhost:27017/TGN'
            };
        case 'PROD':
            return {
                PORT: 8080,
                DB: 'mongodb://localhost:27017/TGN_TEST'
            };
        default:
            return {
                PORT: 8080,
                DB: 'mongodb://localhost:27017/TGN_TEST'
            };
    }
})();
exports.default = config;
//# sourceMappingURL=config.js.map