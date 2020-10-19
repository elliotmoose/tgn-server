import { Crypto } from './../../helpers/crypto';
import { UserRepository } from './../../repositories/user.repo';
import { Ids } from './../../helpers/Ids';
import { User } from './../../domain/entities/user.entity';

import { makeUser } from "../../domain/entities";

interface Dependencies {
    userRepo: UserRepository
    crypto: Crypto
    Ids: Ids
}

export default function makeVerifyUserToken({ userRepo, Ids, crypto } : Dependencies) : VerifyUserToken {
    return async function verifyUserToken(token: string){
        if (!token) {
            return null;
        }
        if (typeof token !== 'string') {
            return null;
        }

        //Bearer <jwt>
        let encryptedJwt = token.split(' ')[1];
        // let decodeJwt
        let { userId } = crypto.decodeJsonWebToken(encryptedJwt);

        if(!(userId && Ids.isValidId(userId))) {
            return null;
        }

        let user = await userRepo.findById(userId);
        
        return user;
    }
}

export interface VerifyUserToken {
    (token: string) : Promise<User | null>
}