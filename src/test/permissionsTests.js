
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let chailike = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED } = require('../constants/errors');
const { organisationTemplateData, userCredentials, postTemplateData, commentTemplateData, secondUserCredentials } = require('./templateData');

let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');
let Post = mongoose.model('post');

chai.use(chaiHttp);
chai.use(chailike);
let should = chai.should();

let users = [];
let organisations = [];
let posts = [];

const createUserAndLogin = async function(credentials) {
    let createUserRes = await chai.request(server).post('/users/').send(credentials);
    createUserRes.should.have.status(200);

    let loginRes = await chai.request(server).post('/users/login').send({username: credentials.username, password: credentials.password});
    loginRes.should.have.status(200);
    
    let token = loginRes.body.data.token;
    let userData = loginRes.body.data.user;
    return {token, data: userData}
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

describe('Access Control', function () {
	before(async ()=>{
		Organisation.deleteMany({});      
        User.deleteMany({});      
        Post.deleteMany({});      
  
        let organisationA = createOrganisation(organisationTemplateData);
        organisations.push(organisationA);

        let userA = createUserAndLogin(userCredentials);
        let userB = createUserAndLogin(secondUserCredentials);

        users.push(userA);
        users.push(userB);
    });
    
	after(()=>{
		Organisation.deleteMany({});      
        User.deleteMany({});      
        Post.deleteMany({});      
	});

	describe('Making Posts', function () {			
        it('should react to post', async () => {			
			let res = await chai.request(server).post(`/posts/${postWithTargetData._id}/react`).set('authorization', `Bearer ${token}`).send({reactionType: "love"});
			res.should.have.status(200);
		});
	});
});
