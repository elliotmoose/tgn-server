

const mongoose = require('mongoose');

/**
 * @class Comment
 */
let commentSchema = new mongoose.Schema({
    content : {
        type: String,
        required: 'This field is required'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    reactions: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: 'reaction'
        }],
        default: []
    },    
    datePosted: { 
        type: Date, 
        default: ()=>Date.now()
    }, 
});

mongoose.model('comment', commentSchema);