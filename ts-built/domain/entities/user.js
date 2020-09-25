"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeUser(_a) {
    var Ids = _a.Ids, Errors = _a.Errors, Validation = _a.Validation;
    return function makeUser(_a) {
        var _b = _a.id, id = _b === void 0 ? Ids.makeId() : _b, username = _a.username, name = _a.name, email = _a.email, isPublic = _a.isPublic, password = _a.password, organisations = _a.organisations, following = _a.following, followers = _a.followers;
        if (!Ids.isValidId(id)) {
            throw Errors.INVALID_PARAM("User Id");
        }
        if (!(Validation.isValidHandle(username) && Validation.isNonEmpty(username))) {
            throw Errors.MALFORMED_DATA("Invalid or missing username");
        }
        return Object.freeze({
            id: id,
            username: username,
            name: name,
            email: email,
            isPublic: isPublic,
            password: password,
            organisations: organisations,
            following: following,
            followers: followers
        });
    };
}
exports.default = buildMakeUser;
// export interface User {
//     id?: String,
//     username: String,
//     password?: String,
//     name?: String,
//     email?: String,
//     isPublic?: Boolean,
//     organisations?: [ObjectId | String],
//     following?: [ObjectId | String],
//     followers?: [ObjectId | String],
// }
// export interface makeUser {
//     (parameters: {
//         id?: String,
//         username: String,
//         password?: String,
//         name?: String,
//         email?: String,
//         isPublic?: Boolean,
//         organisations?: [ObjectId | String],
//         following?: [ObjectId | String],
//         followers?: [ObjectId | String],
//     }): User
// }
