import { expectThrowsAsync } from '../../helpers/test';
import { APIError } from '../../constants/Errors';
import Ids from '../../helpers/ids';
import chai, { assert, expect } from "chai"
import Validation from '../../helpers/validation';
import makeCreateUser from "./create-user.uc"
import Errors from '../../constants/Errors';
import makeMockOrgRepo from "../../test/mock-org-repo";
import makeCrypto from '../../helpers/crypto';
import makeFindUser from './find-user.uc';
import makeMockUserRepo from '../../test/mock-user-repo';
import mockUserData from '../../test/mock-data';

const like = require('chai-like');
const should = chai.should();
chai.use(like);

const userRepo = makeMockUserRepo({ Ids });
const organisationRepo = makeMockOrgRepo();;

const crypto = makeCrypto('mooselliot');

const createUser = makeCreateUser({ userRepo, crypto, Validation, organisationRepo });
const findUser = makeFindUser({ userRepo, Ids });

describe('Create User', async () => {    
    it('should create user', async () => {
        await userRepo.clearAll();
        const newUser = await createUser(mockUserData.elliot)
        const retrieveNewUser = await findUser(newUser.username);
        newUser.should.be.like(retrieveNewUser);
    });
    
    it('should fail with incomplete details', async () => {
        await userRepo.clearAll();
        await expectThrowsAsync(createUser({...mockUserData.elliot, password: undefined}), Errors.INVALID_PARAM('password'));
        await expectThrowsAsync(createUser({...mockUserData.elliot, username: undefined}), Errors.INVALID_PARAM('username'));
        await expectThrowsAsync(createUser({...mockUserData.elliot, email: undefined}), Errors.INVALID_PARAM('email'));
    });
    
    it('should fail with invalid username', async () => { 
        await expectThrowsAsync(createUser({...mockUserData.elliot, username: 'abc'}), Errors.INVALID_PARAM('username'));        
        await expectThrowsAsync(createUser({...mockUserData.elliot, username: '!hi%moose'}), Errors.INVALID_PARAM('username'));
    });
    
    it('should fail with invalid password', async () => {
        await expectThrowsAsync(createUser({...mockUserData.elliot, password: '123'}), Errors.INVALID_PARAM('password'));
    });
})