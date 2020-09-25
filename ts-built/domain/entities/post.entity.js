"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakePost(_a) {
    var Ids = _a.Ids, Errors = _a.Errors;
    return function makePost(_a) {
        // assertRequiredParams({content, postType, userId});
        // this.assertValidPostType(postType);
        var _b = _a.id, id = _b === void 0 ? Ids.makeId() : _b, user = _a.user, content = _a.content, postType = _a.postType, _c = _a.target, target = _c === void 0 ? null : _c, _d = _a.commentCount, commentCount = _d === void 0 ? 0 : _d, _e = _a.reactionCount, reactionCount = _e === void 0 ? 0 : _e, _f = _a.loveReactionCount, loveReactionCount = _f === void 0 ? 0 : _f, _g = _a.likeReactionCount, likeReactionCount = _g === void 0 ? 0 : _g, _h = _a.prayReactionCount, prayReactionCount = _h === void 0 ? 0 : _h, _j = _a.praiseReactionCount, praiseReactionCount = _j === void 0 ? 0 : _j, _k = _a.comments, comments = _k === void 0 ? [] : _k, _l = _a.reactions, reactions = _l === void 0 ? [] : _l, _m = _a.datePosted, datePosted = _m === void 0 ? Date.now() : _m;
        // if(target)
        // {
        //     assertParamTypeObjectId(target);
        // }
        return Object.freeze({
            id: id,
            user: user,
            postType: postType,
            content: content,
            commentCount: commentCount,
            reactionCount: reactionCount,
            loveReactionCount: loveReactionCount,
            likeReactionCount: likeReactionCount,
            prayReactionCount: prayReactionCount,
            praiseReactionCount: praiseReactionCount,
            comments: comments,
            reactions: reactions,
            target: target,
            datePosted: datePosted,
        });
    };
}
exports.default = buildMakePost;
//# sourceMappingURL=post.entity.js.map