const mongoose = require('mongoose');
// mongoose.pluralize(null);

mongoose.connect('mongodb://localhost:27017/TGN', {useNewUrlParser: true}, (err)=> {
    if (err) {
        console.log(`MongoDB Connection error: ${err}`);
    } 
    else {
        console.log('Successfully connected to MongoDB');
    }
});

require('./user.model');