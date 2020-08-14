const mongoose = require('mongoose');

/**
 * @class Post
 */
let postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: 'This field is required',
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
    comments: {
        type: [{
            userId: mongoose.Types.ObjectId,
            content: String,
            date: {
                type: Date, 
                default: Date.now()
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
            userId: mongoose.Types.ObjectId,
            reactionType: String,
            date: {
                type: Date, 
                default: Date.now()
            },
        }],
        default: []
    },
    organisationId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    datePosted: { 
        type: Date, 
        default: Date.now()
    }, 
});

mongoose.model('post', postSchema);