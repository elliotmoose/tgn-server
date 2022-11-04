
//repo dependencies
import { userRepo, organisationRepo } from './../../repositories/index';

//helper dependencies
import * as Errors from '../../constants/Errors';
import Validation from '../../helpers/validation';
import Ids from '../../helpers/ids';

//use cases
import makeCreateUser from "./create-user.uc";
import makeLoginUser from "./login-user.uc";
import makeFindUser from "./find-user.uc";

import makeCrypto from "../../helpers/crypto";
import makeVerifyUserToken from './verify-user-token.uc';
import makeIsFollowingUser from './is-following-user.uc';
const secret = 'mooselliot';
const crypto = makeCrypto(secret);

//initialise use case makers
export const createUser = makeCreateUser({ userRepo, organisationRepo, crypto, Validation });
export const loginUser = makeLoginUser({ userRepo, crypto });
export const findUser = makeFindUser({ userRepo, Ids });
export const isFollowingUser = makeIsFollowingUser({ userRepo, Ids});

export const verifyUserToken = makeVerifyUserToken({ userRepo, Ids, crypto});

//expose use cases
export default { createUser, loginUser, findUser, verifyUserToken, isFollowingUser };