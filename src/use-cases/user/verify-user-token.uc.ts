import Errors from './../../constants/Errors';
import { Crypto } from './../../helpers/crypto';
import { UserRepository } from './../../repositories/user.repo';
import { Ids } from '../../helpers/ids';
import { User } from './../../domain/entities/user.entity';

interface Dependencies {
    userRepo: UserRepository
    crypto: Crypto
    Ids: Ids
}

export default function makeVerifyUserToken({ userRepo, Ids, crypto } : Dependencies) : VerifyUserToken {
    return async function verifyUserToken(token: string){
        if (!token) {
            throw Errors.INVALID_TOKEN();
        }
        if (typeof token !== 'string') {
            throw Errors.INVALID_TOKEN();
        }
        
        let { userId } = crypto.decodeJsonWebToken(token);
        
        if(!(userId && Ids.isValidId(userId))) {
            throw Errors.INVALID_TOKEN();
        }

        let user = await userRepo.findById(userId);

        if(!user) {
            throw Errors.USER_NOT_FOUND();
        }

        return user;
    }
}

export interface VerifyUserToken {
    (token: string) : Promise<User>
}