import mongoose from 'mongoose';
import makeUserRepo from './user.repo';
import makePostRepo from './post.repo';
import makeOrganisationRepo from './organisation.repo';

const UserModel = mongoose.model('user');
const PostModel = mongoose.model('post');
const OrganisationModel = mongoose.model('organisation');

export const userRepo = makeUserRepo({ UserModel });
export const postRepo = makePostRepo({ PostModel });
export const organisationRepo = makeOrganisationRepo({ OrganisationModel });

export default { userRepo, postRepo, organisationRepo };