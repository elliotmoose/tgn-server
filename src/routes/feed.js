

const express = require('express');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { setAndRequireUser } = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

/**
 * loads feed for user provided by token
 */
router.get('/', setAndRequireUser, async (req, res)=>{        
    let userId =  req.user._id;
    let dateBefore = req.query.before; //gets posts that were before this date
    let pageSize = req.query.limit;

    try {          
        //feed should load all posts that this user has access to
        //1. organisation
        //2. follows
        //3. organisation members

        //naive approach:
        //get all follows
        //get all organisations
        //get all organisation members
        //aggregate into single list of all users
        //get posts that are by this users

        let userFollows = await userController.getFollowingUserIds(userId);
        let posts = await postController.getFeed(userFollows, dateBefore, pageSize);
        respond(res, posts);
    } catch (error) {
        respond(res, {}, error);
    }
});
module.exports = router;