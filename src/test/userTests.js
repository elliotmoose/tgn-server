
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED } = require('../constants/errors');
const { organisationData, userCredentials } = require('./templateData');
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

});