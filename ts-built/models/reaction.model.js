"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
/**
 * @class Reaction
 */
var reactionSchema = new mongoose_1.default.Schema({
    reactionType: {
        type: String,
        required: 'This field is required'
    },
    post: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'post'
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'user'
    },
    datePosted: {
        type: Date,
        default: function () { return Date.now(); }
    },
});
mongoose_1.default.model('reaction', reactionSchema);
