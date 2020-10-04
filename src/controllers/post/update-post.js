export default function makeCreatePost({addPost}) {
    return async function createPost (httpReq) {
        const postData = httpReq.body;
        const {_id: userId, organisationIds} = httpReq.user;        
        const newPost = await addPost(postData, userId, organisationIds);
        return newPost;
    }
}