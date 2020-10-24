import Errors from './../../constants/Errors';
import Validation from '../../helpers/validation';
import { expectThrowsAsync } from '../../helpers/test';
import Ids from '../../helpers/ids';
import chai, { assert, expect } from "chai"
import makeCrypto from '../../helpers/crypto';
import mockUserData from '../../test/mock-data';
import makeMockUserRepo from '../../test/mock-user-repo';
import makeVerifyUserToken from './verify-user-token.uc';
import makeCreateUser from './create-user.uc';
import makeMockOrgRepo from "../../test/mock-org-repo";

const like = require('chai-like');
const should = chai.should();
chai.use(like);

const userRepo = makeMockUserRepo({ Ids });
const organisationRepo = makeMockOrgRepo();
const crypto = makeCrypto('mooselliot');

const createUser = makeCreateUser({ userRepo, crypto, Validation, organisationRepo });
const verifyUserToken = makeVerifyUserToken({ userRepo, Ids, crypto});

describe('Verify User Token', async () => {
    it('should verify token and return user', async () => {
        await userRepo.clearAll();
        const newUser = await createUser(mockUserData.elliot)
        let token = crypto.generateJsonWebToken({userId: newUser.id});
        let verifiedUser = await verifyUserToken(token);        
        verifiedUser.should.be.like(newUser)
    });
    
    it('should reject invalid token', async () => {
        await userRepo.clearAll();
        const newUser = await createUser(mockUserData.elliot);
        let token = crypto.generateJsonWebToken({userId: newUser.id});
        await expectThrowsAsync(verifyUserToken(token + '1'), Errors.INVALID_TOKEN());
        await expectThrowsAsync(verifyUserToken(''), Errors.INVALID_TOKEN());
    });
    
    it('should reject malformed token', async () => {
        let token = crypto.generateJsonWebToken({someOtherKey: 'Some fake token'});
        await expectThrowsAsync(verifyUserToken(token), Errors.INVALID_TOKEN());
    });
    
    it('should throw if user does not exist', async () => {
        await userRepo.clearAll();
        const newUser = await createUser(mockUserData.elliot);
        await userRepo.clearAll();
        let token = crypto.generateJsonWebToken({userId: newUser.id});
        await expectThrowsAsync(verifyUserToken(token), Errors.USER_NOT_FOUND());
    });
})