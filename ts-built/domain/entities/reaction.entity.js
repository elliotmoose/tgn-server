"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reactionTypes = ['love', 'like', 'pray', 'praise'];
function buildMakeReaction(_a) {
    var Ids = _a.Ids, Errors = _a.Errors;
    return function makeReaction(_a) {
        var postId = _a.postId, userId = _a.userId, reactionType = _a.reactionType, _b = _a.datePosted, datePosted = _b === void 0 ? Date.now() : _b;
        if (!Ids.isValidId(postId)) {
            throw Errors.INVALID_PARAM('Post');
        }
        if (!Ids.isValidId(userId)) {
            throw Errors.INVALID_PARAM('User');
        }
        if (reactionTypes.indexOf(reactionType) == -1) {
            throw Errors.INVALID_PARAM('Reaction Type');
        }
        return Object.freeze({
            postId: postId,
            userId: userId,
            reactionType: reactionType,
            datePosted: datePosted
        });
    };
}
exports.default = buildMakeReaction;
//# sourceMappingURL=reaction.entity.js.map