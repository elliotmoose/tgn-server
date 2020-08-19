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
    public: {
        type: Boolean,
        required: 'This field is required',
        default: false 
    },
    commentCount: {
        type: Number,
        default: 0
    },
    comments: {
        type: [{
            userId: mongoose.Types.ObjectId,
            content: String,
            date: {
                type: Date, 
                default: ()=>Date.now()
            },
        }],
        default: []
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
    reactions: {
        type: [{
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'user'
            },
            reactionType: String,
            date: {
                type: Date, 
                default: ()=>Date.now()
            },
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