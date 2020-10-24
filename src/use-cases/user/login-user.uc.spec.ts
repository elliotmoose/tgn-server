import { expectThrowsAsync } from '../../helpers/test';
import Ids from '../../helpers/ids';
import chai, { assert, expect } from "chai"
import Validation from '../../helpers/validation';
import makeCreateUser from "./create-user.uc"
import Errors from '../../constants/Errors';
import mockUserRepo from "../../test/mock-user-repo";
import mockOrganisationRepo from "../../test/mock-org-repo";
import makeCrypto from '../../helpers/crypto';
import makeFindUser from './find-user.uc';
import makeIsFollowingUser from './is-following-user.uc';
import makeLoginUser from './login-user.uc';
import mockUserData from '../../test/mock-data';
import makeMockUserRepo from '../../test/mock-user-repo';

const like = require('chai-like');
const should = chai.should();
chai.use(like);

const userRepo = makeMockUserRepo({ Ids });
const organisationRepo = mockOrganisationRepo;

// option A: implement database methods in mock repo
// option B: implement model database in mock model
// option C: mock repo is itself a repo, whereby a connection must be made to a different db

const crypto = makeCrypto('mooselliot');

const createUser = makeCreateUser({ userRepo, crypto, Validation, organisationRepo });
const loginUser = makeLoginUser({ userRepo, crypto });



describe('Login User', async () => {
    it('should find by username and id', async () => {
        await userRepo.clearAll();
        const newUser = await createUser(mockUserData)
        
        const response = await loginUser({
            username: mockUserData.username,
            password: mockUserData.password
        });        

        response.should.have.property('user');
        let user = response.user;
        user.should.have.property('username').eql(mockUserData.username)
        user.should.have.property('fullName').eql(mockUserData.fullName)
        user.should.have.property('id').eql(newUser.id);
        

        response.should.have.property('token');
        assert(response.token.length > 5);
     
    });

    it('should reject wrong credentials', async () => {
        await expectThrowsAsync(loginUser({
            username: mockUserData.username,
            password: mockUserData.password + '1'
        }), Errors.LOGIN_FAILED().toJSON());
    })
    
    it('should not fail on empty request', async () => {
        await expectThrowsAsync(loginUser({
            username: mockUserData.username,
        }), Errors.INVALID_PARAM('password').toJSON());
        
        await expectThrowsAsync(loginUser({
            password: mockUserData.password,
        }), Errors.INVALID_PARAM('username').toJSON());
    })
})