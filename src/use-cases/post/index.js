const { postDb } = require("../../data-access");
const {default: makeAddPost } = require("./add-post");
const {default: makeAddReaction } = require("./add-reaction");

let addPost = makeAddPost({postDb});
let addReaction = makeAddReaction({postDb});

const postUseCases = Object.freeze({
    addPost,
    addReaction
});

export default postUseCases;
export { addPost, addReaction };

