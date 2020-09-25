"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.loginUser = exports.createUser = void 0;
//repo dependencies
var index_1 = require("./../../repositories/index");
//helper dependencies
var Errors = __importStar(require("../../constants/Errors"));
var Validation_1 = __importDefault(require("../../helpers/Validation"));
var Ids_1 = __importDefault(require("../../helpers/Ids"));
//use cases
var create_user_uc_1 = __importDefault(require("./create-user.uc"));
var login_user_uc_1 = __importDefault(require("./login-user.uc"));
var find_user_uc_1 = __importDefault(require("./find-user.uc"));
var crypto_1 = __importDefault(require("../../helpers/crypto"));
var secret = 'mooselliot';
var crypto = crypto_1.default(secret);
//initialise use case makers
exports.createUser = create_user_uc_1.default({ userRepo: index_1.userRepo, organisationRepo: index_1.organisationRepo, crypto: crypto, Validation: Validation_1.default, Errors: Errors });
exports.loginUser = login_user_uc_1.default({ userRepo: index_1.userRepo, crypto: crypto, Errors: Errors });
exports.findUser = find_user_uc_1.default({ userRepo: index_1.userRepo, Ids: Ids_1.default, Errors: Errors });
//expose use cases
exports.default = { createUser: exports.createUser, loginUser: exports.loginUser, findUser: exports.findUser };
