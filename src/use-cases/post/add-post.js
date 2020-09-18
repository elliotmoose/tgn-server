import { ERROR_NOT_ORG_MEMBER } from "../../constants/errors";

const { makePost } = require("../../entities");

export default function makeAddPost({postDb}) {
    return async function addPost(postData, posterUserId, posterIsMemberOfOrgIds) {
        let {content, postType, target} = postData;
        
        //must be member to make post to org
        if(target) {
            let isMember = posterIsMemberOfOrgIds.findIndex((id) => id.equals(target)) != -1;

            if(!isMember) {
                throw ERROR_NOT_ORG_MEMBER();
            }
        }

        const post = makePost({ user: posterUserId, content, postType, target });        
        return await postDb.insert({
            user: post.user, 
            content: post.content, 
            postType: post.postType, 
            target: post.target
        });
    }
}