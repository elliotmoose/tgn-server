
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED } = require('../constants/errors');
let User = mongoose.model('user');
// let User = require('../models/user.model');

chai.use(chaiHttp);
let should = chai.should();

User.deleteMany({}, ()=>{

});      

describe('Signup', function () {
	let templateCredentials = {
		username: "mooselliot",
		firstName: "Elliot",
		lastName: "Koh",
		email: "kyzelliot@gmail.com",
		password: "12345"
	}

	describe('Valid signup', function () {			
		it('should reject invalid username ', async () => {			
			let res = await chai.request(server).post('/user/create').send({...templateCredentials, username: '__usead.1!'});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_INVALID_PARAM('username'));
		});
		it('should reject invalid email ', async () => {			
			let res = await chai.request(server).post('/user/create').send({...templateCredentials, email: 'kyzelliot@@gmail.com'});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_INVALID_PARAM('email'));
		});
		it('should create a new user ', async () => {
			let res = await chai.request(server).post('/user/create').send(templateCredentials);
			res.should.have.status(200);
			res.body.data.should.have.property('username').eql(templateCredentials.username);
			res.body.data.should.have.property('firstName').eql(templateCredentials.firstName);
			res.body.data.should.have.property('lastName').eql(templateCredentials.lastName);
			res.body.data.should.have.property('email').eql(templateCredentials.email);
			res.body.data.should.not.have.property('password');
		});
		it('should not allow duplicate username', async () => {
			let res = await chai.request(server).post('/user/create').send({...templateCredentials, email: 'abcedf@gmail.com'});
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_USERNAME_TAKEN);
			});
		it('should not allow duplicate email', async () => {
			let res = await chai.request(server).post('/user/create').send({...templateCredentials, username: 'abcdefg' });
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_EMAIL_TAKEN);
		});		
	});

	describe('Auth', ()=>{
		it('should reject wrong password', async () => {
			let res = await chai.request(server).post('/user/login').send({username: templateCredentials.username, password: '54321'});
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_LOGIN_FAILED);				
		});
		it('should reject wrong username', async () => {
			let res = await chai.request(server).post('/user/login').send({username: 'asdfghjk', password: templateCredentials.password});
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_LOGIN_FAILED);				
		});

		let token = null;
		let userData = null;
		it('should accept correct credentials and generate jwt', async () => {
			let res = await chai.request(server).post('/user/login').send({username: templateCredentials.username, password: templateCredentials.password});
			res.should.have.status(200);
			res.body.should.have.property('data');			
			res.body.data.should.have.all.keys('token', 'user');						
			token = res.body.data.token;
			token.should.not.be.empty;
			userData = res.body.data.user;			
		});
		// it('should check for authenticated query', async () => {
		// 	let res = await chai.request(server).post('/user/').set('authorization', `Bearer ${token}`).send({username: templateCredentials.username, password: templateCredentials.password});
		// 	res.should.have.status(200);
		// 	res.body.should.have.property('data');
			
		// 	//TODO: check jwt
		// });
	});

});