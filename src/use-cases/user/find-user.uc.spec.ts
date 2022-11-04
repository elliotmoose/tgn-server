import { expectThrowsAsync } from '../../helpers/test';
import Ids from '../../helpers/ids';
import chai, { assert, expect } from "chai"
import Validation from '../../helpers/validation';
import makeCreateUser from "./create-user.uc"
import Errors from '../../constants/Errors';
import mockUserRepo from "../../test/mock-user-repo";
import makeMockOrgRepo from "../../test/mock-org-repo";
import makeCrypto from '../../helpers/crypto';
import makeFindUser from './find-user.uc';
import makeIsFollowingUser from './is-following-user.uc';
import makeLoginUser from './login-user.uc';
import makeMockUserRepo from '../../test/mock-user-repo';
import mockUserData from '../../test/mock-data';

const like = require('chai-like');
const should = chai.should();
chai.use(like);

const userRepo = makeMockUserRepo({ Ids });
const organisationRepo = makeMockOrgRepo();

const crypto = makeCrypto('mooselliot');

const createUser = makeCreateUser({ userRepo, crypto, Validation, organisationRepo });
const findUser = makeFindUser({ userRepo, Ids });



describe('Find User', async () => {
    it('should find by username and id', async () => {
        await userRepo.clearAll();
        const newUser = await createUser(mockUserData.elliot)

        const userById = await findUser(newUser.id);        
        newUser.should.be.like(userById);
        const userByUsername = await findUser(mockUserData.elliot.username);        
        newUser.should.be.like(userByUsername);
    });

    it('should not find user that doesn\'t exist', async () => {
        await expectThrowsAsync(findUser('hello'), Errors.USER_NOT_FOUND());
    })
    
    it('should not fail on empty request', async () => {
        await expectThrowsAsync(findUser(null), Errors.USER_NOT_FOUND());
    })
    
    it('should find by ', async () => {
        await expectThrowsAsync(findUser(null), Errors.USER_NOT_FOUND());
    })
})