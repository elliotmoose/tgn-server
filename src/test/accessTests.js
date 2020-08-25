
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let chailike = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED, ERROR_NOT_FOLLOWING_USER } = require('../constants/errors');
const { secondOrganisationTemplateData, organisationTemplateData, userCredentials, postTemplateData, commentTemplateData, secondUserCredentials, thirdUserCredentials } = require('./templateData');

let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');
let Post = mongoose.model('post');

chai.use(chaiHttp);
chai.use(chailike);
let should = chai.should();

let users = {};
let organisations = {};
let posts = {};

const createUserAndLogin = async function(credentials) {
    let createUserRes = await chai.request(server).post('/users/').send(credentials);
    createUserRes.should.have.status(200);

    let loginRes = await chai.request(server).post('/users/login').send({username: credentials.username, password: credentials.password});
    loginRes.should.have.status(200);
    
    let token = loginRes.body.data.token;
    let userData = loginRes.body.data.user;
    userData.token = token;
    return userData;
}

const createOrganisation = async function (credentials) {
    let createOrgRes = await chai.request(server).post('/organisations/').send(credentials);
    createOrgRes.should.have.status(200);
    return createOrgRes.body.data;
}

const makeTargetedPost = async function (targetOrg, user) {
    let userPublicStatus = user.public ? 'public' : 'private';
    let orgPublicStatus = targetOrg.public ? 'public' : 'private';

    let makePostRes = await chai.request(server).post(`/posts/`).set('authorization', `Bearer ${user.token}`).send({
        content: `Post created by ${user.username} (${userPublicStatus}) with target ${targetOrg.handle} (${orgPublicStatus})`,
        postType: 'testimony',
        target: targetOrg._id
    });
    makePostRes.should.have.status(200);
    return makePostRes.body.data;
}

const makeUntargetedPost = async function (user) {
    let userPublicStatus = user.public ? 'public' : 'private';

    let makePostRes = await chai.request(server).post(`/posts/`).set('authorization', `Bearer ${user.token}`).send({
        content: `Post created by ${user.username} (${userPublicStatus}) with no target`,
        postType: 'testimony',
    });
    makePostRes.should.have.status(200);
    return makePostRes.body.data;
}

const getPostResAsUser = async function (postId, user) {
    let postRes = await chai.request(server).get(`/posts/${postId}`).set('authorization', `Bearer ${user.token}`).send();
    return postRes;
}

const updateUser = async function (userKey, userData) {
    let user = users[userKey];
    let updateUserRes = await chai.request(server).put(`/users/${user._id}`).set('authorization', `Bearer ${user.token}`).send(userData);
    updateUserRes.should.have.status(200);
    users[userKey] = {...user, ...updateUserRes.body.data};
}

const joinOrg = async function (user, org) {
    let joinRes = await chai.request(server).post(`/organisations/${org._id}/userJoin`).set('authorization', `Bearer ${user.token}`).send();
    joinRes.should.have.status(200);
}

const leaveOrg = async function (user, org) {
    let leaveRes = await chai.request(server).post(`/organisations/${org._id}/userLeave`).set('authorization', `Bearer ${user.token}`).send();
    leaveRes.should.have.status(200);
}

describe('Access Control', function () {
	before(async ()=>{
		await Organisation.deleteMany({});      
        await User.deleteMany({});      
        await Post.deleteMany({});      
  
        organisations.public = await createOrganisation(organisationTemplateData);
        organisations.private = await createOrganisation(secondOrganisationTemplateData);

        users.private = await createUserAndLogin(userCredentials);
        users.public = await createUserAndLogin(secondUserCredentials); //public
        users.viewer = await createUserAndLogin(thirdUserCredentials);

        updateUser('public', {public: true});
    });
    
	after(()=>{
		Organisation.deleteMany({});      
        User.deleteMany({});      
        Post.deleteMany({});      
    });
    
    beforeEach(()=> {
        Post.deleteMany({});      
    })

	describe('Access to User Profiles', function () {			
        it('should allow PRIVATE user to access own profile', async () => {			
            let res = await chai.request(server).get(`/users/${users.private._id}`).set('authorization', `Bearer ${users.private.token}`).send();
            res.should.have.status(200);
		});
        it('should allow ANY user to access PUBLIC user profile', async () => {			
            let res = await chai.request(server).get(`/users/${users.public._id}`).set('authorization', `Bearer ${users.public.token}`).send();
            res.should.have.status(200);			
            
            res = await chai.request(server).get(`/users/${users.public._id}`).set('authorization', `Bearer ${users.private.token}`).send();
            res.should.have.status(200);			
		});
        it('should NOT allow ANY user to access PRIVATE user profile', async () => {			
            let res = await chai.request(server).get(`/users/${users.private._id}`).set('authorization', `Bearer ${users.public.token}`).send();
            res.should.have.status(ERROR_NOT_FOLLOWING_USER.status);			
            res.body.should.have.property('error').eql(ERROR_NOT_FOLLOWING_USER);			
		});
	});
    
    describe('Access to Posts', function () {			
        describe('Profile Posts', function () {			        
                  
        })
        describe('Individual Posts', function () {			
            it('should allow: private poster • public org • viewer non member • non follower', async () => {			
                let post = await makeTargetedPost(organisations.public, users.private);
                let postRes = await getPostResAsUser(post._id, users.viewer);
                postRes.should.have.status(200);
            });        
            it('should allow: private poster • private org • viewer member • non follower', async () => {		                	
                joinOrg(users.viewer, organisations.private);
                let privateUserPost = await makeTargetedPost(organisations.private, users.private);
                let publicUserPost = await makeTargetedPost(organisations.private, users.public);
                
                let privatePostRes = await getPostResAsUser(privateUserPost._id, users.viewer);
                let publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                privatePostRes.should.have.status(200);
                publicPostRes.should.have.status(200);
                
                leaveOrg(users.viewer, organisations.private);
            });        
            it('should not allow: public poster • private org • viewer non member', async () => {			
                let publicUserPost = await makeTargetedPost(organisations.private, users.public);                
                let publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                publicPostRes.should.have.status(ERROR_NOT_AUTHORISED.status);
            });        
        })
        // describe('Organisation Wall', function () {			
        //     describe('Private Organisation: Targeted Posts', function () {			
        //         it('should not allow non-member to view posts', async () => {			
        
        //         });                                    
        //         it('should allow MEMBERS to view posts by PUBLIC members with target == organisation', async () => {			
        
        //         });                                                                                        
        //         it('should allow MEMBERS to view posts by PRIVATE members with target == organisation', async () => {			
        
        //         });                                                                                        
        //     })            
        //     describe('Public Organisation', function () {			
                
        //     })            
        // })
        // describe('Feed Posts', function () {			
        //     it('should allow MEMBERS to view posts by PUBLIC member with target != organisation', async () => {			
                    
        //     });                                    
        //     it('should not allow MEMBERS to view posts by PRIVATE member with target != organisation UNLESS following PRIVATE member', async () => {			
            
        //     });
        // })        
	});
});
