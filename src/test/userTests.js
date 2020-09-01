
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED, ERROR_CANNOT_FOLLOW_SELF, ERROR_ALREADY_FOLLOWING_USER, ERROR_NOT_FOLLOWING_USER, ERROR_USER_NOT_FOUND } = require('../constants/errors');
const { organisationTemplateData, userCredentials, secondUserCredentials } = require('./templateData');
const { follow } = require('../controllers/userController');
const { joinOrgAs } = require('./testHelper');
let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');

chai.use(chaiHttp);
let should = chai.should();


describe('Users', function () {
	before(async ()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});      
		
		let createOrgRes = await chai.request(server).post('/organisations/').send(organisationTemplateData);
		createOrgRes.should.have.status(200);


	});
	after(()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});      
	});


	let token = null;
	let userData = null;
	let secondUserToken = null;
	let secondUserData = null;

	describe('Valid signup', function () {			
		it('should reject invalid username ', async () => {			
			let res = await chai.request(server).post('/users/').send({...userCredentials, username: '__usead.1!'});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_INVALID_PARAM('username').toJSON());
		});
		it('should reject invalid email ', async () => {			
			let res = await chai.request(server).post('/users/').send({...userCredentials, email: 'kyzelliot@@gmail.com'});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_INVALID_PARAM('email').toJSON());
		});
		it('should create a new user ', async () => {			
			let res = await chai.request(server).post('/users/').send(userCredentials);
			res.should.have.status(200);
			res.body.data.should.have.property('username').eql(userCredentials.username);
			res.body.data.should.have.property('fullName').eql(userCredentials.fullName);
			res.body.data.should.have.property('email').eql(userCredentials.email);
			res.body.data.should.not.have.property('password');
			res.body.data.should.not.have.property('passwordSalt');
			
			//create second user
			let createUserRes = await chai.request(server).post('/users/').send(secondUserCredentials);
			secondUserData = createUserRes.body.data;
		});
		it('should not allow duplicate username', async () => {
			let res = await chai.request(server).post('/users/').send({...userCredentials, email: 'abcedf@gmail.com'});
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_USERNAME_TAKEN().toJSON());
		});
		it('should not overlap organisation handle', async () => {
			let res = await chai.request(server).post('/users/').send({...userCredentials, username: organisationTemplateData.handle});
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_USERNAME_TAKEN().toJSON());
		});
		it('should not allow duplicate email', async () => {
			let res = await chai.request(server).post('/users/').send({...userCredentials, username: 'abcdefg' });
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_EMAIL_TAKEN().toJSON());
		});		
	});

	describe('Auth', ()=>{
		it('should reject login with wrong password', async () => {
			let res = await chai.request(server).post('/users/login').send({username: userCredentials.username, password: '54321'});
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_LOGIN_FAILED().toJSON());				
		});
		it('should reject login with wrong username', async () => {
			let res = await chai.request(server).post('/users/login').send({username: 'asdfghjk', password: userCredentials.password});
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_LOGIN_FAILED().toJSON());				
		});
		
		it('should login with correct credentials and generate jwt', async () => {
			let res = await chai.request(server).post('/users/login').send({username: userCredentials.username, password: userCredentials.password});
			res.should.have.status(200);
			res.body.should.have.property('data');			
			res.body.data.should.have.all.keys('token', 'user');						
			
			//set token for testing later
			token = res.body.data.token;
			token.should.not.be.empty;
			
			//set user for testing later
			userData = res.body.data.user;			
			res.body.data.user.should.have.property('username').eql(userCredentials.username);
			res.body.data.user.should.have.property('fullName').eql(userCredentials.fullName);
			res.body.data.user.should.have.property('email').eql(userCredentials.email);
			res.body.data.user.should.not.have.property('password');
			res.body.data.user.should.not.have.property('passwordSalt');
			
			let secondUserLoginRes = await chai.request(server).post('/users/login').send({username: secondUserCredentials.username, password: secondUserCredentials.password});
			secondUserLoginRes.should.have.status(200);
			secondUserData = secondUserLoginRes.body.data.user;
			secondUserToken = secondUserLoginRes.body.data.token;
		});
		it('should reject unauthenticated get', async () => {
			let res = await chai.request(server).get(`/users/${userData._id}`).send();
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_MISSING_TOKEN().toJSON());
		});
		it('should reject invalid token', async () => {
			let res = await chai.request(server).get(`/users/${userData._id}`).set('authorization', `Bearer SomeOtherTokenValue`).send();
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_INVALID_TOKEN().toJSON());
		});
		it('should accept valid token', async () => {
			let res = await chai.request(server).get(`/users/${userData._id}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.should.have.property('data');			
		});
	});

	describe('User Profile', ()=>{
		it('should get user data by username', async () => {
			let res = await chai.request(server).get(`/users/${userCredentials.username}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.be.like({username: userCredentials.username, email: userCredentials.email});
		});
		it('should get user data by id', async () => {
			let res = await chai.request(server).get(`/users/${userData._id}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.be.like({username: userCredentials.username, email: userCredentials.email});
		});
		it('should get user member of', async () => {			
			let res = await chai.request(server).get(`/users/${userData._id}/memberOf`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			//TODO: join org and check if it is in the response
		});
	});
	
	describe('Update Profile', ()=>{
		it('should update profile public', async () => {
			let res = await chai.request(server).put(`/users/${userData._id}`).set('authorization', `Bearer ${token}`).send({
				public: true
			});
			res.should.have.status(200);
			res.body.data.should.be.like({...userData, public: true});
		});
		it('should reject if requested without token', async () => {
			let res = await chai.request(server).put(`/users/${userData._id}`).send({
				public: true
			});
			res.should.have.status(ERROR_MISSING_TOKEN().status);
			res.body.error.should.eql(ERROR_MISSING_TOKEN().toJSON());
		});
		it('should reject if requested by another user', async () => {
			let res = await chai.request(server).put(`/users/${userData._id}`).set('authorization', `Bearer ${secondUserToken}`).send({
				public: true
			});
			res.should.have.status(ERROR_NOT_AUTHORISED().status);
			res.body.error.should.eql(ERROR_NOT_AUTHORISED().toJSON());
		});
		it('should reject if user does not exist', async () => {
			let res = await chai.request(server).put(`/users/abcdefg`).set('authorization', `Bearer ${secondUserToken}`).send({
				public: true
			});
			res.should.have.status(ERROR_USER_NOT_FOUND().status);
			res.body.error.should.eql(ERROR_USER_NOT_FOUND().toJSON());
		});
	});
	
	describe('Follow Users', ()=>{
		it('should follow user', async () => {
			let res = await chai.request(server).post(`/users/${secondUserCredentials.username}/follow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
		});
		it('should check is following', async () => {
			let res = await chai.request(server).get(`/users/${secondUserCredentials.username}/isFollowing`).set('authorization', `Bearer ${token}`).send();			
			res.should.have.status(200);
			res.body.data.should.eql(true);
			
			let ownselfRes = await chai.request(server).get(`/users/${userCredentials.username}/isFollowing`).set('authorization', `Bearer ${token}`).send();			
			ownselfRes.should.have.status(200);
			ownselfRes.body.data.should.eql(false);
		});
		it('should be ok to follow twice with error', async () => {
			let res = await chai.request(server).post(`/users/${secondUserCredentials.username}/follow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.should.have.property('data').eql(ERROR_ALREADY_FOLLOWING_USER().toJSON());
		});
		it('should get followers and following', async () => {			
			let followingRes = await chai.request(server).get(`/users/${userCredentials.username}/following`).set('authorization', `Bearer ${token}`).send();
			followingRes.should.have.status(200);
			followingRes.body.data[0].should.eql(secondUserData._id);
			
			let followersRes = await chai.request(server).get(`/users/${secondUserCredentials.username}/followers`).set('authorization', `Bearer ${token}`).send();
			followersRes.should.have.status(200);
			followersRes.body.data[0].should.eql(userData._id);
		});
		it('should not allow to follow ownself', async () => {
			let res = await chai.request(server).post(`/users/${userCredentials.username}/follow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(403);
			res.body.should.have.property('error').eql(ERROR_CANNOT_FOLLOW_SELF().toJSON());
		});		
		it('should unfollow', async () => {
			let res = await chai.request(server).post(`/users/${secondUserCredentials.username}/unfollow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			
			let isFollowingRes = await chai.request(server).get(`/users/${userCredentials.username}/isFollowing`).set('authorization', `Bearer ${token}`).send();			
			isFollowingRes.should.have.status(200);
			isFollowingRes.body.data.should.eql(false);
		});
		it('unfollow twice should be fine', async () => {
			let res = await chai.request(server).post(`/users/${secondUserCredentials.username}/unfollow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.should.have.property('data').eql(ERROR_NOT_FOLLOWING_USER().toJSON());
		});
		
	});

});