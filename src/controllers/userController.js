const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = mongoose.model('user');
router.get('/', (req,res)=>{

});

router.post('/create', async (req,res)=>{
    try {
        let newUser = await createUser();
        if(newUser)
        {
            console.log(newUser);
        }        
        res.send('created new user');
    } catch (error) {
        console.log(`created user failed with error: ${error}`);        
    }

});

async function createUser() 
{
    let newUser = new User({
        username: 'mooselliot',
        firstName: 'Elliot',
        lastName: 'Koh',
        email: 'kyzelliot@gmail.com',
        password: '12345'
    });
    
    return await newUser.save();
}

module.exports = router;