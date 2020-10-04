import { ERROR_INVALID_PARAM } from "../constants/errors";
import { assertParamTypeObjectId } from "../helpers/apiHelper";

const reactionTypes = ['love', 'like', 'pray', 'praise'];

export default function buildMakeReaction ({ Ids }) {
    return function makeReaction({
        post,
        user,
        reactionType,
        datePosted = Date.now()
    }) {
        if(!Ids.isValidId(post)) {
            throw ERROR_INVALID_PARAM('Post');
        }
        
        if(!Ids.isValidId(user)) {
            throw ERROR_INVALID_PARAM('User');
        }

        if(reactionTypes.indexOf(reactionType) == -1) {
            throw ERROR_INVALID_PARAM('Reaction Type');
        }

        return Object.freeze({
            post,
            user,
            reactionType,
            datePosted
        });
    }
}