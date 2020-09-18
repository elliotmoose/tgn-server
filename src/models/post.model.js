const mongoose = require('mongoose');

/**
 * @class Post
 */
let postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: 'This field is required',
    },
    postType : {
        type: String,
        required: 'This field is required'
    },
    content : {
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
            type: mongoose.Types.ObjectId,
            ref: 'comment'
        }],
        default: []
    },
    reactions: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: 'reaction'
        }],
        default: []
    },
    target: {
        type: mongoose.Types.ObjectId,
        ref: 'organisation',
        default: null
    },
    datePosted: { 
        type: Date, 
        default: ()=>Date.now()
    }, 
});

mongoose.model('post', postSchema);