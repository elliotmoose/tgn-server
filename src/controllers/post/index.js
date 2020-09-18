const { default: makeCreatePost } = require("./create-post");
const { addPost } = require('../../use-cases/post/');
const createPost = makeCreatePost({addPost});

const postController = Object.freeze({
    createPost
})

export default postController;
export { createPost };