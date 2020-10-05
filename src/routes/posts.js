const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { ERROR_NOT_ORG_MEMBER, ERROR_REACTION_NOT_FOUND, ERROR_REACTION_EXISTS } = require('../constants/errors');
const { setAndRequireUser } = require('../middleware/user');
const router = express.Router();
const mongoose = require('mongoose');
const postController = require('../controllers/postController');
const { resolveParamPost } = require('../middleware/post');
const rbac = require('../middleware/rbac');
const { makeExpressCallback } = require('../helpers/expressCallback');

// router.post('/', setAndRequireUser, makeExpressCallback(createPost));

router.post('/', setAndRequireUser, async (req, res)=>{    
    let userId =  req.user._id;
    let {content, postType, target} = req.body;

    try {   
        //check if is member       
        if(target) {
            let isMember = req.user.organisationIds.findIndex((id) => id.equals(target)) != -1;

            if(!isMember) {
                throw ERROR_NOT_ORG_MEMBER();
            }
        }

        let newPost = await postController.makePost({content, postType, target}, userId);
        respond(res, newPost);
    } catch (error) {
        respond(res, {}, error);
    }
});

router.get('/:postId', setAndRequireUser, resolveParamPost, rbac.can('read', 'post'), async (req, res)=>{    
    let postId =  req.params.postId;

    try {          
        let post = await postController.getPost(postId);
        respond(res, post);
    } catch (error) {
        if(error.code == 'ERROR_REACTION_EXISTS') {
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
        if(error.code == 'ERROR_REACTION_EXISTS') {
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
        if(error.code == 'ERROR_REACTION_NOT_FOUND') {
            respond(res, error);            
            return;
        }
        respond(res, {}, error);
    }
});

router.post('/:postId/comment', setAndRequireUser, async (req, res)=>{    
    let userId =  req.user._id;
    let postId =  req.params.postId;
    let {content} = req.body;

    try {          
        let updatedPost = await postController.commentOnPost(content, postId, userId);
        respond(res, updatedPost);
    } catch (error) {
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