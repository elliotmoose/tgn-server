import { FindUser } from './../../use-cases/user/find-user.uc';
import { Errors } from '../../constants/Errors';

interface Dependencies {
    Errors: Errors
    findUser: FindUser
}

export default function makeSetParamUserMiddleware ({ findUser, Errors } : Dependencies) {
    return async function setParamUserMiddleware(httpReq, next) {
        
        let userIdOrHandle = httpReq.params.userIdOrHandle;
        let userData = await findUser(userIdOrHandle);
        if (!userData) {
            throw Errors.USER_NOT_FOUND();
        }

        httpReq.paramUser = userData;
        next();
    }
}