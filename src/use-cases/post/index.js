const { postDb } = require("../../data-access");
const {default: makeAddPost } = require("./add-post");

let addPost = makeAddPost({postDb});

const postUseCases = Object.freeze({
    addPost
});

export default postUseCases;
export { addPost };

