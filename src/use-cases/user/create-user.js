
import { makeUser } from "../../entities";

/**
 * 
 * @param {{userDb: {insert, update}}} dependencies
 */
export default function makeCreateUser({ userDb }) {
    return async function createUser({
        username, 
        password, 
        email
    }) {
        const userData = {
            username, 
            password, 
            email
        };

        const user = makeUser(userData);
        let newUser = await userDb.insert(user);
        return newUser;
    }
}