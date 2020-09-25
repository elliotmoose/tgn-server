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
exports.makeReaction = exports.makePost = exports.makeOrganisation = exports.makeUser = void 0;
//dependencies
var Ids_1 = __importDefault(require("../../helpers/Ids"));
var Errors = __importStar(require("../../constants/Errors"));
var Validation_1 = __importDefault(require("../../helpers/Validation"));
//entities
var organisation_entity_1 = __importDefault(require("./organisation.entity"));
var post_entity_1 = __importDefault(require("./post.entity"));
var reaction_entity_1 = __importDefault(require("./reaction.entity"));
var user_entity_1 = __importDefault(require("./user.entity"));
//initialise entity makers
exports.makeUser = user_entity_1.default({ Ids: Ids_1.default, Errors: Errors, Validation: Validation_1.default });
exports.makeOrganisation = organisation_entity_1.default({ Ids: Ids_1.default, Errors: Errors, Validation: Validation_1.default });
exports.makePost = post_entity_1.default({ Ids: Ids_1.default, Errors: Errors });
exports.makeReaction = reaction_entity_1.default({ Ids: Ids_1.default, Errors: Errors });
//expose entities
exports.default = { makeUser: exports.makeUser, makeOrganisation: exports.makeOrganisation, makePost: exports.makePost, makeReaction: exports.makeReaction };
