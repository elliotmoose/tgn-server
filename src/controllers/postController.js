const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateUsername, validateEmail, validatePassword, sanitizedUserData } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED, ERROR_POST_NOT_FOUND, ERROR_REACTION_EXISTS, ERROR_INVALID_PARAM, ERROR_REACTION_NOT_FOUND } = require('../constants/errors');
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
    reactionCounterKeyFromType(reactionType) {
        let counterKeyPrefixes = ['love', 'like', 'pray', 'praise'];
        let prefixIndex = counterKeyPrefixes.indexOf(reactionType.toLowerCase());
        
        if(prefixIndex == -1)
        {
            throw ERROR_INVALID_PARAM('Reaction Type');
        }

        return counterKeyPrefixes[prefixIndex] + 'ReactionCount';
    },
    async reactToPost (reactionType, postId, userId) {
        assertRequiredParams({reaction: reactionType, postId, userId});

        let reactionData = {
            userId, 
            reactionType
        };

        //should not react the same type twice, but can react other types
        let existingReactionPost = await Post.findOne({'reactions.userId': userId, 'reactions.reactionType': reactionType})
        if(existingReactionPost)
        {
            throw ERROR_REACTION_EXISTS;
        }

        let counterKey = this.reactionCounterKeyFromType(reactionType);

        let updatedPostDoc = await Post.findOneAndUpdate({_id: postId}, {
            $inc: {
                [counterKey]: 1
            },
            $push: {reactions: reactionData}}, {new: true});
        
        if(!updatedPostDoc)
        {
            throw ERROR_POST_NOT_FOUND;
        }
        
        return;
    },
    /**
     * 
     * @param {*} reactionType 
     * @param {*} postId 
     * @param {*} userId 
     * @return {Promise<undefined>} 
     */
    async unreactToPost (reactionType, postId, userId) {
        assertRequiredParams({reaction: reactionType, postId, userId});

        let reactionData = {
            userId, 
            reactionType
        };

        let existingReaction = await Post.findOne({'reactions.userId': userId, 'reactions.reactionType': reactionType})
        if(!existingReaction)
        {
            throw ERROR_REACTION_NOT_FOUND;
        }

        let counterKey = this.reactionCounterKeyFromType(reactionType);

        let updatedPostDoc = await Post.findOneAndUpdate({_id: postId}, {
            $inc: {
                [counterKey]: -1
            },
            $pull: {reactions: reactionData}}, {new: true});
        
        if(!updatedPostDoc)
        {
            throw ERROR_POST_NOT_FOUND;
        }
        
        return;
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