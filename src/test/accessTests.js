
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let chailike = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_INVALID_PARAM, ERROR_LOGIN_FAILED, ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED, ERROR_NOT_FOLLOWING_USER } = require('../constants/errors');
const { secondOrganisationTemplateData, organisationTemplateData, userCredentials, postTemplateData, commentTemplateData, secondUserCredentials, thirdUserCredentials } = require('./templateData');
const { post } = require('../server');

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

const getFeedAsUser = async function (user) {
    let feedRes = await chai.request(server).get(`/feed/`).set('authorization', `Bearer ${user.token}`).send();
    feedRes.should.have.status(200);
    return feedRes.body.data;
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

const follow = async function (user, toFollow) {
    let followRes = await chai.request(server).post(`/users/${toFollow._id}/follow`).set('authorization', `Bearer ${user.token}`).send();
    followRes.should.have.status(200);
}

const unfollow = async function (user, toUnfollow) {
    let unfollowRes = await chai.request(server).post(`/users/${toUnfollow._id}/unfollow`).set('authorization', `Bearer ${user.token}`).send();
    unfollowRes.should.have.status(200);
}

const getWallAs = async function (viewer, user) {
    let getWallRes = await chai.request(server).get(`/users/${user._id}/posts`).set('authorization', `Bearer ${viewer.token}`).send();

    if(getWallRes.body.error) {
        console.log(getWallRes.body.error)
    }
    getWallRes.should.have.status(200);  
    return getWallRes.body.data;
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
    
	after(async ()=>{
		await Organisation.deleteMany({});      
        await User.deleteMany({});      
        await Post.deleteMany({});      
    });
    
    beforeEach(async ()=> {
        await Post.deleteMany({});      
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
            //emphasis: private org => requires member (NO ACCESS 0)
            it('should not allow: public/private poster • private org • viewer non member • follower/non follower', async () => {			
                let privateUserPost = await makeTargetedPost(organisations.private, users.private);
                let publicUserPost = await makeTargetedPost(organisations.private, users.public);
                
                let privatePostRes = await getPostResAsUser(privateUserPost._id, users.viewer);
                let publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                privatePostRes.body.error.should.eql(ERROR_NOT_AUTHORISED);
                publicPostRes.body.error.should.eql(ERROR_NOT_AUTHORISED);
                
                await follow(users.viewer, users.public);
                await follow(users.viewer, users.private);
                privateUserPost = await makeTargetedPost(organisations.private, users.private);
                publicUserPost = await makeTargetedPost(organisations.private, users.public);
                
                privatePostRes = await getPostResAsUser(privateUserPost._id, users.viewer);
                publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                privatePostRes.body.error.should.eql(ERROR_NOT_AUTHORISED);
                publicPostRes.body.error.should.eql(ERROR_NOT_AUTHORISED);
                await unfollow(users.viewer, users.public);
                await unfollow(users.viewer, users.private);
            });     
            //emphasis: public org => public access (ACCESS 1)
            it('should allow: private poster • public org • viewer non member • follower/non follower', async () => {			
                let post = await makeTargetedPost(organisations.public, users.private);
                let postRes = await getPostResAsUser(post._id, users.viewer);
                postRes.should.have.status(200);
                
                await follow(users.viewer, users.private);
                post = await makeTargetedPost(organisations.public, users.private);
                postRes = await getPostResAsUser(post._id, users.viewer);
                postRes.should.have.status(200);
                await unfollow(users.viewer, users.private);
            });    
            //emphasis: member => access (ACCESS 2)
            it('should allow: public/private poster • private org • viewer member • non follower', async () => {		                	
                await joinOrg(users.viewer, organisations.private);
                let privateUserPost = await makeTargetedPost(organisations.private, users.private);
                let publicUserPost = await makeTargetedPost(organisations.private, users.public);
                
                let privatePostRes = await getPostResAsUser(privateUserPost._id, users.viewer);
                let publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                privatePostRes.should.have.status(200);
                publicPostRes.should.have.status(200);
                
                await leaveOrg(users.viewer, organisations.private);
            });        
            //emphasis: public user no target => access (ACCESS 3)
            it('should allow: public/private poster • private org • viewer member • non follower', async () => {		                	
                await joinOrg(users.viewer, organisations.private);
                let privateUserPost = await makeTargetedPost(organisations.private, users.private);
                let publicUserPost = await makeTargetedPost(organisations.private, users.public);
                
                let privatePostRes = await getPostResAsUser(privateUserPost._id, users.viewer);
                let publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                privatePostRes.should.have.status(200);
                publicPostRes.should.have.status(200);
                
                await leaveOrg(users.viewer, organisations.private);
            });        
            //emphasis: following private no target => access (ACCESS 4)
            it('should allow: private poster • no target • follower', async () => {		                	
                await follow(users.viewer, users.private);
                let post = await makeUntargetedPost(users.private);
                let postRes = await getPostResAsUser(post._id, users.viewer);
                postRes.should.have.status(200);
                await unfollow(users.viewer, users.private);  
            });        
            // emphasis: private => requires follow (NO ACCESS 1)
            it('should not allow: private poster • no target • non follower', async () => {		                	
                let post = await makeUntargetedPost(users.private);
                let postRes = await getPostResAsUser(post._id, users.viewer);
                postRes.should.have.status(ERROR_NOT_AUTHORISED.status);
                postRes.body.error.should.eql(ERROR_NOT_AUTHORISED);
            });        
        })
        // describe('Posts By', function () {			
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
        describe('User Wall', function () {
            //essence: public => no target posts
            it('Should load • no target • public user • follower/non follower • ', async ()=> {
                await makeUntargetedPost(users.public);                    
                let posts = await getWallAs(users.viewer, users.public);
                posts.should.have.lengthOf(1);
            });

            //essence: follower => no target posts
            it('Should load • no target • follower • public/private user ', async ()=> {
                await makeUntargetedPost(users.public);                    
                
                await follow(users.viewer, users.public);
                let posts = await getWallAs(users.viewer, users.public);
                posts.should.have.lengthOf(1);
                await unfollow(users.viewer, users.public);                               
                
                await follow(users.viewer, users.private);
                posts = await getWallAs(users.viewer, users.private);                
                posts.should.have.lengthOf(1);
                await unfollow(users.viewer, users.private);                               
            });

            // //essence: public org only requires follower 
            // it('Should load • private user • follower • public org • member/non member', async ()=> {
            //     await makeTargetedPost(organisations.public, users.private);                    

            //     await follow(users.viewer, users.private);
            //     posts = await getWallAs(users.viewer, users.private);
            //     posts.should.have.lengthOf(1);
            //     await unfollow(users.viewer, users.private);    
            // });

            // it('Should load • public user • not follower • public org', async ()=> {
            //     await makeTargetedPost(organisations.public, users.public);                    
            //     let posts = await getWallAs(users.viewer, users.public);
            //     posts.should.have.lengthOf(1);                
            // });
            
            // //essence: [private org private user] requires [follower AND member]
            // it('Should load • private user • follower • private org • member', async ()=> {
            //     await makeTargetedPost(organisations.private, users.private);

            //     await follow(users.viewer, users.private);
            //     await joinOrg(users.viewer, organisations.private);
            //     let posts = await getWallAs(users.viewer, users.private);
            //     posts.should.have.lengthOf(1);
            //     await leaveOrg(users.viewer, organisations.private);
            //     await unfollow(users.viewer, users.private);
            // });

            // //essence: not follower private using
            // //won't load anything (even tho access is given if same org)
            // it('Should not load • private user • not follower • public/private org • member/non member', async ()=> {
            //     await makeTargetedPost(organisations.public, users.private);
            //     await makeTargetedPost(organisations.private, users.private);

            //     let posts = await getWallAs(users.viewer, users.private);
            //     posts.should.have.lengthOf(0);
            // });

            // //essence: private org requires member
            // it('Should not load • public user • follower • private org • non member', async ()=> {
            //     await makeTargetedPost(organisations.private, users.public);

            //     await follow(users.viewer, users.public);
            //     let posts = await getWallAs(users.viewer, users.public);
            //     posts.should.have.lengthOf(0);
            //     await unfollow(users.viewer, users.public);
            // });

        });
        describe('Organisation Wall', function () {
            it('', async ()=> {

            });
        });

        describe('Feed', function () {			            
            //essence: targeted private post: requires member
            it('should not feed • public/private poster • private org • non member viewer • follower/non follower', async () => {			
                await makeTargetedPost(organisations.private, users.public);
                await makeTargetedPost(organisations.private, users.private);
                let feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(0);

                await follow(users.viewer, users.public);
                feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(0);
                await unfollow(users.viewer, users.public);
            });

            //essence: member: should feed
            it('should feed • public/private poster • public/private org • member viewer • follower/non follower', async () => {			
                await joinOrg(users.viewer, organisations.private);
                await joinOrg(users.viewer, organisations.public);

                await makeTargetedPost(organisations.private, users.public);
                await makeTargetedPost(organisations.private, users.private);
                
                let feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(2);

                await makeTargetedPost(organisations.public, users.public);
                await makeTargetedPost(organisations.public, users.private);                
                
                feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(4);

                await follow(users.viewer, users.public);
                await follow(users.viewer, users.private);
                
                feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(4);

                await unfollow(users.viewer, users.public);
                await unfollow(users.viewer, users.private);

                await leaveOrg(users.viewer, organisations.private);
                await leaveOrg(users.viewer, organisations.public);
            });
            
            //essence: member or follower to feed
            it('should not feed • public poster • public org • non member • non follower', async () => {			                
                await makeTargetedPost(organisations.public, users.public);
                let feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(0);
            });

            // //essence: no target + follower
            it('should feed • public/private poster • no target • follower', async () => {			                
                await makeUntargetedPost(users.private);
                
                await follow(users.viewer, users.private);
                let feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(1);
                await unfollow(users.viewer, users.private);
                
                await makeUntargetedPost(users.public);
                await follow(users.viewer, users.public);
                feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(1);
                await unfollow(users.viewer, users.public);
            });

            it('feed behaviour should match single post behaviour', async () => {                
                // let postUsers = [users.public, users.private];
                let postUsers = ['public', 'private'];
                // let orgOptions = [organisations.public, organisations.private, null]
                let orgOptions = ['public', 'private', null]
                let viewerMemberOptions = [true, false]
                let followingOptions = [true, false]
                let viewer = users.viewer;
                
                for(let i in orgOptions) {
                    let orgOption = orgOptions[i];
                    let org = orgOption ? organisations[orgOption] : null;
                    //if no target                    
                    for(let j in postUsers) {
                        let userOption = postUsers[j];
                        let user = users[userOption];

                        for(let shouldBeFollowing of followingOptions) {
                            
                            if(shouldBeFollowing) {
                                await follow(viewer, user);
                            }

                            if(org === null) { 
                                //cases to ignore: (should have access but should not feed) 
                                //user: public, following: false          
                                if(userOption == 'public' && !shouldBeFollowing) {
                                    continue;
                                }
                                let post = await makeUntargetedPost(user);

                                let feed = await getFeedAsUser(viewer);   
                                let feedValid = feed.length != 0;
                                
                                let postRes = await getPostResAsUser(post._id, viewer);
                                let postValid = (postRes.status == 200);
                                
                                // console.log(`user: ${userOption}, org: ${orgOption}, following: ${shouldBeFollowing}`)
                                // console.log(`feed: ${feedValid} post: ${postValid}`);
                                postValid.should.eql(feedValid);

                                await Post.deleteMany({});
                            }
                            else {                        
                                for(let shouldBeMember of viewerMemberOptions) {
                                    //cases to ignore: (should have access but should not feed) 
                                    //org: public, member: false                                    
                                    if(orgOption == 'public' && !shouldBeMember) {
                                        continue;
                                    }

                                    let post = await makeTargetedPost(org, user);
    
                                    if(shouldBeMember) {
                                        await joinOrg(viewer, org);
                                    }
                                    
                                    let feed = await getFeedAsUser(viewer);   
                                    let feedValid = feed.length != 0;
                                    
                                    let postRes = await getPostResAsUser(post._id, viewer);
                                    let postValid = (postRes.status == 200);
                                                                        
                                    postValid.should.eql(feedValid);
                                    
                                    if(shouldBeMember) {
                                        await leaveOrg(viewer, org);
                                    }

                                    await Post.deleteMany({});
                                }
                            }

                            if(shouldBeFollowing) {
                                await unfollow(viewer, user);
                            }
                        }
                    }
                }
            });

            //TO IMPLEMENT: public org + follower + non member  to feed or not to feed??? current: no feed
            // it('should not feed • public/private poster • public org • non member viewer • follower', async () => {			
            //     // await follow(users.viewer, users.public);
            //     // let post = await makeTargetedPost(organisations.private, users.public);
            //     // let feed = await getFeedAsUser(users.viewer);   
            //     // feed.should.have.lengthOf(0);
            //     // await unfollow(users.viewer, users.public);
            // });
        })        
	});
});
