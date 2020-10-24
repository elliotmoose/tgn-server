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
        }), Errors.INVALID_PARAM('password'));
        
        await expectThrowsAsync(createUser({
            password: '12345',
            email: 'othermoose@gmail.com',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('username'));
        
        await expectThrowsAsync(createUser({
            username: 'othermoose',
            password: '12345',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('email'));
    });
    

    it('should fail with invalid username', async () => { 
        await expectThrowsAsync(createUser({
            username: 'abc', //too short
            password: '12345', 
            email: 'othermoose@gmail.com',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('username'));
        
        await expectThrowsAsync(createUser({
            username: '!hi%moose', //invalid characters
            password: '12345', 
            email: 'othermoose@gmail.com',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('username'));
    });
    
    it('should fail with invalid password', async () => {
        await expectThrowsAsync(createUser({
            username: 'othermoose',
            password: '123', //too short
            email: 'othermoose@gmail.com',
            fullName: 'Elliot Koh'
        }), Errors.INVALID_PARAM('password'));
    });
})