const mongoose = require('mongoose');
const { checkRequiredFields: assertRequiredParams, throwError } = require('../helpers/apiHelper');
const { validateUsername, validateEmail, validatePassword } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED } = require('../constants/errors');
const crypto = require('../helpers/crypto');

const User = mongoose.model('user');

const userController = {
    getUserById: async (userId) => {
        return await User.findById(userId);
    },
    createUser: async (userData) => {
                
        try {
            let { username, email, firstName, lastName, password } = userData;
            
            assertRequiredParams({username, email, firstName, lastName, password});
            validateUsername(username);
            validateEmail(email);
            validatePassword(password);

            //check for duplicate username/email
            let usernameTaken = await User.findOne({username}).exec();
            let emailTaken = await User.findOne({email}).exec();
            
            if(usernameTaken)
            {
                throw ERROR_USERNAME_TAKEN;
            }
            
            if(emailTaken)
            {
                throw ERROR_EMAIL_TAKEN;
            }

            let hashedPassword = crypto.hashPassword(password);
            let newUser = new User({ username, firstName, lastName, email, password: hashedPassword});                
            let newUserDoc = await newUser.save();
            return {
                id: newUserDoc._id,
                username: newUserDoc.username,
                email: newUserDoc.email,
                firstName: newUserDoc.firstName,
                lastName: newUserDoc.lastName
            }
        } catch (error) {
            throwError(error);
        }
    },
    login : async (credentials) => {
        try {
            let { username, password } = credentials;            
            assertRequiredParams({username, password});

            //get user
            let user = await User.findOne({username}).exec();
            
            if(!user)
            {
                throw ERROR_LOGIN_FAILED;
            }  
            
            if(!crypto.validatePassword(password, user.password))
            {
                throw ERROR_LOGIN_FAILED;                
            }
            
            //generate user token
            let token = crypto.generateJsonWebToken({userId: user._id});
            
            return {
                user,
                token
            };
        } catch (error) {
            throwError(error);
        }
    }
}

module.exports = userController;