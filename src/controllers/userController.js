const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateUsername, validateEmail, validatePassword, sanitizedUserData } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED, ERROR_USER_NOT_FOUND, ERROR_CANNOT_FOLLOW_SELF, ERROR_ALREADY_FOLLOWING_USER, ERROR_NOT_FOLLOWING_USER } = require('../constants/errors');
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
    compareEqualUserIds(userIdA, userIdB) {        
        return mongoose.Types.ObjectId.isValid(userIdA) && mongoose.Types.ObjectId(userIdA).equals(userIdB);
    },
    async getUserByIdOrHandle (userIdOrHandle, populateFollows=false) {
        assertRequiredParams({userIdOrHandle});
            
        let query = null;
        if (mongoose.Types.ObjectId.isValid(userIdOrHandle))
        {            
            query = User.findOne({$or: [
                { username: userIdOrHandle },
                { _id: userIdOrHandle }
            ]});
        }
        else 
        {
            query = User.findOne({ username: userIdOrHandle });
        }

        let userDoc = populateFollows ? 
        await query 
        : 
        await query
        .populate({path: 'following', select: 'username'})
        .populate({path: 'followers', select: 'username'});
        
        if(!userDoc)
        {
            throw ERROR_USER_NOT_FOUND;
        }        
        
        
        return sanitizedUserData(userDoc.toJSON());
    },
    async createUser (userData) {
        let { username, email, fullName, password, bio } = userData;

        assertRequiredParams({ username, email, fullName, password });
        validateUsername(username);
        validateEmail(email);
        validatePassword(password);

        //check for duplicate username/email
        let usernameTaken = await User.exists({ username });
        let handleTaken = await Organisation.exists({handle: username});
        let emailTaken = await User.exists({ email });

        if (usernameTaken || handleTaken) {
            throw ERROR_USERNAME_TAKEN;
        }

        if (emailTaken) {
            throw ERROR_EMAIL_TAKEN;
        }

        let passwordSalt = crypto.generateSalt(16);
        let hashedPassword = crypto.hashPassword(password, passwordSalt);

        let newUser = new User({
            username, fullName, email, bio,
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
    async follow(followerUserId, toFollowUserId) {
        assertRequiredParams({isFollowingUserId: followerUserId,toFollowUserId});
        assertParamTypeObjectId(followerUserId);
        assertParamTypeObjectId(toFollowUserId);
        
        if(mongoose.Types.ObjectId(followerUserId).equals(toFollowUserId)) {
            throw ERROR_CANNOT_FOLLOW_SELF;
        }

        let followingUserExists = await User.exists({_id: followerUserId});
        let toFollowUserExists = await User.exists({_id: toFollowUserId});
        
        if(!followingUserExists || !toFollowUserExists) {
            throw ERROR_USER_NOT_FOUND;
        }
        
        // let alreadyFollowing = await User.exists({_id: toFollowUserId, following: {$eq: isFollowingUserId}});
        // let alreadyFollowedBy = await User.exists({_id: toFollowUserId, followers: {$eq: isFollowingUserId}});
        let alreadyFollowing = await this.isFollowing(followerUserId, toFollowUserId);
        
        if(alreadyFollowing)
        {
            throw ERROR_ALREADY_FOLLOWING_USER;
        }
        
        await User.findOneAndUpdate({_id: followerUserId}, {$push: {following: toFollowUserId}});
        await User.findOneAndUpdate({_id: toFollowUserId}, {$push: {followers: followerUserId}});         
        // return sanitizedUserData(userToFollow.toJSON());
    },
    async unfollow(followerUserId, toFollowUserId) {

        assertRequiredParams({isFollowingUserId: followerUserId,toFollowUserId});
        assertParamTypeObjectId(followerUserId);
        assertParamTypeObjectId(toFollowUserId);
        
        if(mongoose.Types.ObjectId(followerUserId).equals(toFollowUserId)) {
            throw ERROR_CANNOT_FOLLOW_SELF;
        }

        let followingUserExists = await User.exists({_id: followerUserId});
        let toFollowUserExists = await User.exists({_id: toFollowUserId});
        
        if(!followingUserExists || !toFollowUserExists) {
            throw ERROR_USER_NOT_FOUND;
        }
        
        let alreadyFollowing = await this.isFollowing(followerUserId, toFollowUserId);
        
        if(!alreadyFollowing)
        {
            throw ERROR_NOT_FOLLOWING_USER; 
        }
        
        let user = await User.findOneAndUpdate({_id: followerUserId}, {$pull: {following: toFollowUserId}});
        let userToFollow = await User.findOneAndUpdate({_id: toFollowUserId}, {$pull: {followers: followerUserId}}); 
    },
    async isFollowing(userId, targetUserId)
    {
        assertParamTypeObjectId(userId);
        assertParamTypeObjectId(targetUserId);
        let isFollowing = await User.exists({_id: userId, following: {$eq: targetUserId}});
        let isFollowedBy = await User.exists({_id: targetUserId, followers: {$eq: userId}});
        return isFollowing && isFollowedBy;
    },
}

module.exports = userController;