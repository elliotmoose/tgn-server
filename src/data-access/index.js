import mongoose from 'mongoose';
import makeUserDb from './user-db';
import makePostDb from './post-db';

const UserModel = mongoose.model('user');
const PostModel = mongoose.model('post');

export const userDb = makeUserDb({ UserModel });
export const postDb = makePostDb({ PostModel });

export default { userDb, postDb }

// export interface DataAccessDependancies {
//     PostModel? : Model
//     UserModel? : Model
// }
