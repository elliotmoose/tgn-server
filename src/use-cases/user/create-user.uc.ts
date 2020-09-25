import { Validation, Errors, Crypto } from './user.usecase.depend.interfaces';
import { UserRepository, OrganisationRepo } from './user.usecase.depend.interfaces';

import { makeUser } from "../../domain/entities";

interface Dependencies {
    userRepo : UserRepository
    organisationRepo : OrganisationRepo,
    crypto: Crypto
    Validation: Validation,
    Errors: Errors
}

export default function makeCreateUser({ userRepo, organisationRepo, crypto, Validation, Errors } : Dependencies) {
    return async function createUser(userData) {
        const {
            username, 
            password, 
            fullName,
            email,
            bio
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

        let usernameTaken = await userRepo.exists(username);
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
        
        // await userRepo.insert({
        //     username, 
        //     fullName, 
        //     email, 
        //     bio,
        //     password: hashedPassword,            
        //     passwordSalt,
        //     // role: ROLES.STANDARD
        // })

      
        const user = makeUser(userData);
        let newUser = await userRepo.insert(user);
        return newUser;
    }
}