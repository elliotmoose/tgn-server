//repo dependencies
import { userRepo, organisationRepo } from './../../repositories/index';

//helper dependencies
import * as Errors from '../../constants/Errors';
import Validation from '../../helpers/Validation';
import Ids from '../../helpers/Ids';

//use cases
import makeCreateUser from "./create-user.uc";
import makeLoginUser from "./login-user.uc";
import makeFindUser from "./find-user.uc";

import makeCrypto from "../../helpers/crypto";
const secret = 'mooselliot';
const crypto = makeCrypto(secret);

//initialise use case makers
export const createUser = makeCreateUser({ userRepo, organisationRepo, crypto, Validation, Errors });
export const loginUser = makeLoginUser({ userRepo, crypto, Errors });
export const findUser = makeFindUser({ userRepo, Ids, Errors });

//expose use cases
export default { createUser, loginUser, findUser };