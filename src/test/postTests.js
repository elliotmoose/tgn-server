
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiLike = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED } = require('../constants/errors');
const { organisationTemplateData, userCredentials, postTemplateData, commentTemplateData, secondUserCredentials } = require('./templateData');

let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');
let Post = mongoose.model('post');

chai.use(chaiHttp);
chai.use(chaiLike);
let should = chai.should();


let token = null;
let userData = null;
let organisationData = null;
let postWithoutTargetData = null;
let postWithTargetData = null;

describe('Posts', function () {
	before(async ()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});    
		Post.deleteMany({}, ()=>{});      
  
		let createOrgRes = await chai.request(server).post('/organisation/create').send(organisationTemplateData);
		createOrgRes.should.have.status(200);
		organisationData = createOrgRes.body.data;
		
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
		
		it('should create post without target', async () => {
			let res = await chai.request(server).post(`/post`).set('authorization', `Bearer ${token}`).send(postTemplateData);
			res.should.have.status(200);
			res.body.data.should.be.like(postTemplateData);
			postWithoutTargetData = res.body.data;
		});
		
		it('should create post with target', async () => {
			let templateWithTarget = {...postTemplateData, target: organisationData._id};
			let res = await chai.request(server).post(`/post`).set('authorization', `Bearer ${token}`).send(templateWithTarget);
			res.should.have.status(200);
			res.body.data.should.be.like(templateWithTarget);
			postWithTargetData = res.body.data;
		});
	});
		
	describe('Retrieving Posts', function () {			
		it('should get populated post with target', async () => {						
			let res = await chai.request(server).get(`/post/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.be.like(postTemplateData);
			
			//check user populated
			res.body.data.should.have.property('user');
			res.body.data.user.should.have.property('username').eql(userData.username);
			res.body.data.user.should.not.have.property('password');
			
			//check org populated
			res.body.data.should.have.property('target');
			res.body.data.target.should.have.property('handle').eql(organisationData.handle);
			
		});		
		it('should get populated post without target', async () => {						
			let res = await chai.request(server).get(`/post/${postWithoutTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.be.like(postTemplateData);
			
			//check user populated
			res.body.data.should.have.property('user');
			res.body.data.user.should.have.property('username').eql(userData.username);
			res.body.data.user.should.not.have.property('password');
			
			//check org populated null
			res.body.data.should.have.property('target').eql(null);			
		});		
		it('should get posts by user', async () => {			
			let res = await chai.request(server).get(`/user/${userCredentials.username}/posts`).set('authorization', `Bearer ${token}`).send();
			res.body.data.should.have.lengthOf.at.least(2);
			res.body.data[0].should.be.like(postTemplateData);
		});				
	});
	
	describe('Feed', function() {
		it('should get feed with pagination', async () => {
			
			//second user
			let createUserRes = await chai.request(server).post('/user/create').send(secondUserCredentials);
			createUserRes.should.have.status(200);
	
			let loginRes = await chai.request(server).post('/user/login').send({username: secondUserCredentials.username, password: secondUserCredentials.password});
			loginRes.should.have.status(200);

			let secondUserToken = loginRes.body.data.token;

			//follow
			let followRes = await chai.request(server).post(`/user/${secondUserCredentials.username}/follow`).set('authorization', `Bearer ${token}`).send();

			//make posts	
			for(let i=0;i<5;i++)
			{
				await chai.request(server).post(`/post`).set('authorization', `Bearer ${secondUserToken}`).send({...postTemplateData, content: `POST ${i}`});
			}

			for(let i=0;i<5;i++)
			{
				let res = await chai.request(server).get(`/feed?page=${i}&limit=1`).set('authorization', `Bearer ${token}`).send();
				res.should.have.status(200);
				res.body.data[0].content.should.eql(`POST ${4-i}`);
			}
		});
	})
	
	describe('Interacting with Posts', function () {			
		it('should react to post', async () => {			
			let res = await chai.request(server).post(`/post/${postWithTargetData._id}/react`).set('authorization', `Bearer ${token}`).send({reactionType: "LOVE"});
			res.should.have.status(200);
			res.body.data.should.have.property('success').eql(true);

			let getPostRes = await chai.request(server).get(`/post/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			getPostRes.should.have.status(200);
			getPostRes.body.data.should.have.property('loveReactionCount').eql(1);
		});
		it('should not react same twice', async () => {			
			let res = await chai.request(server).post(`/post/${postWithTargetData._id}/react`).set('authorization', `Bearer ${token}`).send({reactionType: "LOVE"});
			res.should.have.status(200);
			
			let getPostRes = await chai.request(server).get(`/post/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			getPostRes.should.have.status(200);
			getPostRes.body.data.should.have.property('loveReactionCount').eql(1);
		});
		it('should allow different reaction', async () => {			
			let res = await chai.request(server).post(`/post/${postWithTargetData._id}/react`).set('authorization', `Bearer ${token}`).send({reactionType: 'LIKE'});
			res.should.have.status(200);
			res.body.data.should.have.property('success').eql(true);
			
			let getPostRes = await chai.request(server).get(`/post/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			getPostRes.should.have.status(200);
			getPostRes.body.data.should.have.property('likeReactionCount').eql(1);
		});
		it('should get reaction count', async () => {			
			let res = await chai.request(server).get(`/post/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.reactionCount.should.be.eql(2);			
		});
		it('should un-react', async () => {			
			let res = await chai.request(server).post(`/post/${postWithTargetData._id}/unreact`).set('authorization', `Bearer ${token}`).send({reactionType: 'LIKE'});
			res.should.have.status(200);
			res.body.data.should.have.property('success').eql(true);			
			
			let getPostRes = await chai.request(server).get(`/post/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			getPostRes.should.have.status(200);
			getPostRes.body.data.should.have.property('likeReactionCount').eql(0);
		});
		it('should get most common reaction', async () => {			
			let res = await chai.request(server).get(`/post/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.maxReactionType.should.be.eql('love');			
		});
		it('should comment on post', async () => {			
			throw new Error('to implement');
		});
	});
});
