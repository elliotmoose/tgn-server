"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController = require('../controllers/userController');
var _a = require('../helpers/apiHelper'), respond = _a.respond, checkRequiredFields = _a.checkRequiredFields, assertRequiredParams = _a.assertRequiredParams;
var expressCallback_1 = require("../helpers/expressCallback");
var _b = require('../middleware/user'), setAndRequireUser = _b.setAndRequireUser, resolveParamUser = _b.resolveParamUser;
var organisationController = require('../controllers/organisationController');
var router = express_1.default.Router();
var postController = require('../controllers/postController');
var rbac = require('../middleware/rbac');
var user_1 = require("../controllers/user");
router.get('/', function (req, res) {
});
// router.post('/', makeExpressCallback(signup));
router.post('/', expressCallback_1.makeExpressCallback(user_1.signup));
router.post('/login', expressCallback_1.makeExpressCallback(user_1.login));
router.get('/:userIdOrHandle', setAndRequireUser, resolveParamUser, rbac.can('read', 'user'), expressCallback_1.makeExpressCallback(user_1.getUser));
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
// module.exports = router;
