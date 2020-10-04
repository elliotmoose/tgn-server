import { ObjectId } from "bson";

/**
 * 
 * @param {import(".").EntityDependancies} dependancies 
 * @returns {makeUser} makeUser
 */
export default function buildMakeUser({ Ids }) {
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
        if (!username) {
            throw new Error("User must have a username");
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