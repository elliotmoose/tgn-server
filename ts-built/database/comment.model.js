"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
/**
 * @class Comment
 */
var commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: 'This field is required'
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'user'
    },
    post: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'post',
        required: 'This field is required'
    },
    reactions: {
        type: [{
                type: mongoose_1.default.Types.ObjectId,
                ref: 'reaction'
            }],
        default: []
    },
    datePosted: {
        type: Date,
        default: function () { return Date.now(); }
    },
});
mongoose_1.default.model('comment', commentSchema);
