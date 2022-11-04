import { IsFollowingUser } from './../../use-cases/user/is-following-user.uc';
import { Errors } from './../../constants/Errors';
import { Ids } from '../../helpers/ids';

interface Dependencies {
    Ids: Ids,
    Errors: Errors,
    isFollowingUser: IsFollowingUser
}

export default function makeAccess({ isFollowingUser, Ids, Errors } : Dependencies) {
    const can = (action, resource) => {
        return async function (req, res, next) {
            let rules = {
                user: {
                    edit: async () => {
                        if(!req.paramUser || !req.user) {
                            throw Errors.INTERNAL_SERVER(); //should be resolved by middleware
                        }

                        let isOwner = Ids.equal(req.paramUser.id, req.user.id);

                        if(!isOwner) {
                            throw Errors.NOT_AUTHORISED();
                        }
                    },
                    read: async () => {
                        if(!req.paramUser || !req.user) {
                            throw Errors.INTERNAL_SERVER(); //should be resolved by middleware
                        }
                        
                        let isOwner = Ids.equal(req.paramUser.id, req.user.id);
                        if(isOwner) {
                            return; //can read own profile
                        }
                        
                        //if paramUser is private, and user is a follower
                        if(!req.paramUser.public) {
                            let isFollowing = await isFollowingUser(req.user.id, req.paramUser.id);
                            
                            if(!isFollowing) {                                
                                throw Errors.NOT_AUTHORISED();
                            }
                        }
                    }
                },
                post : {
                    edit: async () => {      
                        
                        if(!req.paramPost) {
                            throw Errors.INTERNAL_SERVER();
                        }

                        let isOwner = Ids.equal(req.paramPost.user.id, req.user.id);
                        if(!isOwner) {
                            throw Errors.NOT_AUTHORISED();
                        }
                    },
                    read: async () => { 
                        
                        if(!req.paramUser || !req.user) {
                            throw Errors.INTERNAL_SERVER(); //should be resolved by middleware
                        }

                        let post = req.paramPost;
                        let viewingUser = req.user;
                        let postUser = post.user;
                        let target = post.target;

                        let isOwner = Ids.equal(postUser.id, viewingUser.id);
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
                                let isMember = viewingUser.organisationIds.findIndex((id)=>id.equals(target.id)) != -1;
                                
                                if (!isMember) {
                                    throw Errors.NOT_AUTHORISED();
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
                                let isFollowing = viewingUser.following.findIndex((user)=>user.id.equals(postUser.id)) != -1;
                                
                                if (isFollowing) {
                                    //allow access: is a follower
                                    return;
                                }
                                else {
                                    throw Errors.NOT_AUTHORISED();
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
        }        
    }

    return {can};
}
