import mongoose from 'mongoose';


/**
 * @class User
 */
let organisationSchema = new mongoose.Schema({
    handle: {
        type: String,
        unique: true,
        required: 'This field is required'
    },
    // ownerId: {
    //     type: mongoose.Types.ObjectId,
    //     required: 'This field is required'
    // },
    name: {
        type: String,
        required: 'This field is required'
    },
    public: {
        type: Boolean,
        required: true,
        default: true
    },
    address: {
        type: String,
        // required: 'This field is required'
    },
    contact: {
        type: String,
        required: 'This field is required'
    },
    description : {
        type: String
    },
    website : {
        type: String
    },
    createdAt: { 
        type: Date, 
        default: ()=>Date.now()
    }, 
});

mongoose.model('organisation', organisationSchema);