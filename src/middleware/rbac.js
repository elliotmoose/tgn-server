const { ERROR_NOT_AUTHORISED, ERROR_NOT_FOLLOWING_USER } = require("../constants/errors");
const { respond, assertParamResolved } = require("../helpers/apiHelper");
const userController = require("../controllers/userController");
const organisationController = require("../controllers/organisationController");
const mongoose = require("mongoose");

let resources = ['user', 'organisation', 'post', 'comment']
let actions = ['read', 'edit', 'create']
let roles = ['default', 'member', 'admin', 'owner'];

const can = (action, resource)=>{
    return async function (req, res, next) {
        try {

            let rules = {
                user: {
                    edit: async () => {
                        assertParamResolved({user: req.paramUser});
                        let isOwner = userController.compareEqualUserIds(req.paramUser._id, req.user._id);
                        if(!isOwner) {
                            throw ERROR_NOT_AUTHORISED;
                        }
                    },
                    read: async () => {
                        assertParamResolved({paramUser: req.paramUser, user: req.user});
                        //if paramUser is private, and user is a follower
                        
                        let isOwner = userController.compareEqualUserIds(req.paramUser._id, req.user._id);
                        if(isOwner) {
                            return; //can read own profile
                        }

                        // console.log(req.paramUser)
                        if(!req.paramUser.public) {
                            let isFollowing = await userController.isFollowing(req.user._id, req.paramUser._id);
                            
                            if(!isFollowing) {                                
                                throw ERROR_NOT_AUTHORISED;
                            }
                        }
                    }
                },
                post : {
                    edit: async () => {      
                        assertParamResolved({paramPost: req.paramPost});                  
                        let isOwner = userController.compareEqualUserIds(req.paramPost.user._id, req.user._id);
                        if(!isOwner) {
                            throw ERROR_NOT_AUTHORISED;
                        }
                    },
                    read: async () => { 
                        assertParamResolved({paramPost: req.paramPost, user: req.user});                  
                        let post = req.paramPost;
                        let viewingUser = req.user;
                        let postUser = post.user;
                        let target = post.target;

                        let isOwner = userController.compareEqualUserIds(postUser._id, viewingUser._id);
                        if(isOwner) {
                            //owner can see own posts
                            return;
                        }
                        if(target) {
                            if(target.public) {
                                //allow access: posted on public org
                                return;
                            }
                            else {
                                let isMember = viewingUser.organisationIds.findIndex((id)=>id.equals(target._id)) != -1;
                                
                                if (!isMember) {
                                    throw ERROR_NOT_AUTHORISED;
                                }
                                
                                //allow access: is member of org
                                return;
                            }
                        }
                        else {
                            if(postUser.public) {
                                //allow access: user is public
                                return;
                            }
                            else {
                                let isFollowing = viewingUser.following.findIndex((user)=>user._id.equals(postUser._id)) != -1;
                                
                                if (isFollowing) {
                                    //allow access: is a follower
                                    return;
                                }
                                else {
                                    throw ERROR_NOT_AUTHORISED;
                                }
                            }
                        }
                    }
                }
            }

            let resourcePermissions = rules[resource];
            if(!resourcePermissions) {
                next();
            }

            let actionPermissions = resourcePermissions[action];

            if(!actionPermissions) {
                next();
            }

            await actionPermissions(); //run permission checks
          
        } catch (error) {
            respond(res, {}, error);
            return;
        }

        next();
    }
}

const rbac = {can}
module.exports = rbac;