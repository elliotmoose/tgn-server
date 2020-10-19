//use case dependencies
import {
    createUser, 
    loginUser, 
    findUser,
    verifyUserToken 
    // updateUser, 
    // findUserOrganisations, 
    // findUserPosts, 
    // findUserFollowers, 
    // findUserFollowing
} from "../../use-cases/user";

import * as Errors from '../../constants/Errors';

//import controllers
import makeSignUp from "./signup.controller";
import makeLogin from "./login.controller";
import makeGetUser from "./get-user.controller";
// import makeFollowUser from "./follow-user.controller";
// import makeGetFollowers from "./get-followers.controller";
// import makeGetFollowing from "./get-following.controller";
// import makeGetIsFollowing from "./get-is-following.controller";

//import middleware controllers
import makeSetUserMiddleware from "./set-user.middleware";
import makeSetParamUserMiddleware from "./set-param-user.middleware";

//initialise user controller makers
export const signup = makeSignUp({ createUser });
export const login = makeLogin({ loginUser });
export const getUser = makeGetUser({ findUser, Errors });


//init middleware controllers
export const setUserMiddleware = makeSetUserMiddleware({ verifyUserToken, Errors });
export const setParamUserMiddleware = makeSetParamUserMiddleware({ findUser, Errors });
// export const editUser = makeGetUser({ updateUser });
// export const getUserOrganisations = makeGetUser({ findUserOrganisations });
// export const getUserPosts = makeGetUser({ findUserPosts });
// export const followUser = makeFollowUser({ findUser, updateUser });
// export const getFollowers = makeGetFollowers({ findUserFollowers });
// export const getFollowing = makeGetFollowing({ findUserFollowing });
// export const getIsFollowing = makeGetIsFollowing({ findUserFollowing });

//expose user controllers
export default { 
    signup, 
    login, 
    getUser, 
    setUserMiddleware,
    setParamUserMiddleware
    // editUser, 
    // getUserOrganisations, 
    // getUserPosts, 
    // followUser, 
    // getFollowers, 
    // getFollowing, 
    // getIsFollowing 
};