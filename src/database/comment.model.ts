import mongoose from 'mongoose';

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
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'post',
        required: 'This field is required'        
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