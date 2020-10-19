import { Crypto } from './../../helpers/crypto';
import { UserRepository } from './../../repositories/user.repo';
import Errors from '../../constants/Errors';

import { makeUser } from "../../domain/entities";

interface Dependencies {
    userRepo : UserRepository,
    crypto: Crypto,
}

export default function makeLoginUser({ userRepo, crypto } : Dependencies) {
    return async function loginUser(userData) {
        const {
            username, 
            password, 
        } = userData;

        const passwordData = await userRepo.retrievePasswordHashAndSalt(username);

        if(!passwordData) {
            throw Errors.LOGIN_FAILED();
        }

        const correctPassword = crypto.verifyPassword(password, passwordData.password, passwordData.passwordSalt);

        if(!correctPassword) {
            throw Errors.LOGIN_FAILED();
        }

        return await userRepo.find({ username });
    }
}