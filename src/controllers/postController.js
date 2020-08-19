const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateUsername, validateEmail, validatePassword, sanitizedUserData } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED, ERROR_POST_NOT_FOUND, ERROR_REACTION_EXISTS, ERROR_INVALID_PARAM, ERROR_REACTION_NOT_FOUND } = require('../constants/errors');
const crypto = require('../helpers/crypto');
const ROLES = require('../constants/roles');

const User = mongoose.model('user');
const Organisation = mongoose.model('organisation');
const Post = mongoose.model('post');

const reactionCountKeyPrefixes = ['love', 'like', 'pray', 'praise'];

const postController = {
    /**
     * 
     * @param {{content, postType, target}} postData 
     * @param {*} userId 
     */
    async makePost (postData, userId) {
        let {content, postType, target} = postData;

        assertRequiredParams({content, postType, userId});
        if(target)
        {
            assertParamTypeObjectId(target);
        }

        let newPost = new Post({
            user: userId, content, postType, target, 
        });

        let newPostDoc = await newPost.save();
    
        return newPostDoc.toJSON();
    },
    async getPost (postId) {
        assertRequiredParams({postId});
        assertParamTypeObjectId(postId);
        let post = await Post.findOne({_id: postId})
        .populate({path: 'user', select: 'username'})
        .populate({path: 'target', select: 'name handle'})
        .select('-reactions -comments');

        //most reacted
        let postData = post.toJSON();
        
        let maxReactionType = null;
        let maxReactionCount = 0;
        let totalReactionCount = 0;

        for(let reaction of reactionCountKeyPrefixes)
        {
            let key = reaction + 'ReactionCount';
            let reactionCount = postData[key];
            totalReactionCount += reactionCount;
            
            if(reactionCount > maxReactionCount &&  reactionCount != 0)
            {
                maxReactionCount = reactionCount;
                maxReactionType = reaction;
            }
        }
        
        postData.maxReactionType = maxReactionType;
        postData.reactionCount = totalReactionCount;

        return postData;
    },
    reactionCounterKeyFromType(reactionType) {
        let prefixIndex = reactionCountKeyPrefixes.indexOf(reactionType.toLowerCase());
        
        if(prefixIndex == -1)
        {
            throw ERROR_INVALID_PARAM('Reaction Type');
        }

        return reactionCountKeyPrefixes[prefixIndex] + 'ReactionCount';
    },
    async reactToPost (reactionType, postId, userId) {
        assertRequiredParams({reaction: reactionType, postId, userId});

        let reactionData = {
            user: userId, 
            reactionType
        };

        //should not react the same type twice, but can react other types
        let existingReactionPost = await Post.findOne({'reactions.user': userId, 'reactions.reactionType': reactionType})
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
            user: userId, 
            reactionType
        };

        let existingReaction = await Post.findOne({'reactions.user': userId, 'reactions.reactionType': reactionType})
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

        let updatedPostDoc = await Post.findOneAndUpdate({_id: postId}, {
            $inc: {
                commentCount: 1
            },
            $push: {
                comments: commentData
            }
        }, {new: true}).select('-reactions -comments');
        
        if(!updatedPostDoc)
        {
            throw ERROR_POST_NOT_FOUND;
        }

        return updatedPostDoc.toJSON();
    },
    async getPostsByUserId (userId) {        
        assertRequiredParams({userId});
        let posts = await Post.find({user: userId}).select('-comments -reactions');
        
        if(!posts)
        {
            return [];
        }
        return posts;
    },
    async getFeed(userIds, dateBefore, pageSize) {
        //get posts that are posted by the users
        let PAGE_SIZE = parseInt(pageSize) || 10;
        let DATE_BEFORE = dateBefore || Date.now();
        
        let posts = await Post.find({user: {$in: userIds}, datePosted: {$lt : DATE_BEFORE}})
        .sort('-datePosted')        
        .limit(PAGE_SIZE)
        .populate({path: 'user', select: 'username'})
        .populate({path: 'target', select: 'name handle'})
        // .populate({path: 'reactions.user', select: 'username'})
        .select('-reactions -comments')
        
        //TODO: needs to filter out posts useer does not have access to
        return posts.map(post => post.toJSON());
    }
}



module.exports = postController;