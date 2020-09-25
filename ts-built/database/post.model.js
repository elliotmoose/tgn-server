"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
/**
 * @class Post
 */
var postSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'user',
        required: 'This field is required',
    },
    postType: {
        type: String,
        required: 'This field is required'
    },
    content: {
        type: String,
        required: 'This field is required'
    },
    commentCount: {
        type: Number,
        default: 0
    },
    reactionCount: {
        type: Number,
        default: 0
    },
    loveReactionCount: {
        type: Number,
        default: 0
    },
    likeReactionCount: {
        type: Number,
        default: 0
    },
    prayReactionCount: {
        type: Number,
        default: 0
    },
    praiseReactionCount: {
        type: Number,
        default: 0
    },
    comments: {
        type: [{
                type: mongoose_1.default.Types.ObjectId,
                ref: 'comment'
            }],
        default: []
    },
    reactions: {
        type: [{
                type: mongoose_1.default.Types.ObjectId,
                ref: 'reaction'
            }],
        default: []
    },
    target: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'organisation',
        default: null
    },
    datePosted: {
        type: Date,
        default: function () { return Date.now(); }
    },
});
mongoose_1.default.model('post', postSchema);
//# sourceMappingURL=post.model.js.map