const { ERROR_NOT_AUTHORISED, ERROR_NOT_FOLLOWING_USER } = require("../constants/errors");
const { respond } = require("../helpers/apiHelper");
const userController = require("../controllers/userController");

let resources = ['user', 'organisation', 'post', 'comment']
let actions = ['read', 'edit', 'create']
let roles = ['default', 'member', 'admin', 'owner'];

exports.can = (action, resource)=>{
    return async function (req, res, next) {
        try {
            switch (resource) {
                case 'user':
                    if(action == 'edit') {
                        let isOwner = userController.compareEqualUserIds(req.paramUser._id, req.user._id);
                        if(!isOwner) {
                            throw ERROR_NOT_AUTHORISED;
                        }
                    }

                    if(action =='read') {
                        //if paramUser is private, and user is a follower
                        let isOwner = userController.compareEqualUserIds(req.paramUser._id, req.user._id);
                        if(isOwner) {
                            break; //can read own profile
                        }

                        if(!req.paramUser.public) {
                            let isFollowing = await userController.isFollowing(req.user._id, req.paramUser.id);
                            if(!isFollowing) {
                                throw ERROR_NOT_FOLLOWING_USER;
                            }
                        }
                    }
                    break;
            
                default:
                    break;
            }            
        } catch (error) {
            respond(res, {}, error);
            return;
        }

        next();
    }
}