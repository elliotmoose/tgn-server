import { Errors } from './../../constants/Errors';
import { FindUser } from './../../use-cases/user/find-user.uc';
interface Dependencies {
    findUser: FindUser,
    Errors: Errors
}

export default function makeGetUser ({ findUser, Errors }) {
    return async function login(httpReq) {
        const userId = httpReq.paramUser;
        const newUser = await findUser(userId);

        if(!newUser) {
            throw Errors.USER_NOT_FOUND();
        }

        return newUser;
    }
}