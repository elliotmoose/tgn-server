import { UserRepository } from './../../repositories/user.repo';
import { Ids } from './../../helpers/Ids';
import { User } from '../../domain/entities/user.entity';
import Errors from '../../constants/Errors';

import { makeUser } from "../../domain/entities";

interface Dependencies {
    userRepo : UserRepository,
    Ids: Ids,
}

export default function makeIsFollowingUser({ userRepo, Ids } : Dependencies) {
    return async function isFollowingUser(userId, targetUserId) {    
        
        const validUserId = Ids.isValidId(userId);
        const validTargetUserId = Ids.isValidId(targetUserId);

        if(!validUserId || !validTargetUserId) {
            throw Errors.INVALID_PARAM("User Id");
        }

        const isFollowing = await userRepo.userHasFollower(userId, targetUserId);
        
        if(isFollowing) {
            return true;
        }

        return false;
    }
}

export interface IsFollowingUser {
    (userId: string, targetUserId: string) : Promise<Boolean>
}