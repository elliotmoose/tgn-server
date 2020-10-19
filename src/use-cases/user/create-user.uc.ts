import { Crypto } from './../../helpers/crypto';
import { OrganisationRepository } from './../../repositories/organisation.repo';
import { Validation } from './../../helpers/Validation';
import { UserRepository } from './../../repositories/user.repo';
import { makeUser } from "../../domain/entities";
import Errors from '../../constants/Errors';

interface Dependencies {
    userRepo : UserRepository
    organisationRepo : OrganisationRepository,
    crypto: Crypto
    Validation: Validation,
}

export default function makeCreateUser({ userRepo, organisationRepo, crypto, Validation } : Dependencies) {
    return async function createUser(userData) {
        const {
            username, 
            password, 
            fullName,
            email,
        } = userData;

        //validation
        if(!Validation.isValidEmail(email)) {
            throw Errors.INVALID_PARAM("Email");
        }

        if(!Validation.isValidHandle(username)) {
            throw Errors.INVALID_PARAM("Username");
        }

        if(!Validation.isValidPassword(password)) {
            throw Errors.INVALID_PARAM("Password");
        }

        if(!fullName) {
            throw Errors.INVALID_PARAM("Full Name");
        }

        let usernameTaken = await userRepo.exists({ username });
        let handleTaken = await organisationRepo.exists({ username });
        let emailTaken = await userRepo.exists({ email })

        if (usernameTaken || handleTaken) {
            throw Errors.USERNAME_TAKEN();
        }

        if (emailTaken) {
            throw Errors.EMAIL_TAKEN();
        }

        let passwordSalt = crypto.generateSalt(16);
        let hashedPassword = crypto.hashPassword(password, passwordSalt);
        
        let user = makeUser({
            username,
            fullName,
            password: hashedPassword,
            passwordSalt,
            email,
        })

        let newUser = await userRepo.insert({
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            password: user.password,
            passwordSalt: user.passwordSalt,
            email: user.email,
            bio: user.bio,
            isPublic: user.isPublic,
            organisations: user.organisations,
            followers: user.followers,
            following: user.following,
            role: user.role
        });

        return newUser;
    }
}