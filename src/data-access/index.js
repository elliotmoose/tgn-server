import mongoose from 'mongoose';
import makePostDb from './post-db';

const PostModel = mongoose.model('post');

export const postDb = makePostDb({ PostModel });

export default { postDb }
