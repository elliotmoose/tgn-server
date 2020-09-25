import { Ids, Errors } from './user.usecase.depend.interfaces';
import { UserRepository, Crypto } from './user.usecase.depend.interfaces';

import { makeUser } from "../../domain/entities";

interface Dependencies {
    userRepo : UserRepository,
    Ids: Ids,
    Errors: Errors
}

export default function makeFindUser({ userRepo, Ids, Errors } : Dependencies) {
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