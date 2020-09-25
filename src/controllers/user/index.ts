//use case dependencies
import {
    createUser, 
    loginUser, 
    findUser, 
    // updateUser, 
    // findUserOrganisations, 
    // findUserPosts, 
    // findUserFollowers, 
    // findUserFollowing
} from "../../use-cases/user";

//import controllers
import makeSignUp from "./signup.controller";
import makeLogin from "./login.controller";
import makeGetUser from "./get-user.controller";
// import makeFollowUser from "./follow-user.controller";
// import makeGetFollowers from "./get-followers.controller";
// import makeGetFollowing from "./get-following.controller";
// import makeGetIsFollowing from "./get-is-following.controller";

//initialise user controller makers
export const signup = makeSignUp({ createUser });
export const login = makeLogin({ loginUser });
export const getUser = makeGetUser({ findUser });
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
    // editUser, 
    // getUserOrganisations, 
    // getUserPosts, 
    // followUser, 
    // getFollowers, 
    // getFollowing, 
    // getIsFollowing 
};