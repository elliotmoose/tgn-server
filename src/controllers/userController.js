const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateUsername, validateEmail, validatePassword, sanitizedUserData } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED, ERROR_USER_NOT_FOUND } = require('../constants/errors');
const crypto = require('../helpers/crypto');
const ROLES = require('../constants/roles');

const User = mongoose.model('user');
const Organisation = mongoose.model('organisation');

const userController = {
    usernameTaken: async (username) => {
        assertRequiredParams({username});
        let userResult = await User.findOne({username});
        if(userResult)
        {
            return true;
        }

        return false;
    },
    getUserById: async (userId) => {
        try {
            assertRequiredParams({userId});
            assertParamTypeObjectId(userId);
            let user = await User.findById(userId);        
            if(!user)
            {
                throw ERROR_USER_NOT_FOUND;
            }
            
            return sanitizedUserData(user.toJSON());            
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    createUser: async (userData) => {
        let { username, email, firstName, lastName, password } = userData;

        assertRequiredParams({ username, email, firstName, lastName, password });
        validateUsername(username);
        validateEmail(email);
        validatePassword(password);

        //check for duplicate username/email
        let usernameTaken = await User.findOne({ username });
        let handleTaken = await Organisation.findOne({handle: username});
        let emailTaken = await User.findOne({ email });

        if (usernameTaken || handleTaken) {
            throw ERROR_USERNAME_TAKEN;
        }

        if (emailTaken) {
            throw ERROR_EMAIL_TAKEN;
        }

        let passwordSalt = crypto.generateSalt(16);
        let hashedPassword = crypto.hashPassword(password, passwordSalt);

        let newUser = new User({
            username, firstName, lastName, email,
            password: hashedPassword,
            passwordSalt,
            role: ROLES.STANDARD
        });

        let newUserDoc = await newUser.save();
        return sanitizedUserData(newUserDoc.toJSON());
    },
    login : async (credentials) => {
        try {
            let { username, password } = credentials;            
            assertRequiredParams({username, password});

            //get user
            let userDoc = await User.findOne({username});
            
            if(!userDoc)
            {
                throw ERROR_LOGIN_FAILED;
            }  
            
            if(!crypto.verifyPassword(password, userDoc.password, userDoc.passwordSalt))
            {
                throw ERROR_LOGIN_FAILED;                
            }
            
            let userData = sanitizedUserData(userDoc.toJSON())

            //generate user token
            let token = crypto.generateJsonWebToken({userId: userData._id});
            
            return {
                user: userData,
                token
            };
        } catch (error) {
            throw error;
        }
    },
    update: async (userId, newUserData) => {
        try {
            let updatedUserDoc = await User.findOneAndUpdate({_id: userId}, newUserData, {new: true}).exec();            
            return sanitizedUserData(updatedUserDoc.toJSON());
        } catch (error) {
            console.log('====== to find out what error formating is for mongoose when cannot find relevant doc');
            console.log(error);
            throw error;
        }
    }
}

module.exports = userController;