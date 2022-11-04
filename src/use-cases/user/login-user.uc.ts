import { Crypto } from './../../helpers/crypto';
import { UserRepository } from './../../repositories/user.repo';
import Errors from '../../constants/Errors';

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

        if(!username) {
            throw Errors.INVALID_PARAM('username');
        }
        
        if(!password) {
            throw Errors.INVALID_PARAM('password');
        }

        const passwordData = await userRepo.retrievePasswordHashAndSalt(username);
        
        if(!passwordData || !passwordData.password || !passwordData.passwordSalt) {
            throw Errors.LOGIN_FAILED();
        }


        const correctPassword = crypto.verifyPassword(password, passwordData.password, passwordData.passwordSalt);

        if(!correctPassword) {
            throw Errors.LOGIN_FAILED();
        }
    
        const user = await userRepo.find({ username });
        
        if(!user) {
            throw Errors.LOGIN_FAILED();
        }

        const jwt = crypto.generateJsonWebToken({userId: user.id});
        return {
            user,
            token: jwt
        };
    }
}