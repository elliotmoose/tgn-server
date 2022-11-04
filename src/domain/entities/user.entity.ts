import { Validation } from './../../helpers/Validation';
import { Errors } from './../../constants/Errors';
import { Ids } from './../../helpers/Ids';
import { Id } from '../../helpers/ids';

interface Dependencies {
    Ids: Ids,
    Errors: Errors,
    Validation : Validation
}

export interface User {
    id: Id,
    username: string,
    fullName: string,
    email: string,
    bio: string,
    isPublic: Boolean,
    password: string | null,
    passwordSalt: string | null,
    organisations: Array<string>,
    following: Array<string>,
    followers: Array<string>,
    role: string
}

export default function buildMakeUser({ Ids, Errors, Validation } : Dependencies) {
    return function makeUser({
        id = Ids.makeId(),
        username,
        fullName,
        email,
        bio = "no bio",
        isPublic = false,
        organisations = [],
        following = [],
        followers = [],
        role = 'STANDARD'
    }) {
        if(!Ids.isValidId(id)) {
            throw Errors.INVALID_PARAM("userId");
        }

        if(!(Validation.isValidHandle(username) && Validation.isNonEmpty(username))) {
            throw Errors.MALFORMED_DATA("Invalid or missing username")
        }

        return Object.freeze({
            id,
            username,
            fullName,
            email,
            bio,
            isPublic,            
            organisations,
            following,
            followers,
            role
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