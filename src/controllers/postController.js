const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { ERROR_POST_NOT_FOUND, ERROR_REACTION_EXISTS, ERROR_INVALID_PARAM, ERROR_REACTION_NOT_FOUND } = require('../constants/errors');

const Post = mongoose.model('post');
const Comment = mongoose.model('comment');
const Reaction = mongoose.model('reaction');

const reactionTypes = ['love', 'like', 'pray', 'praise'];
const postTypes = ['testimony', 'pray for me', 'announcement'];

const postController = {
    /**
     * 
     * @param {{content, postType, target}} postData 
     * @param {*} userId 
     */
    async makePost (postData, userId) {
        let {content, postType, target} = postData;
        
        assertRequiredParams({content, postType, userId});
        this.assertValidPostType(postType);

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
    async getPost (postId, viewerUserId) {
        assertRequiredParams({postId});
        assertParamTypeObjectId(postId);
        let query = Post.findOne({_id: postId});
        let post = await this.execPopulatedPostFindQuery(viewerUserId, query);

        if(!post) {
            throw ERROR_POST_NOT_FOUND;
        }

        return post;
    },
    async getComments(postId, dateAfter, pageSize) {
        assertRequiredParams({postId});
        assertParamTypeObjectId(postId);

        let PAGE_SIZE = parseInt(pageSize) || 10;
        let DATE_AFTER = dateAfter || new Date(0);

        let comments = await Comment.find({post: postId, datePosted: {$gt : DATE_AFTER}})
        .sort('datePosted')        
        .limit(PAGE_SIZE)
        .populate({
            path : 'user',
            select: 'username'
        })

        return comments || [];
    },
    assertValidPostType(postType) {
        let prefixIndex = postTypes.indexOf(postType);
        
        if(prefixIndex == -1)
        {
            throw ERROR_INVALID_PARAM('Post Type');
        }        
    },
    assertValidReactionType(reactionType) {
        let prefixIndex = reactionTypes.indexOf(reactionType);
        
        if(prefixIndex == -1)
        {
            throw ERROR_INVALID_PARAM('Reaction Type');
        }        
    },
    reactionCounterKeyFromType(reactionType) {
        this.assertValidReactionType(reactionType);

        return reactionType + 'ReactionCount';
    },
    async reactToPost (reactionType, postId, userId) {
        assertRequiredParams({reactionType, postId, userId});
        this.assertValidReactionType(reactionType);
        
        //should not react the same type twice, but can react other types
        let existingReactionPost = await Reaction.findOne({post: postId, user: userId, reactionType});

        if(existingReactionPost)
        {
            throw ERROR_REACTION_EXISTS;
        }

        let newReaction = new Reaction({
            user: userId, 
            post: postId,
            reactionType
        });

        let newReactionDoc = await newReaction.save();
    

        let counterKey = this.reactionCounterKeyFromType(reactionType);

        let updatedPostDoc = await Post.findOneAndUpdate({_id: postId}, {
            $inc: {
                [counterKey]: 1,
                reactionCount: 1
            },
            $push: {reactions: newReactionDoc._id}}, {new: true});
        
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
        this.assertValidReactionType(reactionType);

        let existingReaction = await Reaction.findOne({post: postId, user: userId, reactionType});
        if(!existingReaction)
        {
            throw ERROR_REACTION_NOT_FOUND;
        }

        await existingReaction.deleteOne();

        let counterKey = this.reactionCounterKeyFromType(reactionType);

        let updatedPostDoc = await Post.findOneAndUpdate({_id: postId}, {
            $inc: {
                [counterKey]: -1,
                reactionCount: -1
            },
            $pull: {reactions: existingReaction._id}}, {new: true});
        
        if(!updatedPostDoc)
        {
            throw ERROR_POST_NOT_FOUND;
        }
        
        return;
    },
    
    async commentOnPost (comment, postId, userId) {
        assertRequiredParams({comment, postId, userId});
        assertParamTypeObjectId(postId);
        assertParamTypeObjectId(userId);


        let commentData = {
            user: userId, 
            content: comment,
            post: postId
        };

        let newComment = new Comment(commentData);
        let newCommentDoc = await newComment.save();
        
        let updatedPostDoc = await Post.findOneAndUpdate({_id: postId}, {
            $inc: {
                commentCount: 1
            },
            $push: {
                comments: newCommentDoc._id
            }
        }, {new: true}).select('-reactions -comments');
        
        if(!updatedPostDoc)
        {
            throw ERROR_POST_NOT_FOUND;
        }

        return updatedPostDoc.toJSON();
    },
    async getUserPosts (viewerUserId, userId, targetIds, dateBefore, pageSize) {        
        
        let PAGE_SIZE = parseInt(pageSize) || 10;
        let DATE_BEFORE = dateBefore || Date.now();
        
        assertRequiredParams({userId});
        
        let query = Post.find({datePosted: {$lt : DATE_BEFORE}, user: userId, $or: [
            {target: { $in: targetIds }}, {target: null}
        ]})
        .sort('-datePosted')        
        .limit(PAGE_SIZE);

        let posts = this.execPopulatedPostFindQuery(viewerUserId, query);
        
        if(!posts)
        {
            return [];
        }
        return posts;
    },
    async getFeed(viewerUserId, userIds, targetIds, dateBefore, pageSize) {
        //get posts that are posted by the users
        let PAGE_SIZE = parseInt(pageSize) || 10;
        let DATE_BEFORE = dateBefore || Date.now();
        
        // let posts = await Post.find({datePosted: {$lt : DATE_BEFORE}})
        // let posts = await this.getPaginatedPostsAsViewer
        let query = Post.find({datePosted: {$lt : DATE_BEFORE}, $or: [{target: { $in: targetIds }}, {user: { $in: userIds }, target: null}] })
        .sort('-datePosted')        
        .limit(PAGE_SIZE);

        let posts = await this.execPopulatedPostFindQuery(viewerUserId, query);
        
        if(!posts) {
            return [];
        }

        //TODO: needs to filter out posts useer does not have access to
        return posts;
    }, 
    async execPopulatedPostFindQuery(viewerUserId, query) {
        let result = await (query
        .populate({path: 'user', select: 'username public'})
        .populate({path: 'target', select: 'name handle public'})
        .populate({
            path: 'comments', 
            perDocumentLimit: 2, 
            options: { sort: { datePosted : -1 }},
            populate : {
                path : 'user',
                select: 'username'
            }
        })        
        .populate({
            path: 'reactions', 
            match: {user: viewerUserId},
        }))
        
        if(!result) {
            return null;
        }

        if (result instanceof Array) {
            return result.map((post) => {
                let json = post.toJSON();
                json.myReactions = json.reactions.map((reaction) => reaction.reactionType);
                json.reactions = undefined;
                return json
            });
        }
        else {
            let json = result.toJSON();
            json.myReactions = json.reactions.map((reaction) => reaction.reactionType);
            json.reactions = undefined;
            return json
        }
    }
}



module.exports = postController;