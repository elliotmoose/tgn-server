const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { ERROR_USER_NOT_FOUND, ERROR_ORG_NOT_FOUND, ERROR_INTERNAL_SERVER, ERROR_NOT_AUTHORISED, ERROR_ALREADY_JOINED_ORG, ERROR_NOT_ORG_MEMBER, ERROR_REACTION_NOT_FOUND, ERROR_REACTION_EXISTS } = require('../constants/errors');
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

router.get('/:postId', setAndRequireUser, async (req, res)=>{    
    let postId =  req.params.postId;

    try {          
        let post = await postController.getPost(postId);
        respond(res, post);
    } catch (error) {
        if(error == ERROR_REACTION_EXISTS) {
            respond(res, error);            
            return;
        }
        respond(res, {}, error);
    }
});

router.post('/:postId/react', setAndRequireUser, async (req, res)=>{    
    let userId =  req.user._id;
    let postId =  req.params.postId;
    let reactionType = req.body.reactionType;

    try {          
        await postController.reactToPost(reactionType, postId, userId);
        respond(res, {success: true});
    } catch (error) {
        if(error == ERROR_REACTION_EXISTS) {
            respond(res, error);            
            return;
        }
        respond(res, {}, error);
    }
});

router.post('/:postId/unreact', setAndRequireUser, async (req, res)=>{    
    let userId =  req.user._id;
    let postId =  req.params.postId;
    let reactionType = req.body.reactionType;

    try {          
        await postController.unreactToPost(reactionType, postId, userId);        
        respond(res, {success: true});
    } catch (error) {
        if(error == ERROR_REACTION_NOT_FOUND) {
            respond(res, error);            
            return;
        }
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

/**
 * loads feed for user provided by token
 */
router.post('/feed/', setAndRequireUser, async (req, res)=>{        
    let userId =  req.user._id;

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

        // let uesrFollows = await userController.getFollowingUserIds(userId);

        // let updatedPost = await postController.commentOnPost(commentData, postId, userId);
        // respond(res, updatedPost);
    } catch (error) {
        respond(res, {}, error);
    }
});

module.exports = router;