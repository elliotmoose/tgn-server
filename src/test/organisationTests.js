
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED, ERROR_MISSING_PARAM, ERROR_ORG_HANDLE_TAKEN } = require('../constants/errors');
let Organisation = mongoose.model('organisation');
let User = mongoose.model('user');

chai.use(chaiHttp);
let should = chai.should();



describe('Organisation', function () {
	before(()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});      
	});
	after(()=>{
		Organisation.deleteMany({}, ()=>{});      
		User.deleteMany({}, ()=>{});      
	});
	let organisationData = {
		handle: "organisationA",
		name: "Organisation A",
		contact: "64001234",
	}

	let userCredentials = {
		username: "mooselliot",
		firstName: "Elliot",
		lastName: "Koh",
		email: "kyzelliot@gmail.com",
		password: "12345"
	}

	let token = null;
	let userData = null;
	let orgData = null;

	describe('Create Organisation', function () {			
		it('should reject invalid handle', async () => {			
			let res = await chai.request(server).post('/organisation/create').send({...organisationData, handle: '__usead.1!'});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_INVALID_PARAM('handle'));
		});
		it('should reject incomplete details', async () => {			
			let res = await chai.request(server).post('/organisation/create').send({...organisationData, name: undefined});
			res.should.have.status(400);
			res.body.should.have.property('error').eql(ERROR_MISSING_PARAM);
		});
		// it('should reject non super user', async () => {			
		// 	let res = await chai.request(server).post('/organisation/create').send(organisationData);
		// 	res.should.have.status(200);
		// 	res.body.should.have.property('data');
		// 	res.body.data.should.have.property('handle');
		// 	res.body.data.should.have.property('name');
		// 	res.body.data.should.have.property('contact');
		// });
		it('should create org', async () => {			
			let res = await chai.request(server).post('/organisation/create').send(organisationData);
			res.should.have.status(200);
			res.body.should.have.property('data');
			res.body.data.should.have.property('handle');
			res.body.data.should.have.property('name');
			res.body.data.should.have.property('contact');
		});
		it('should reject taken handle by org', async () => {			
			let res = await chai.request(server).post('/organisation/create').send(organisationData);
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_ORG_HANDLE_TAKEN);
		});
		it('should reject taken handle by username', async () => {			
			let createUserRes = await chai.request(server).post('/user/create').send(userCredentials);
			createUserRes.should.have.status(200);

			let res = await chai.request(server).post('/organisation/create').send({...organisationData, handle: userCredentials.username});
			res.should.have.status(409);
			res.body.should.have.property('error').eql(ERROR_ORG_HANDLE_TAKEN);
		});
	});

	// describe('Creating organisation', () =>  {
	// 	it('should assert required parameters', async ()=>{
			
	// 	});
	// 	it('should create organisation', async ()=>{

	// 	});
	// })

	// describe('Joining organisation', ()=>{
		

	// 	it('should accept request from owner user', async()=>{
	// 		let res = await chai.request(server).post(`/organisation/${orgData._id}/userJoin/`).set('authorization', `Bearer ${token}`).send();
	// 		res.should.have.status(200);
	// 	});
	// });

});