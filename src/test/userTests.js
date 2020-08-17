
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED, ERROR_CANNOT_FOLLOW_SELF, ERROR_ALREADY_FOLLOWING_USER, ERROR_NOT_FOLLOWING_USER } = require('../constants/errors');
const { organisationData, userCredentials, secondUserCredentials } = require('./templateData');
let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');

chai.use(chaiHttp);
let should = chai.should();


describe('Users', function () {
	before(async ()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});      
		
		let createOrgRes = await chai.request(server).post('/organisation/create').send(organisationData);
		createOrgRes.should.have.status(200);


	});
	after(()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});      
	});


	let token = null;
	let userData = null;

	describe('Valid signup', function () {			
		it('should reject invalid username ', async () => {			
			let res = await chai.request(server).post('/user/create').send({...userCredentials, username: '__usead.1!'});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_INVALID_PARAM('username'));
		});
		it('should reject invalid email ', async () => {			
			let res = await chai.request(server).post('/user/create').send({...userCredentials, email: 'kyzelliot@@gmail.com'});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_INVALID_PARAM('email'));
		});
		it('should create a new user ', async () => {			
			let res = await chai.request(server).post('/user/create').send(userCredentials);
			res.should.have.status(200);
			res.body.data.should.have.property('username').eql(userCredentials.username);
			res.body.data.should.have.property('fullName').eql(userCredentials.fullName);
			res.body.data.should.have.property('email').eql(userCredentials.email);
			res.body.data.should.not.have.property('password');
			res.body.data.should.not.have.property('passwordSalt');
			
			//create second user
			await chai.request(server).post('/user/create').send(secondUserCredentials);
		});
		it('should not allow duplicate username', async () => {
			let res = await chai.request(server).post('/user/create').send({...userCredentials, email: 'abcedf@gmail.com'});
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_USERNAME_TAKEN);
		});
		it('should not overlap organisation handle', async () => {
			let res = await chai.request(server).post('/user/create').send({...userCredentials, username: organisationData.handle});
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_USERNAME_TAKEN);
		});
		it('should not allow duplicate email', async () => {
			let res = await chai.request(server).post('/user/create').send({...userCredentials, username: 'abcdefg' });
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_EMAIL_TAKEN);
		});		
	});

	describe('Auth', ()=>{
		it('should reject login with wrong password', async () => {
			let res = await chai.request(server).post('/user/login').send({username: userCredentials.username, password: '54321'});
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_LOGIN_FAILED);				
		});
		it('should reject login with wrong username', async () => {
			let res = await chai.request(server).post('/user/login').send({username: 'asdfghjk', password: userCredentials.password});
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_LOGIN_FAILED);				
		});
		
		it('should login with correct credentials and generate jwt', async () => {
			let res = await chai.request(server).post('/user/login').send({username: userCredentials.username, password: userCredentials.password});
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
			
		});
		it('should reject unauthenticated get', async () => {
			let res = await chai.request(server).get(`/user/${userData._id}`).send();
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_MISSING_TOKEN);
		});
		it('should reject invalid token', async () => {
			let res = await chai.request(server).get(`/user/${userData._id}`).set('authorization', `Bearer SomeOtherTokenValue`).send();
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_INVALID_TOKEN);
		});
		it('should accept valid token', async () => {
			let res = await chai.request(server).get(`/user/${userData._id}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.should.have.property('data');			
		});
	});

	describe('User Profile', ()=>{
		it('should get user data by username', async () => {
			let res = await chai.request(server).get(`/user/${userCredentials.username}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.be.like({username: userCredentials.username, email: userCredentials.email});
		});
		it('should get user data by id', async () => {
			let res = await chai.request(server).get(`/user/${userData._id}`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.be.like({username: userCredentials.username, email: userCredentials.email});
		});
		it('should only allow friends to get user data', async () => {
			throw 'to implement'
		});
	});
	
	describe('Follow Users', ()=>{
		it('should follow user', async () => {
			let res = await chai.request(server).post(`/user/${secondUserCredentials.username}/follow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
		});
		it('should check is following', async () => {
			let res = await chai.request(server).get(`/user/${secondUserCredentials.username}/isFollowing`).set('authorization', `Bearer ${token}`).send();			
			res.should.have.status(200);
			res.body.data.should.eql(true);
			
			let ownselfRes = await chai.request(server).get(`/user/${userCredentials.username}/isFollowing`).set('authorization', `Bearer ${token}`).send();			
			ownselfRes.should.have.status(200);
			ownselfRes.body.data.should.eql(false);
		});
		it('should be ok to follow twice with error', async () => {
			let res = await chai.request(server).post(`/user/${secondUserCredentials.username}/follow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.should.have.property('data').eql(ERROR_ALREADY_FOLLOWING_USER);
		});
		it('should get followers and following', async () => {
			throw 'to implement'
			// let res = await chai.request(server).get(`/user/${userCredentials.username}`).set('authorization', `Bearer ${token}`).send();
			// res.should.have.status(200);
			// res.body.data.should.be.like({username: userCredentials.username, email: userCredentials.email});
		});
		it('should not allow to follow ownself', async () => {
			let res = await chai.request(server).post(`/user/${userCredentials.username}/follow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(403);
			res.body.should.have.property('error').eql(ERROR_CANNOT_FOLLOW_SELF);
		});		
		it('should unfollow', async () => {
			let res = await chai.request(server).post(`/user/${secondUserCredentials.username}/unfollow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			
			let isFollowingRes = await chai.request(server).get(`/user/${userCredentials.username}/isFollowing`).set('authorization', `Bearer ${token}`).send();			
			isFollowingRes.should.have.status(200);
			isFollowingRes.body.data.should.eql(false);
		});
		it('unfollow twice should be fine', async () => {
			let res = await chai.request(server).post(`/user/${secondUserCredentials.username}/unfollow`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.should.have.property('data').eql(ERROR_NOT_FOLLOWING_USER);
		});
		
	});

});