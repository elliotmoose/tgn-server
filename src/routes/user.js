const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { ERROR_USER_NOT_FOUND, ERROR_ORG_NOT_FOUND, ERROR_INTERNAL_SERVER, ERROR_NOT_AUTHORISED, ERROR_CANNOT_FOLLOW_SELF } = require('../constants/errors');
const { setAndRequireUser } = require('../middleware/auth');
const organisationController = require('../controllers/organisationController');
const router = express.Router();
const mongoose = require('mongoose');
const postController = require('../controllers/postController');

router.get('/', (req,res)=>{

});

router.post('/create', async (req, res)=>{
    try {        
        let newUser = await userController.createUser(req.body);      
        respond(res, {...newUser, password: undefined});  
    } catch (error) {
        respond(res, {}, error);
    }
});

router.post('/login', async (req, res)=>{
    try {
        let loginData = await userController.login(req.body);        
        let resData = {
            user: {...loginData.user, password: undefined},
            token: loginData.token
        };
        respond(res, resData);  
    } catch (error) {
        respond(res, {}, error);
    }
});

/**
 * Get user data by id or by handl
 */
router.get('/:userIdOrHandle', setAndRequireUser, async (req, res)=>{
    let userIdOrHandle = req.params.userIdOrHandle;    
    
    try {        
        let userData = await userController.getUserByIdOrHandle(userIdOrHandle);
        if(!userData) {
            throw ERROR_USER_NOT_FOUND;             
        }            

        respond(res, userData);
    } catch (error) {
        respond(res, {}, error);
    }
});


/**
 * Get user data by id or by handl
 */
router.get('/:userIdOrHandle/posts', setAndRequireUser, async (req, res)=>{
    let userIdOrHandle = req.params.userIdOrHandle;    
    
    try {        
        
        let userData = await userController.getUserByIdOrHandle(userIdOrHandle);
        
        if(!userData) {
            throw ERROR_USER_NOT_FOUND;             
        }            
        
        let posts = await postController.getPostsByUserId(userData._id);

        respond(res, posts);
    } catch (error) {
        respond(res, {}, error);
    }
});


/**
 * Get user data by id or by handl
 */
router.post('/:userIdOrHandle/follow', setAndRequireUser, async (req, res)=>{
    let toFollowUserIdOrHandle = req.params.userIdOrHandle;    
    let isFollowingUserId = req.user._id;    
    
    try {                            
        let toFollowUserData = await userController.getUserByIdOrHandle(toFollowUserIdOrHandle);
        
        if(!toFollowUserData) {
            throw ERROR_USER_NOT_FOUND;             
        }                    

        let success = await userController.follow(isFollowingUserId, toFollowUserData._id);                
        respond(res, {success});
    } catch (error) {
        respond(res, {}, error);
    }
});

module.exports = router;