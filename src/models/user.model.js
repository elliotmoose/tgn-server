const mongoose = require('mongoose');

/**
 * @class User
 */
let userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: 'This field is required'
    },
    lastName : {
        type: String,
        required: 'This field is required'
    },
    username : {
        type: String,
        required: 'This field is required'
    },
    email : {
        type: String,
        required: 'This field is required'
    },
    password : {
        type: String,
        required: 'This field is required'
    },
    createdAt: { 
        type: Date, 
        default: Date.now()
    }, 
});

mongoose.model('user', userSchema);