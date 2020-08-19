
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
  
		let createOrgRes = await chai.request(server).post('/organisations/create').send(organisationTemplateData);
		createOrgRes.should.have.status(200);
		organisationData = createOrgRes.body.data;
		
		let createUserRes = await chai.request(server).post('/users/create').send(userCredentials);
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

	describe('Feed', function() {
		it('should get feed with pagination', async () => {
			
			//second user
			let createUserRes = await chai.request(server).post('/users/create').send(secondUserCredentials);
			createUserRes.should.have.status(200);
	
			let loginRes = await chai.request(server).post('/users/login').send({username: secondUserCredentials.username, password: secondUserCredentials.password});
			loginRes.should.have.status(200);

			let secondUserToken = loginRes.body.data.token;

			//follow
			let followRes = await chai.request(server).post(`/users/${secondUserCredentials.username}/follow`).set('authorization', `Bearer ${token}`).send();

			//make posts	
			for(let i=0;i<5;i++)
			{
                await chai.request(server).post(`/posst`).set('authorization', `Bearer ${secondUserToken}`).send({...postTemplateData, content: `POST ${i}`});
            }

			let posts = await Post.find({user: {$in: [createUserRes.body.data._id]}})
			.skip(0)
			.sort('-datePosted')
            .limit(1)

			console.log(posts.map(post => post.content));
			// console.log(posts);

			for(let i=0;i<5;i++)
			{
				let res = await chai.request(server).get(`/feed?page=${i}&limit=1`).set('authorization', `Bearer ${token}`).send();
				res.should.have.status(200);
				console.log(res.body.data[0].content);
				res.body.data[0].content.should.eql(`POST ${4-i}`);
			}
		});
	})
	
});


