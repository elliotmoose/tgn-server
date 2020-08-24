
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let chailike = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED, ERROR_NOT_FOLLOWING_USER } = require('../constants/errors');
const { organisationTemplateData, userCredentials, postTemplateData, commentTemplateData, secondUserCredentials } = require('./templateData');

let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');
let Post = mongoose.model('post');

chai.use(chaiHttp);
chai.use(chailike);
let should = chai.should();

let users = {};
let organisations = {};
let posts = {};

const createUserAndLogin = async function(credentials) {
    let createUserRes = await chai.request(server).post('/users/').send(credentials);
    createUserRes.should.have.status(200);

    let loginRes = await chai.request(server).post('/users/login').send({username: credentials.username, password: credentials.password});
    loginRes.should.have.status(200);
    
    let token = loginRes.body.data.token;
    let userData = loginRes.body.data.user;
    userData.token = token;
    return userData;
}

const createOrganisation = async function (credentials) {
    let createOrgRes = await chai.request(server).post('/organisations/').send(credentials);
    createOrgRes.should.have.status(200);
    return createOrgRes.body.data;
}

const makePost = async function (targetOrg, user) {
    let userPublicStatus = user.public ? 'public' : 'private';
    let orgPublicStatus = targetOrg.public ? 'public' : 'private';

    let makePostRes = await chai.request(server).post(`/posts/`).set('authorization', `Bearer ${user.token}`).send({
        content: `Post created by ${user.data.username} (${userPublicStatus}) with target ${targetOrg.handle} (${orgPublicStatus})`,
        postType: 'testimony',
        target: targetOrg.id
    });
    makePostRes.should.have.status(200);
    return makePostRes.body.data;
}

const updateUser = async function (userKey, userData) {
    let user = users[userKey];
    let updateUserRes = await chai.request(server).put(`/users/${user._id}`).set('authorization', `Bearer ${user.token}`).send(userData);
    updateUserRes.should.have.status(200);
    users[userKey] = {...user, ...updateUserRes.body.data};
}

describe('Access Control', function () {
	before(async ()=>{
		await Organisation.deleteMany({});      
        await User.deleteMany({});      
        await Post.deleteMany({});      
  
        let organisationA = await createOrganisation(organisationTemplateData);
        organisations.a = organisationA;

        let userA = await createUserAndLogin(userCredentials);
        let userB = await createUserAndLogin(secondUserCredentials);

        users.a = userA;
        users.b = userB;

        updateUser('b', {public: true});
    });
    
	after(()=>{
		Organisation.deleteMany({});      
        User.deleteMany({});      
        Post.deleteMany({});      
	});

	describe('Access to User Profiles', function () {			
        it('should allow private user to access own profile', async () => {			
            let res = await chai.request(server).get(`/users/${users.a._id}`).set('authorization', `Bearer ${users.a.token}`).send();
            res.should.have.status(200);
		});
        it('should allow any user to access public user profile', async () => {			
            let res = await chai.request(server).get(`/users/${users.b._id}`).set('authorization', `Bearer ${users.a.token}`).send();
            res.should.have.status(200);			
            
            res = await chai.request(server).get(`/users/${users.a._id}`).set('authorization', `Bearer ${users.a.token}`).send();
            res.should.have.status(200);			
		});
        it('should not allow any user to access private user profile', async () => {			
            let res = await chai.request(server).get(`/users/${users.a._id}`).set('authorization', `Bearer ${users.b.token}`).send();
            res.should.have.status(ERROR_NOT_FOLLOWING_USER.status);			
            res.body.should.have.property('error').eql(ERROR_NOT_FOLLOWING_USER);			
		});
	});
});
