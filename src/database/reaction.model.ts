import mongoose from 'mongoose';


/**
 * @class Reaction
 */
let reactionSchema = new mongoose.Schema({
    reactionType : {
        type: String,
        required: 'This field is required'
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'post'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    datePosted: { 
        type: Date, 
        default: ()=>Date.now()
    }, 
});

mongoose.model('reaction', reactionSchema);