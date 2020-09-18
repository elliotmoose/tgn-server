export default function makePostDb({ PostModel }) {
    return Object.freeze({
        insert,
    })

    async function insert(postData) {
        let newPost = new PostModel(postData);
        let newPostDoc = await newPost.save();
        const { _id: id, ...newPostData } = newPostDoc.toJSON();
        return { _id: id, ...newPostData };
    }
}
