"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeUser(_a) {
    var Ids = _a.Ids, Errors = _a.Errors, Validation = _a.Validation;
    return function makeUser(_a) {
        var _b = _a.id, id = _b === void 0 ? Ids.makeId() : _b, username = _a.username, fullName = _a.fullName, email = _a.email, bio = _a.bio, _c = _a.isPublic, isPublic = _c === void 0 ? false : _c, _d = _a.password, password = _d === void 0 ? null : _d, _e = _a.passwordSalt, passwordSalt = _e === void 0 ? null : _e, _f = _a.organisations, organisations = _f === void 0 ? [] : _f, _g = _a.following, following = _g === void 0 ? [] : _g, _h = _a.followers, followers = _h === void 0 ? [] : _h, role = _a.role;
        if (!Ids.isValidId(id)) {
            throw Errors.INVALID_PARAM("User Id");
        }
        if (!(Validation.isValidHandle(username) && Validation.isNonEmpty(username))) {
            throw Errors.MALFORMED_DATA("Invalid or missing username");
        }
        return Object.freeze({
            id: id,
            username: username,
            fullName: fullName,
            email: email,
            bio: bio,
            isPublic: isPublic,
            password: password,
            passwordSalt: passwordSalt,
            organisations: organisations,
            following: following,
            followers: followers,
            role: role
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
