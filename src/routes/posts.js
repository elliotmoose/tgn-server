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
    let {content, postType, target} = req.body;

    try {          
        let newPost = await postController.makePost({content, postType, target}, userId);
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

router.get('/:postId/comments', setAndRequireUser, async (req, res)=>{    
    let postId =  req.params.postId;
    let dateAfter = req.query.after; //gets comments that were before this date
    let pageSize = req.query.limit;

    try {          
        let comments = await postController.getComments(postId, dateAfter, pageSize);
        respond(res, comments);
    } catch (error) {
        respond(res, {}, error);
    }
});

module.exports = router;