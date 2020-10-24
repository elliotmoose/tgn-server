import { Errors } from './../../constants/Errors';
import { VerifyUserToken } from "../../use-cases/user/verify-user-token.uc";

interface Dependencies {
    verifyUserToken: VerifyUserToken,
    Errors: Errors
}

export default function makeSetUserMiddleware ({ verifyUserToken, Errors } : Dependencies) {
    return async function setUserMiddleware(httpReq, next) {
        let authorization = httpReq.headers.authorization || null;
        
        if (!authorization) {
            throw Errors.MISSING_TOKEN();
        }
        
        if (!(typeof authorization === 'string')) {
            throw Errors.INVALID_TOKEN();
        }

        const token = authorization.split(' ')[1];
        const user = await verifyUserToken(token);       
 
        if (!user) {
            throw Errors.INVALID_TOKEN();            
        }
        
        httpReq.user = user;
        next();
    }
}