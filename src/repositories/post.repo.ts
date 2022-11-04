import mongoose from "mongoose";

interface Dependencies {
    PostModel: mongoose.Model<mongoose.Document, {}>
}

export default function makePostRepo({ PostModel } : Dependencies) {
    return Object.freeze({
        insert,
        findById,
    })

    async function findById(postId) {
        let post = await PostModel.findById(postId);

        if(!post) {
            return null;
        }

        const {_id: id, ...otherPostData } = post.toJSON();
        return { _id: id, ...otherPostData };
    }

    async function insert(postData) {
        let newPost = new PostModel(postData);
        let newPostDoc = await newPost.save();

        if(!newPostDoc) {
            return null;
        }
        
        const { _id: id, ...newPostData } = newPostDoc.toJSON();
        return { _id: id, ...newPostData };
    }
}
