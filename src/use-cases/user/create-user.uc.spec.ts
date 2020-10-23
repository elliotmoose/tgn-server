import { expectThrowsAsync } from '../../helpers/test';
import { APIError } from '../../constants/Errors';
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

const like = require('chai-like');
const should = chai.should();
chai.use(like);

const userRepo = mockUserRepo;
const organisationRepo = mockOrganisationRepo;

const crypto = makeCrypto('mooselliot');

const createUser = makeCreateUser({ userRepo, crypto, Validation, organisationRepo });
const findUser = makeFindUser({ userRepo, Ids });

describe('Create User', () => {
    userRepo.clearAll();

    it('should create user', async () => {
        const newUser = await createUser({
            username: 'mooselliot',
            password: '12321',
            email: 'moose@gmail.com',
            fullName: 'Elliot Koh'
        })

        const retrieveNewUser = await findUser(newUser.username);
        
        newUser.should.be.like(retrieveNewUser);
    });
    
    it('should fail with incomplete details', async () => {
        await expectThrowsAsync(createUser({
            username: 'othermoose',
            email: 'othermoose@gmail.com',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('password').toJSON());
        
        await expectThrowsAsync(createUser({
            password: '12345',
            email: 'othermoose@gmail.com',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('username').toJSON());
        
        await expectThrowsAsync(createUser({
            username: 'othermoose',
            password: '12345',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('email').toJSON());
    });
    

    it('should fail with invalid username', async () => { 
        await expectThrowsAsync(createUser({
            username: 'abc', //too short
            password: '12345', 
            email: 'othermoose@gmail.com',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('username').toJSON());
        
        await expectThrowsAsync(createUser({
            username: '!hi%moose', //invalid characters
            password: '12345', 
            email: 'othermoose@gmail.com',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('username').toJSON());
    });
    
    it('should fail with invalid password', async () => {
        await expectThrowsAsync(createUser({
            username: 'othermoose',
            password: '123', //too short
            email: 'othermoose@gmail.com',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('password').toJSON());
    });
})