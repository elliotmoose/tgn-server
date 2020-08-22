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

        for(let reaction of reactionTypes)
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
            content: comment
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
    async getPostsByUserId (userId) {        
        assertRequiredParams({userId});
        let posts = await Post.find({user: userId}).select('-comments -reactions');
        
        if(!posts)
        {
            return [];
        }
        return posts;
    },
    async getFeed(viewerUserId, userIds, dateBefore, pageSize) {
        //get posts that are posted by the users
        let PAGE_SIZE = parseInt(pageSize) || 10;
        let DATE_BEFORE = dateBefore || Date.now();

        //5.9.27
        // , {comments: {$slice: -2}}
        let posts = await Post.find({datePosted: {$lt : DATE_BEFORE}})
        .sort('-datePosted')        
        .limit(PAGE_SIZE)
        .populate({path: 'user', select: 'username'})
        .populate({path: 'target', select: 'name handle'})
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
        })

        // let commentPopulatedPosts = await Post.populate(posts, {path: 'comments.user', select: 'username'});
    
        
        // .select('-reactions -comments')
        
        //my reactions
        // let results = await Post.aggregate([
        //     {$match: {
        //         user: {$in: userIds},
        //         datePosted: {$lt : DATE_BEFORE}
        //     }},
        //     { 
        //         $project: {
        //             datePosted: true,
        //             reactionCount: {
        //                 $size: '$reactions'
        //             },
        //             comments: {
        //                 $slice: ["$comments", -2, 2]
        //             },
        //             myReactions: {
        //                 $filter: {
        //                 input: '$reactions',
        //                 as: 'reaction',
        //                 cond: {$eq: ['$$reaction.user', viewerUserId]}
        //             }
        //         }
        //     }},
        //     {$sort: {datePosted: -1}},
        //     {$limit: PAGE_SIZE}
        //     // {$unwind: '$reactions'}
        //     // {$match: {'reactions.user': viewerUserId}}
        //     // {$group: {_id: '$_id'}}
        // ]);

        // let populatedComments = await Post.populate(results, {
        //     path: 'comments.user',
        //     select: 'username'
        // });
        
        // let populatedPostUser = await Post.populate(results, {
        //     path: 'user',
        //     select: 'username'
        // });

        // let populatedReactions = await Post.populate(results, {
        //     path: 'reactions.user', 
        //     select: 'username'
        // });

        //top comments


        //TODO: needs to filter out posts useer does not have access to
        // return posts;
        return posts.map((post)=> {
            let json = post.toJSON();
            json.myReactions = json.reactions.map((reaction)=>reaction.reactionType);
            json.reactions = undefined;
            return json
        });
        // return populatedComments;
    }
}



module.exports = postController;