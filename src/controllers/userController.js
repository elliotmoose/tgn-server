const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateUsername, validateEmail, validatePassword, sanitizedUserData } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED, ERROR_USER_NOT_FOUND, ERROR_CANNOT_FOLLOW_SELF, ERROR_ALREADY_FOLLOWING_USER } = require('../constants/errors');
const crypto = require('../helpers/crypto');
const ROLES = require('../constants/roles');

const User = mongoose.model('user');
const Organisation = mongoose.model('organisation');

const userController = {
    async usernameTaken (username) {
        assertRequiredParams({username});
        let userResult = await User.findOne({username});
        if(userResult)
        {
            return true;
        }

        return false;
    },
    async getUserByIdOrHandle (userIdOrHandle) {
        assertRequiredParams({userIdOrHandle});
            
        let userDoc = null;
        if (mongoose.Types.ObjectId.isValid(userIdOrHandle))
        {
            userDoc = await User.findOne({$or: [
                { username: userIdOrHandle },
                { _id: userIdOrHandle }
            ]});
        }
        else 
        {
            userDoc = await User.findOne({ username: userIdOrHandle });
        }
        
        if(!userDoc)
        {
            throw ERROR_USER_NOT_FOUND;
        }        
        
        
        return sanitizedUserData(userDoc.toJSON());
    },
    async createUser (userData) {
        let { username, email, fullName, password } = userData;

        assertRequiredParams({ username, email, fullName, password });
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
            username, fullName, email,
            password: hashedPassword,
            passwordSalt,
            role: ROLES.STANDARD
        });

        let newUserDoc = await newUser.save();
        return sanitizedUserData(newUserDoc.toJSON());
    },
    async login (credentials) {
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
    async update (userId, newUserData) {
        try {
            let updatedUserDoc = await User.findOneAndUpdate({_id: userId}, newUserData, {new: true}); 
            return sanitizedUserData(updatedUserDoc.toJSON());
        } catch (error) {
            console.log('====== to find out what error formating is for mongoose when cannot find relevant doc');
            console.log(error);
            throw error;
        }
    },
    async getFollowingUserIds(userId) {
        assertRequiredParams({userId});
        assertParamTypeObjectId(userId);

        let user = await User.findOne({_id: userId}).select('following');
        if(!user)
        {
            throw ERROR_USER_NOT_FOUND;
        }

        let following = user.toJSON().following;

        return following;
    },
    async follow(isFollowingUserId, toFollowUserId) {
        assertRequiredParams({isFollowingUserId,toFollowUserId});
        assertParamTypeObjectId(isFollowingUserId);
        assertParamTypeObjectId(toFollowUserId);
        
        if(mongoose.Types.ObjectId(isFollowingUserId).equals(toFollowUserId)) {
            throw ERROR_CANNOT_FOLLOW_SELF;
        }

        let followingUserExists = await User.exists({_id: isFollowingUserId});
        let toFollowUserExists = await User.exists({_id: toFollowUserId});
        
        if(!followingUserExists || !toFollowUserExists) {
            throw ERROR_USER_NOT_FOUND;
        }
        
        let alreadyFollowing = await User.exists({_id: toFollowUserId, following: {$eq: isFollowingUserId}});
        let alreadyFollowedBy = await User.exists({_id: toFollowUserId, followers: {$eq: isFollowingUserId}});
        
        if(alreadyFollowedBy || alreadyFollowing)
        {
            throw ERROR_ALREADY_FOLLOWING_USER;
        }
        
        let user = await User.findOneAndUpdate({_id: isFollowingUserId}, {$push: {following: toFollowUserId}});
        let userToFollow = await User.findOneAndUpdate({_id: toFollowUserId}, {$push: {followers: isFollowingUserId}}); 
        
        console.log('follow 3');
        return true;
    }
}

module.exports = userController;