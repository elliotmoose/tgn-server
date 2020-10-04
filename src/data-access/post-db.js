/**
 * 
 * @param {import(".").DataAccessDependancies} dependancies
 */
export default function makePostDb({ PostModel }) {
    return Object.freeze({
        insert,
        findById,
    })

    async function findById(postId) {
        let post = await PostModel.findById(postId);
        const {_id: id, ...otherPostData } = post;
        return { _id: id, ...otherPostData };
    }

    async function insert(postData) {
        let newPost = new PostModel(postData);
        let newPostDoc = await newPost.save();
        const { _id: id, ...newPostData } = newPostDoc.toJSON();
        return { _id: id, ...newPostData };
    }
}
