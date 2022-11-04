import { UserRepository } from '../../repositories/user.repo';
import { Ids } from '../../helpers/ids';
import { User } from '../../domain/entities/user.entity';
import Errors from '../../constants/Errors';

import { makeUser } from "../../domain/entities";

interface Dependencies {
    userRepo : UserRepository,
    Ids: Ids,
}


export default function makeFollowUser({ userRepo, Ids } : Dependencies) {
    return async function followUser(userId, targetUserId) {    
        
        const validUserId = Ids.isValidId(userId);
        const validTargetUserId = Ids.isValidId(targetUserId);

        if(!validUserId || !validTargetUserId) {
            throw Errors.INVALID_PARAM("userId");
        }          
    }
}