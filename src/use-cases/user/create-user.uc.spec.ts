import { APIError } from './../../constants/Errors';
import Ids from './../../helpers/Ids';
import chai, { assert, expect } from "chai"
import Validation from '../../helpers/Validation';
import makeCreateUser from "./create-user.uc"
import Errors from '../../constants/Errors';
import mockUserRepo from "../../test/mock-user-repo";
import mockOrganisationRepo from "../../test/mock-org-repo";
import makeCrypto from '../../helpers/crypto';
import makeFindUser from './find-user.uc';

const like = require('chai-like');
const should = chai.should();
chai.use(like);

const userRepo = mockUserRepo;
const organisationRepo = mockOrganisationRepo;

const crypto = makeCrypto('mooselliot');

const createUser = makeCreateUser({ userRepo, crypto, Validation, organisationRepo });
const findUser = makeFindUser({ userRepo, Ids });

const expectThrowsAsync = async (method, expected) => {
    let err;
    try {
        await method;
    } catch (error) {
        err = error;
    }
    
    expect(err.toJSON()).to.eql(expected);
}

describe('User CRUD', () => {
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

    it('should not find user', async () => {
        await expectThrowsAsync(findUser('hello'), Errors.USER_NOT_FOUND().toJSON());
    })
})