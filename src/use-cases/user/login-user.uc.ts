import { Validation, Errors } from './user.usecase.depend.interfaces';
import { UserRepository, Crypto } from './user.usecase.depend.interfaces';

import { makeUser } from "../../domain/entities";

interface Dependencies {
    userRepo : UserRepository,
    crypto: Crypto,
    Errors: Errors
}

export default function makeLoginUser({ userRepo, crypto, Errors } : Dependencies) {
    return async function loginUser(userData) {
        const {
            username, 
            password, 
        } = userData;

        // const user = makeUser(userData);

        const user = await userRepo.find({ username }, ['username', 'password', 'passwordSalt']);

        if(!user) {
            throw Errors.LOGIN_FAILED();
        }

        const correctPassword = crypto.verifyPassword(password, user.password as string, user.passwordSalt as string);

        if(!correctPassword) {
            throw Errors.LOGIN_FAILED();
        }

        const newUser = await userRepo.insert(user);
        return newUser;
    }
}