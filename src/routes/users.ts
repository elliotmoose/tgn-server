import express from 'express';
const router = express.Router();

import { signup, login, getUser } from '../controllers/user';

// const userController = require('../controllers/userController');
// const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
// import * as Errors from "../constants/Errors";
import { makeExpressCallback } from '../helpers/expressCallback';
// const { setAndRequireUser, resolveParamUser } = require('../middleware/user');
// const organisationController = require('../controllers/organisationController');
// const postController = require('../controllers/postController');
// const rbac = require('../middleware/rbac');

// router.post('/', makeExpressCallback(signup));
router.post('/', makeExpressCallback(signup));
router.post('/login', makeExpressCallback(login));
// router.get('/:userIdOrHandle', setAndRequireUser, resolveParamUser, rbac.can('read', 'user'), makeExpressCallback(getUser));

// /**
//  * Get user data by id or by handl
//  */
// router.get('/:userIdOrHandle/memberOf', setAndRequireUser, resolveParamUser, rbac.can('read', 'user'), async (req, res)=>{
//     try {        
//         let organisations = await userController.memberOf(req.paramUser._id);
//         respond(res, organisations);
//     } catch (error) {
//         respond(res, {}, error);
//     }
// });

// /**
//  * Update user data (incomplete: only updates public status of user account)
//  */
// router.put('/:userIdOrHandle', setAndRequireUser, resolveParamUser, rbac.can('edit', 'user'), async (req, res)=>{
//     let userData = req.body;
//     //incomplete
//     let { public: isPublic } = userData;
    
//     try {                
//         let newUserData = await userController.update(req.paramUser._id, { public: isPublic });
//         respond(res, newUserData);
//     } catch (error) {
//         respond(res, {}, error);
//     }
// });


// /**
//  * Get user data by id or by handl
//  */
// router.get('/:userIdOrHandle/posts', setAndRequireUser, resolveParamUser, rbac.can('read', 'user'), async (req, res)=>{
//     let dateBefore = req.query.before; //gets comments that were before this date
//     let pageSize = req.query.limit;

//     try {                        

//         let viewerOrgIds = req.user.organisationIds; 

//         //if owner
//         if(req.user._id.equals(req.paramUser._id)) {
//             let posts = await postController.getUserPosts(req.user._id, req.paramUser._id, viewerOrgIds, dateBefore, pageSize);
//             respond(res, posts);
//             return;
//         }

//         let publicOrgIds = await organisationController.filterPublicOrgs(req.paramUser.organisationIds);
//         let orgIds = [...new Set([...viewerOrgIds ,...publicOrgIds])];
//         let posts = await postController.getUserPosts(req.user._id, req.paramUser._id, orgIds, dateBefore, pageSize);

//         respond(res, posts);
//     } catch (error) {
//         respond(res, {}, error);
//     }
// });


// /**
//  * Get user data by id or by handl
//  */
// router.post('/:userIdOrHandle/follow', setAndRequireUser, async (req, res)=>{
//     let toFollowUserIdOrHandle = req.params.userIdOrHandle;    
//     let isFollowingUserId = req.user._id;    
    
//     try {                            
//         let toFollowUserData = await userController.getUserByIdOrHandle(toFollowUserIdOrHandle);
        
//         if(!toFollowUserData) {
//             throw Errors.USER_NOT_FOUND();             
//         }                    

//         await userController.follow(isFollowingUserId, toFollowUserData._id);                
//         respond(res, {});
//     } catch (error) {
//         if(error.code == 'ERROR_ALREADY_FOLLOWING_USER')
//         {
//             respond(res, error);
//             return;
//         }
//         respond(res, {}, error);
//     }
// });

// /**
//  * Get user data by id or by handl
//  */
// router.post('/:userIdOrHandle/unfollow', setAndRequireUser, async (req, res)=>{
//     let toFollowUserIdOrHandle = req.params.userIdOrHandle;    
//     let isFollowingUserId = req.user._id;    
    
//     try {                            
//         let toFollowUserData = await userController.getUserByIdOrHandle(toFollowUserIdOrHandle);
        
//         if(!toFollowUserData) {
//             throw Errors.USER_NOT_FOUND();             
//         }                    

//         await userController.unfollow(isFollowingUserId, toFollowUserData._id);                
//         respond(res, {});
//     } catch (error) {
//         let errorCode = (error instanceof APIError && error.code) || null;
//         switch (errorCode) {
//             case 'ERROR_CANNOT_UNFOLLOW_SELF':
//             case 'ERROR_NOT_FOLLOWING_USER':
//                 respond(res, error.toJSON());
//                 break;        
//             default:
//                 respond(res, {}, error);
//                 break;
//         }
//     }
// });

// router.get('/:userIdOrHandle/followers', setAndRequireUser, async (req, res)=>{
//     let toFollowUserIdOrHandle = req.params.userIdOrHandle;    
//     let followerUserId = req.user._id;    
    
//     try {                            
//         let userData = await userController.getUserByIdOrHandle(toFollowUserIdOrHandle, true);
        
//         if(!userData) {
//             throw Errors.USER_NOT_FOUND();             
//         }                    
        
//         respond(res, userData.followers);
//     } catch (error) {
//         respond(res, {}, error);
//     }
// });

// router.get('/:userIdOrHandle/following', setAndRequireUser, async (req, res)=>{
//     let toFollowUserIdOrHandle = req.params.userIdOrHandle;    
//     let followerUserId = req.user._id;    
    
//     try {                            
//         let userData = await userController.getUserByIdOrHandle(toFollowUserIdOrHandle, true);
        
//         if(!userData) {
//             throw Errors.USER_NOT_FOUND();             
//         }                    
        
//         respond(res, userData.following);
//     } catch (error) {
//         respond(res, {}, error);
//     }
// });

// /**
//  * Get user data by id or by handl
//  */
// router.get('/:userIdOrHandle/isFollowing', setAndRequireUser, async (req, res)=>{
//     let toFollowUserIdOrHandle = req.params.userIdOrHandle;    
//     let followerUserId = req.user._id;    
    
//     try {                            
//         let toFollowUserData = await userController.getUserByIdOrHandle(toFollowUserIdOrHandle);
        
//         if(!toFollowUserData) {
//             throw Errors.USER_NOT_FOUND();             
//         }                    

//         let isFollowing = await userController.isFollowing(followerUserId, toFollowUserData._id);                
//         respond(res, isFollowing);
//     } catch (error) {
//         respond(res, {}, error);
//     }
// });

export default router;