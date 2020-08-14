const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateUsername, validateEmail, validatePassword, sanitizedUserData } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED, ERROR_POST_NOT_FOUND, ERROR_ALREADY_REACTED_TO_POST } = require('../constants/errors');
const crypto = require('../helpers/crypto');
const ROLES = require('../constants/roles');

const User = mongoose.model('user');
const Organisation = mongoose.model('organisation');
const Post = mongoose.model('post');

const postController = {
    /**
     * 
     * @param {{content}} postData 
     * @param {*} userId 
     * @param {*} targets 
     */
    async makePost (postData, userId, targets) {
        let {content} = postData;

        assertRequiredParams({content, userId});

        let newPost = new Post({
            userId, content,     
        });

        let newPostDoc = await newPost.save();
    
        return newPostDoc.toJSON();
    },
    async reactToPost (reactionType, postId, userId) {
        assertRequiredParams({reaction: reactionType, postId, userId});

        let reactionData = {
            userId, 
            reactionType
        };

        //should not react the same type twice, but can react other types
        let duplicateReaction = await Post.findOne({'reactions.userId': userId, 'reactions.reactionType': reactionType})
        if(duplicateReaction)
        {
            throw ERROR_ALREADY_REACTED_TO_POST;
        }

        let updatedPostDoc = await Post.findOneAndUpdate({_id: postId}, {$push: {reactions: reactionData}}, {new: true});
        
        if(!updatedPostDoc)
        {
            throw ERROR_POST_NOT_FOUND;
        }
        
        return updatedPostDoc.toJSON();
    },
    
    async commentOnPost (comment, postId, userId) {
        assertRequiredParams({comment, postId, userId});

        let commentData = {
            userId, 
            content: comment
        };

        let updatedPostDoc = await Post.findOneAndUpdate({postId}, {$push: {
            comments: commentData
        }}, {new: true});
        
        return updatedPostDoc.toJSON();
    },
    async getPostsByUser (userId) {
        assertRequiredParams({userId});
        let posts = await Post.find({userId});
        
        if(!posts)
        {
            return [];
        }
        return posts;
    }
}

module.exports = postController;