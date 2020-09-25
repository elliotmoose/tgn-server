import { Ids, Errors } from './entity.depend.interfaces';
const reactionTypes = ['love', 'like', 'pray', 'praise'];

interface Dependencies {
    Ids: Ids,
    Errors: Errors
}

export default function buildMakeReaction({ Ids, Errors } : Dependencies) {
    return function makeReaction({
        postId,
        userId,
        reactionType,
        datePosted = Date.now()
    }) {
        if(!Ids.isValidId(postId)) {
            throw Errors.INVALID_PARAM('Post');
        }
        
        if(!Ids.isValidId(userId)) {
            throw Errors.INVALID_PARAM('User');
        }

        if(reactionTypes.indexOf(reactionType) == -1) {
            throw Errors.INVALID_PARAM('Reaction Type');
        }

        return Object.freeze({
            postId,
            userId,
            reactionType,
            datePosted
        });
    }
}