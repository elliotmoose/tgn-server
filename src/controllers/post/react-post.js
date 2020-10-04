export default function makeReactPost({addReaction}) {
    return async function reactPost (httpReq) {
        
        const { reactionType } = httpReq.body;
        const { _id: userId } =  httpReq.user;
        const postId = httpReq.params.postId;

        const updatedPost = await addReaction(postId, userId, reactionType);
        return updatedPost;
    }
}