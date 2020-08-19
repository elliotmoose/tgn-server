
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let like = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED, ERROR_MISSING_PARAM, ERROR_ORG_HANDLE_TAKEN, ERROR_ORG_NOT_FOUND, ERROR_ALREADY_JOINED_ORG } = require('../constants/errors');
let Organisation = mongoose.model('organisation');
let User = mongoose.model('user');

chai.use(chaiHttp);
chai.use(like);
let should = chai.should();

let userCredentials = {
	username: "mooselliot",
	fullName: "Elliot Koh",
	email: "kyzelliot@gmail.com",
	password: "12345"
}

let organisationData = {
	handle: "organisationA",
	name: "Organisation A",
	contact: "64001234",
}	


describe('Organisation', function () {
	
	let token = null;
	let userData = null;
	let orgData = null;

	before(async ()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});      

		//creates a test user for other tests
		let createUserRes = await chai.request(server).post('/users/create').send(userCredentials);
		createUserRes.should.have.status(200);
		
		let loginUserRes = await chai.request(server).post('/users/login').send(userCredentials);
		loginUserRes.should.have.status(200);
		userData = loginUserRes.body.data.user;
		token = loginUserRes.body.data.token;
	});

	after(()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});      
	});

	describe('Create Organisation', function () {			
		it('should reject invalid handle', async () => {			
			let res = await chai.request(server).post('/organisations/create').send({...organisationData, handle: '__usead.1!'});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_INVALID_PARAM('handle'));
		});
		it('should reject incomplete details', async () => {			
			let res = await chai.request(server).post('/organisations/create').send({...organisationData, name: undefined});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_MISSING_PARAM);
		});
		// it('should reject non super user', async () => {			
		// 	let res = await chai.request(server).post('/organisations/create').send(organisationData);
		// 	res.should.have.status(200);
		// 	res.body.should.have.property('data');
		// 	res.body.data.should.have.property('handle');
		// 	res.body.data.should.have.property('name');
		// 	res.body.data.should.have.property('contact');
		// });
		it('should create org', async () => {			
			let res = await chai.request(server).post('/organisations/create').send(organisationData);
			res.should.have.status(200);
			res.body.should.have.property('data');
			res.body.data.should.have.property('handle').eql(organisationData.handle);
			res.body.data.should.have.property('name').eql(organisationData.name);
			res.body.data.should.have.property('contact').eql(organisationData.contact);			
			
			orgData = res.body.data;
			
			let getRes = await chai.request(server).get(`/organisations/${res.body.data.handle}`).send();
			getRes.should.have.status(200);
			getRes.body.should.have.property('data');
			getRes.body.data.should.have.property('handle').eql(organisationData.handle);
			getRes.body.data.should.have.property('name').eql(organisationData.name);
			getRes.body.data.should.have.property('contact').eql(organisationData.contact);
		});
		it('should reject taken handle by org', async () => {			
			let res = await chai.request(server).post('/organisations/create').send(organisationData);
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_ORG_HANDLE_TAKEN);
		});
		it('should reject taken handle by username', async () => {						
			let res = await chai.request(server).post('/organisations/create').send({...organisationData, handle: userCredentials.username});
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_ORG_HANDLE_TAKEN);
		});
	});

	describe('Get Organisation', function() {
		it('should get org by handle', async () => {
			let getRes = await chai.request(server).get(`/organisations/${orgData.handle}`).send();
			getRes.should.have.status(200);
			getRes.body.should.have.property('data');
			getRes.body.data.should.have.property('handle').eql(organisationData.handle);
			getRes.body.data.should.have.property('name').eql(organisationData.name);
			getRes.body.data.should.have.property('contact').eql(organisationData.contact);
		});
		it('should get org by id', async () => {
			let getRes = await chai.request(server).get(`/organisations/${orgData._id}`).send();
			getRes.should.have.status(200);
			getRes.body.should.have.property('data');
			getRes.body.data.should.have.property('handle').eql(organisationData.handle);
			getRes.body.data.should.have.property('name').eql(organisationData.name);
			getRes.body.data.should.have.property('contact').eql(organisationData.contact);
		});
		it('should handle invalid id', async () => {
			let getRes = await chai.request(server).get(`/organisations/${orgData._id}x`).send();
			getRes.should.have.status(404);
			getRes.body.should.have.property('error').eql(ERROR_ORG_NOT_FOUND);
		});
	});

	describe('Join or Leave Organisation', ()=>{	
		it('should join by org id and return userData', async ()=>{
			let res = await chai.request(server).post(`/organisations/${orgData._id}/userJoin/`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.should.have.property('data');
			res.body.data.should.have.property('username').eql(userData.username);
			res.body.data.should.not.have.property('password');
			
			let getUserRes = await chai.request(server).get(`/users/${userData._id}`).set('authorization', `Bearer ${token}`).send();
			getUserRes.should.have.status(200);
			getUserRes.body.should.have.property('data');
			getUserRes.body.data.should.have.property('organisationIds');
			getUserRes.body.data.organisationIds.should.contain(orgData._id);
		});
		it('shoud leave org by handle or id', async ()=> {
			let res = await chai.request(server).post(`/organisations/${orgData._id}/userLeave/`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.should.have.property('data');
			res.body.data.should.have.property('username').eql(userData.username);
			res.body.data.should.not.have.property('password');
			
			let getUserRes = await chai.request(server).get(`/users/${userData._id}`).set('authorization', `Bearer ${token}`).send();
			getUserRes.should.have.status(200);
			getUserRes.body.should.have.property('data');
			getUserRes.body.data.should.have.property('organisationIds');
			getUserRes.body.data.organisationIds.should.not.contain(orgData._id);
		});
		it('should join by org handle and return userData', async ()=>{
			let res = await chai.request(server).post(`/organisations/${orgData.handle}/userJoin/`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.should.have.property('data');
			res.body.data.should.have.property('username').eql(userData.username);
			res.body.data.should.not.have.property('password');
			
			let getUserRes = await chai.request(server).get(`/users/${userData._id}`).set('authorization', `Bearer ${token}`).send();
			getUserRes.should.have.status(200);
			getUserRes.body.should.have.property('data');
			getUserRes.body.data.should.have.property('organisationIds');
			getUserRes.body.data.organisationIds.should.contain(orgData._id);
		});
		it('should reject joining twice', async ()=>{
			let res = await chai.request(server).post(`/organisations/${orgData.handle}/userJoin/`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_ALREADY_JOINED_ORG);
		});
		it('should handle invalid org id', async ()=>{
			let res = await chai.request(server).post(`/organisations/${orgData._id}x/userJoin/`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(404);
			res.body.should.have.property('error').eql(ERROR_ORG_NOT_FOUND);
		});
		it('should require user token', async ()=>{
			let res = await chai.request(server).post(`/organisations/${orgData._id}/userJoin/`).send();
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_MISSING_TOKEN);
		});
	});
	
	describe('Organisation Members', () => {
		it('should require token', async () => {
			let res = await chai.request(server).get(`/organisations/${orgData._id}/members/`).send();			
			res.should.have.status(401);
			res.body.should.have.property('error').eql(ERROR_MISSING_TOKEN);
		})
		it('should get all members by org id', async () => {
			let res = await chai.request(server).get(`/organisations/${orgData._id}/members/`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.have.lengthOf.at.least(1);
			res.body.data[0].should.have.property('username', userData.username);
			res.body.data[0].should.have.property('email', userData.email);
			res.body.data[0].should.not.have.property('password');
		})
		it('should get all members by org handle', async () => {
			let getUserRes = await chai.request(server).get(`/users/${userData.username}`).set('authorization', `Bearer ${token}`).send();
			userData = getUserRes.body.data;
			let res = await chai.request(server).get(`/organisations/${orgData.handle}/members/`).set('authorization', `Bearer ${token}`).send();
			res.should.have.status(200);
			res.body.data.should.be.like([userData]);
		})
		it('should handle invalid org id', async () => {
			let res = await chai.request(server).get(`/organisations/${orgData.handle}x/members/`).set('authorization', `Bearer ${token}`).send();			
			res.should.have.status(404);
			res.body.should.have.property('error').eql(ERROR_ORG_NOT_FOUND);
		})
	});
});