import { Ids, Errors, Validation } from './entity.depend.interfaces';

interface Dependencies {
    Ids: Ids,
    Errors: Errors,
    Validation : Validation
}

export default function buildMakeUser({ Ids, Errors, Validation } : Dependencies) {
    return function makeUser({
        id,
        username,
        name,
        email,
        isPublic,
        password,
        organisations,
        following,
        followers
    }) {
        if(!Ids.isValidId(id)) {
            throw Errors.INVALID_PARAM("User Id");
        }

        if (!username) {
            throw Errors.MALFORMED_DATA("Missing Username");
        }

        return Object.freeze({
            id,
            username,
            name,
            email,
            isPublic,
            password,
            organisations,
            following,
            followers
        });
    }
}

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