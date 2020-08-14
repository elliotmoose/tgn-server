
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiLike = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED } = require('../constants/errors');
const { organisationData, userCredentials, postTemplateData, reactTemplateData, commentTemplateData } = require('./templateData');

let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');
let Post = mongoose.model('post');

chai.use(chaiHttp);
chai.use(chaiLike);
let should = chai.should();


let token = null;
let userData = null;
let postData = null;

describe('Posts', function () {
	before(async ()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});    
		Post.deleteMany({}, ()=>{});      
  
		let createOrgRes = await chai.request(server).post('/organisation/create').send(organisationData);
		createOrgRes.should.have.status(200);
		
		let createUserRes = await chai.request(server).post('/user/create').send(userCredentials);
		createUserRes.should.have.status(200);
	
		let loginRes = await chai.request(server).post('/user/login').send({username: userCredentials.username, password: userCredentials.password});
		loginRes.should.have.status(200);
		
		token = loginRes.body.data.token;
		userData = loginRes.body.data.user;
	});
	after(()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});      
	});



	describe('Making Posts', function () {			
		it('should require token to make post', async () => {			
			let res = await chai.request(server).post('/post').send(postTemplateData);
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_MISSING_TOKEN);
		});
		
		it('should create post', async () => {
			let res = await chai.request(server).post(`/post`).set('authorization', `Bearer ${token}`).send(postTemplateData);
			res.should.have.status(200);
			res.body.data.should.be.like(postTemplateData);
			postData = res.body.data;
		});
	});
		
	describe('Retrieving Posts', function () {			
		it('should get posts', async () => {			

		});
	});
	
	describe('Interacting with Posts', function () {			
		it('should react to post', async () => {			
			let res = await chai.request(server).post(`/post/${postData._id}/react`).set('authorization', `Bearer ${token}`).send(reactTemplateData);
			res.should.have.status(200);
		});
		it('should not react same twice', async () => {			
			let res = await chai.request(server).post(`/post/${postData._id}/react`).set('authorization', `Bearer ${token}`).send(reactTemplateData);
			res.should.have.status(409);
		});
		it('should allow different reaction', async () => {			
			let res = await chai.request(server).post(`/post/${postData._id}/react`).set('authorization', `Bearer ${token}`).send({...reactTemplateData, reactionType: 'THUMBSUP'});
			res.should.have.status(200);
		});
		it('should comment on post', async () => {			
			
		});
	});
});