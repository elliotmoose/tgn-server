import { Ids } from './../../helpers/Ids';
import { UserRepository } from './../../repositories/user.repo';
import { User } from './../../domain/entities/user.entity';
// import { UserRepository, Crypto } from './user.input.port';

import { makeUser } from "../../domain/entities";
import Errors from '../../constants/Errors';

interface Dependencies {
    userRepo : UserRepository,
    Ids: Ids,
}

export default function makeFindUser({ userRepo, Ids } : Dependencies) {
    return async function findUser(userIdOrUsername) {    
        let user;

        if(Ids.isValidId(userIdOrUsername)) {
            user = await userRepo.findById(userIdOrUsername);
        }
        else {
            user = await userRepo.find({username: userIdOrUsername});
        }

        if(!user) {
            throw Errors.USER_NOT_FOUND();
        }

        return makeUser(user);
    }
}

export interface FindUser {
    (userIdOrUsername: string) : Promise<User>
}