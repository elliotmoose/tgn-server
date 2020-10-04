import { ERROR_NOT_ORG_MEMBER, ERROR_POST_NOT_FOUND, ERROR_REACTION_EXISTS } from "../../constants/errors";

const { makePost, makeReaction } = require("../../entities");

export default function makeAddReaction({ reactionDb, postDb, errors }) {
    return async function addReaction(postId, userId, reactionType) {

        let exists = await reactionDb.get({post: postId, user: userId, reactionType});

        if(exists)
        {
            throw ERROR_REACTION_EXISTS();
        }

        let reaction = makeReaction({
            user: userId, 
            post: postId,
            reactionType
        })

        //create reaction
        let newReaction = await reactionDb.insert({
            user: reaction.user, 
            post: reaction.post,
            reactionType: reaction.reactionType
        })
    
        //update post
        let updatedPost = await postDb.addReaction(postId, reactionType, newReaction.id);
        
        if(!updatedPost)
        {
            throw ERROR_POST_NOT_FOUND();
        }

        return newReaction;
    }
}