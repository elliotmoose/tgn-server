

const express = require('express');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { setAndRequireUser } = require('../middleware/user');
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
        let userFollows = req.user.following.map((user)=>user._id);
        let userIds = [...userFollows, req.user._id]; //get own posts also
        let organisationIds = req.user.organisationIds;
        let posts = await postController.getFeed(userId, userIds, organisationIds, dateBefore, pageSize);
        respond(res, posts);
    } catch (error) {
        respond(res, {}, error);
    }
});
module.exports = router;