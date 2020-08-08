const mongoose = require('mongoose');

/**
 * @class User
 */
let userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: 'This field is required'
    },
    username : {
        type: String,
        unique: true,
        required: 'This field is required'
    },
    email : {
        type: String,
        unique: true,
        required: 'This field is required'
    },
    password : {
        type: String,
        required: 'This field is required'
    },
    passwordSalt : {
        type: String,
        required: 'This field is required'
    },
    role: {
        type: String,
        required: 'This field is required'
    },
    public: {
        type: Boolean,
        required: 'This field is required',
        default: false 
    },
    bio : {
        type: String
    },
    organisationIds: {
        type: [mongoose.Types.ObjectId],
        required: 'This field is required',
        default: []        
    },
    createdAt: { 
        type: Date, 
        default: Date.now()
    }, 
});

mongoose.model('user', userSchema);