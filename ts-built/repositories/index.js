"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organisationRepo = exports.postRepo = exports.userRepo = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var user_repo_1 = __importDefault(require("./user.repo"));
var post_repo_1 = __importDefault(require("./post.repo"));
var organisation_repo_1 = __importDefault(require("./organisation.repo"));
var UserModel = mongoose_1.default.model('user');
var PostModel = mongoose_1.default.model('post');
var OrganisationModel = mongoose_1.default.model('organisation');
exports.userRepo = user_repo_1.default({ UserModel: UserModel });
exports.postRepo = post_repo_1.default({ PostModel: PostModel });
exports.organisationRepo = organisation_repo_1.default({ OrganisationModel: OrganisationModel });
exports.default = { userRepo: exports.userRepo, postRepo: exports.postRepo, organisationRepo: exports.organisationRepo };
