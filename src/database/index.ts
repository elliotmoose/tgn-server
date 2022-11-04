import mongoose from 'mongoose';

import config from '../config';
// mongoose.pluralize(null);

mongoose.set('useFindAndModify', false);

mongoose.connect(config.DB, {useNewUrlParser: true}, (err)=> {
    if (err) {
        console.log(`MongoDB Connection error: ${err}`);
    } 
    else {
        console.log('Successfully connected to MongoDB');
    }
});

require('./user.model');
require('./organisation.model');
require('./reaction.model');
require('./comment.model');
require('./post.model');