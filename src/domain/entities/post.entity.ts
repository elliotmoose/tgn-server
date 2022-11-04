import { Errors } from './../../constants/Errors';
import { Ids } from './../../helpers/Ids';
interface Dependencies {
    Ids: Ids,
    Errors: Errors
}

export default function buildMakePost({ Ids, Errors } : Dependencies) {
    return function makePost({
        id = Ids.makeId(),
        user,
        content,
        postType,
        target = null,
        commentCount = 0,
        reactionCount = 0,
        loveReactionCount = 0,
        likeReactionCount = 0,
        prayReactionCount = 0,
        praiseReactionCount = 0,
        comments = [],
        reactions = [],
        datePosted = Date.now(), 
    }) {
        // assertRequiredParams({content, postType, userId});
        // this.assertValidPostType(postType);

        // if(target)
        // {
        //     assertParamTypeObjectId(target);
        // }

        return Object.freeze({
            id, 
            user,
            postType,
            content,
            commentCount,
            reactionCount,
            loveReactionCount,
            likeReactionCount,
            prayReactionCount,
            praiseReactionCount,
            comments,
            reactions,
            target,
            datePosted, 
        });
    }
}