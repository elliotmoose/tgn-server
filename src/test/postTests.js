
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let chailike = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED, ERROR_NOT_ORG_MEMBER } = require('../constants/errors');
const { organisationTemplateData, userCredentials, postTemplateData, commentTemplateData, secondUserCredentials } = require('./templateData');

let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');
let Post = mongoose.model('post');

chai.use(chaiHttp);
chai.use(chailike);
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
  
		let createOrgRes = await chai.request(server).post('/organisations/').send(organisationTemplateData);
		createOrgRes.should.have.status(200);
		organisationData = createOrgRes.body.data;
		
		let createUserRes = await chai.request(server).post('/users/').send(userCredentials);
		createUserRes.should.have.status(200);
	
		let loginRes = await chai.request(server).post('/users/login').send({username: userCredentials.username, password: userCredentials.password});
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
			let res = await chai.request(server).post('/posts').send(postTemplateData);
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_MISSING_TOKEN);
		});
		
		it('should create post without target', async () => {
			let res = await chai.request(server).post(`/posts`).set('authorization', `Bearer ${token}`).send(postTemplateData);
			res.should.have.status(200);
			res.body.data.should.be.like(postTemplateData);
			postWithoutTargetData = res.body.data;
		});
		
		it('should not allow create post if user is not member of target', async ()=> {
			let templateWithTarget = {...postTemplateData, target: organisationData._id};
			let res = await chai.request(server).post(`/posts`).set('authorization', `Bearer ${token}`).send(templateWithTarget);
			res.should.have.status(ERROR_NOT_ORG_MEMBER.status);
			res.body.error.should.eql(ERROR_NOT_ORG_MEMBER);
		});
		it('should create post with target if member', async () => {
			let joinRes = await chai.request(server).post(`/organisations/${organisationData._id}/userJoin`).set('authorization', `Bearer ${token}`).send();
			
			let templateWithTarget = {...postTemplateData, target: organisationData._id};
			let res = await chai.request(server).post(`/posts`).set('authorization', `Bearer ${token}`).send(templateWithTarget);
			res.should.have.status(200);
			res.body.data.should.be.like(templateWithTarget);
			postWithTargetData = res.body.data;
			
			let leaveRes = await chai.request(server).post(`/organisations/${organisationData._id}/userLeave`).set('authorization', `Bearer ${token}`).send();
		});
	});
		
	describe('Retrieving Posts', function () {			
		it('should get populated post with target', async () => {						
			let res = await chai.request(server).get(`/posts/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
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
			let res = await chai.request(server).get(`/posts/${postWithoutTargetData._id}`).set('authorization', `Bearer ${token}`).send();
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
			let joinRes = await chai.request(server).post(`/organisations/${organisationData._id}/userJoin`).set('authorization', `Bearer ${token}`).send();
			
			//TODO: user loses access if he quits org
			let res = await chai.request(server).get(`/users/${userCredentials.username}/posts`).set('authorization', `Bearer ${token}`).send();
			res.body.data.should.have.lengthOf.at.least(2);
			res.body.data[0].should.be.like(postTemplateData);

			let leaveRes = await chai.request(server).post(`/organisations/${organisationData._id}/userLeave`).set('authorization', `Bearer ${token}`).send();
		});				
	});
	
	describe('Interacting with Posts', function () {			
		it('should react to post', async () => {			
			let res = await chai.request(server).post(`/posts/${postWithTargetData._id}/react`).set('authorization', `Bearer ${token}`).send({reactionType: "love"});
			res.should.have.status(200);
			res.body.data.should.have.property('success').eql(true);

			let getPostRes = await chai.request(server).get(`/posts/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			getPostRes.should.have.status(200);
			getPostRes.body.data.should.have.property('loveReactionCount').eql(1);
		});
		it('should not react same twice', async () => {			
			let res = await chai.request(server).post(`/posts/${postWithTargetData._id}/react`).set('authorization', `Bearer ${token}`).send({reactionType: "love"});
			res.should.have.status(200);
			
			let getPostRes = await chai.request(server).get(`/posts/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			getPostRes.should.have.status(200);
			getPostRes.body.data.should.have.property('loveReactionCount').eql(1);
		});
		it('should allow different reaction', async () => {			
			let res = await chai.request(server).post(`/posts/${postWithTargetData._id}/react`).set('authorization', `Bearer ${token}`).send({reactionType: 'like'});
			res.should.have.status(200);
			res.body.data.should.have.property('success').eql(true);
			
			let getPostRes = await chai.request(server).get(`/posts/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			getPostRes.should.have.status(200);
			getPostRes.body.data.should.have.property('likeReactionCount').eql(1);
		});
		it('should get reaction count', async () => {			
			let res = await chai.request(server).get(`/posts/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.reactionCount.should.be.eql(2);			
		});
		it('should un-react', async () => {			
			let res = await chai.request(server).post(`/posts/${postWithTargetData._id}/unreact`).set('authorization', `Bearer ${token}`).send({reactionType: 'like'});
			res.should.have.status(200);
			res.body.data.should.have.property('success').eql(true);			
			
			let getPostRes = await chai.request(server).get(`/posts/${postWithTargetData._id}`).set('authorization', `Bearer ${token}`).send();
			getPostRes.should.have.status(200);
			getPostRes.body.data.should.have.property('likeReactionCount').eql(0);
		});
		it('should comment on post', async () => {						
			let res = await chai.request(server).post(`/posts/${postWithTargetData._id}/comment`).set('authorization', `Bearer ${token}`).send(commentTemplateData);
			res.should.have.status(200);

			res.body.data.commentCount.should.eql(1);			
		});
	});


	describe('Feed', function() {
		it('should get feed with date pagination', async () => {
			//second user
			let createUserRes = await chai.request(server).post('/users/').send(secondUserCredentials);
			createUserRes.should.have.status(200);
	
			let loginRes = await chai.request(server).post('/users/login').send({username: secondUserCredentials.username, password: secondUserCredentials.password});
			loginRes.should.have.status(200);

			let secondUserToken = loginRes.body.data.token;

			//follow
			let followRes = await chai.request(server).post(`/users/${secondUserCredentials.username}/follow`).set('authorization', `Bearer ${token}`).send();

			let checkPoint = 3;
			//make posts	
			for(let i=0;i<5;i++)
			{
				let postData = await chai.request(server).post(`/posts`).set('authorization', `Bearer ${secondUserToken}`).send({...postTemplateData, content: `POST ${i}`});				
			}

			let res = await chai.request(server).get(`/feed?limit=3`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.have.lengthOf(3);
			res.body.data[0].content.should.eql('POST 4');
			res.body.data[1].content.should.eql('POST 3');
			res.body.data[2].content.should.eql('POST 2');
			
			let lastPostDate = res.body.data[2].datePosted;
			
			//check with mongoose given date format
			let loadMoreRes = await chai.request(server).get(`/feed?limit=3&before=${lastPostDate}`).set('authorization', `Bearer ${token}`).send();
			loadMoreRes.should.have.status(200);
			loadMoreRes.body.data.should.have.lengthOf(3);
			loadMoreRes.body.data[0].content.should.eql('POST 1');
			loadMoreRes.body.data[1].content.should.eql('POST 0');
			loadMoreRes.body.data[2].content.should.eql(postTemplateData.content);

			
			//check with epoch dates
			let epochDateRes = await chai.request(server).get(`/feed?limit=5&before=${Date.now()}`).set('authorization', `Bearer ${token}`).send();
			epochDateRes.should.have.status(200);
			epochDateRes.body.data.should.have.lengthOf(5);			
		});
		it('should get my reactions for each feed post', async () => {
			await Post.deleteMany({});

			//create post
			let makePostRes = await chai.request(server).post(`/posts`).set('authorization', `Bearer ${token}`).send(postTemplateData);
			let post = makePostRes.body.data;
			//react to post
			await chai.request(server).post(`/posts/${post._id}/react`).set('authorization', `Bearer ${token}`).send({reactionType: "love"});
			await chai.request(server).post(`/posts/${post._id}/react`).set('authorization', `Bearer ${token}`).send({reactionType: "pray"});

			//get feed
			let res = await chai.request(server).get(`/feed?limit=5}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.have.lengthOf(1);			

			res.body.data[0].should.have.property('myReactions');
			res.body.data[0].myReactions.should.be.like(['love', 'pray']);
			
		});
		it('should get top comments', async () => {
			//create post
			let makePostRes = await chai.request(server).post(`/posts`).set('authorization', `Bearer ${token}`).send(postTemplateData);
			let post = makePostRes.body.data;
			
			//comment on post			
			await chai.request(server).post(`/posts/${post._id}/comment`).set('authorization', `Bearer ${token}`).send(commentTemplateData);
			await chai.request(server).post(`/posts/${post._id}/comment`).set('authorization', `Bearer ${token}`).send(commentTemplateData);
			await chai.request(server).post(`/posts/${post._id}/comment`).set('authorization', `Bearer ${token}`).send(commentTemplateData);

			//get feed
			let res = await chai.request(server).get(`/feed?limit=5}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);	
			res.body.data[0].comments.should.have.lengthOf(2);
		});
	})
});
