"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.login = exports.signup = void 0;
//use case dependencies
var user_1 = require("../../use-cases/user");
//import controllers
var signup_controller_1 = __importDefault(require("./signup.controller"));
var login_controller_1 = __importDefault(require("./login.controller"));
var get_user_controller_1 = __importDefault(require("./get-user.controller"));
// import makeFollowUser from "./follow-user.controller";
// import makeGetFollowers from "./get-followers.controller";
// import makeGetFollowing from "./get-following.controller";
// import makeGetIsFollowing from "./get-is-following.controller";
//initialise user controller makers
exports.signup = signup_controller_1.default({ createUser: user_1.createUser });
exports.login = login_controller_1.default({ loginUser: user_1.loginUser });
exports.getUser = get_user_controller_1.default({ findUser: user_1.findUser });
// export const editUser = makeGetUser({ updateUser });
// export const getUserOrganisations = makeGetUser({ findUserOrganisations });
// export const getUserPosts = makeGetUser({ findUserPosts });
// export const followUser = makeFollowUser({ findUser, updateUser });
// export const getFollowers = makeGetFollowers({ findUserFollowers });
// export const getFollowing = makeGetFollowing({ findUserFollowing });
// export const getIsFollowing = makeGetIsFollowing({ findUserFollowing });
//expose user controllers
exports.default = {
    signup: exports.signup,
    login: exports.login,
    getUser: exports.getUser,
};
