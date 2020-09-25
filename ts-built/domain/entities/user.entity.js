"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeUser(_a) {
    var Ids = _a.Ids, Errors = _a.Errors, Validation = _a.Validation;
    return function makeUser(_a) {
        var _b = _a.id, id = _b === void 0 ? Ids.makeId() : _b, username = _a.username, fullName = _a.fullName, email = _a.email, _c = _a.bio, bio = _c === void 0 ? "no bio" : _c, _d = _a.isPublic, isPublic = _d === void 0 ? false : _d, _e = _a.password, password = _e === void 0 ? null : _e, _f = _a.passwordSalt, passwordSalt = _f === void 0 ? null : _f, _g = _a.organisations, organisations = _g === void 0 ? [] : _g, _h = _a.following, following = _h === void 0 ? [] : _h, _j = _a.followers, followers = _j === void 0 ? [] : _j, _k = _a.role, role = _k === void 0 ? 'STANDARD' : _k;
        if (!Ids.isValidId(id)) {
            throw Errors.INVALID_PARAM("User Id");
        }
        if (!(Validation.isValidHandle(username) && Validation.isNonEmpty(username))) {
            throw Errors.MALFORMED_DATA("Invalid or missing username");
        }
        console.log(bio);
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
//# sourceMappingURL=user.entity.js.map