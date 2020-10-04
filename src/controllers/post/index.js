import makeCreatePost from "./create-post";
import makeReactPost from "./react-post";
import { addPost, addReaction } from '../../use-cases/post/';

const createPost = makeCreatePost({ addPost });
const reactToPost = makeReactPost({ addReaction });

const postController = Object.freeze({
    createPost,
    reactToPost
})

export default postController;
export { createPost, reactToPost };