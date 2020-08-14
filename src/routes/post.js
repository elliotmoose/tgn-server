const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { ERROR_USER_NOT_FOUND, ERROR_ORG_NOT_FOUND, ERROR_INTERNAL_SERVER, ERROR_NOT_AUTHORISED, ERROR_ALREADY_JOINED_ORG, ERROR_NOT_ORG_MEMBER } = require('../constants/errors');
const { setAndRequireUser } = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');
const postController = require('../controllers/postController');


router.post('/', setAndRequireUser, async (req, res)=>{    
    let userId =  req.user._id;
    let postData = req.body;

    try {          
        let newPost = await postController.makePost(postData, userId, []);
        respond(res, newPost);
    } catch (error) {
        respond(res, {}, error);
    }
});

router.post('/:postId/react', setAndRequireUser, async (req, res)=>{    
    let userId =  req.user._id;
    let postId =  req.params.postId;
    let reactionType = req.body.reactionType;

    try {          
        let updatedPost = await postController.reactToPost(reactionType, postId, userId);
        respond(res, updatedPost);
    } catch (error) {
        respond(res, {}, error);
    }
});

router.post('/:postId/comment', setAndRequireUser, async (req, res)=>{    
    let userId =  req.user._id;
    let postId =  req.params.postId;
    let commentData = req.body;

    try {          
        let updatedPost = await postController.commentOnPost(commentData, postId, userId);
        respond(res, updatedPost);
    } catch (error) {
        respond(res, {}, error);
    }
});

module.exports = router;