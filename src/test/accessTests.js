
process.env.NODE_ENV = 'TEST';
let chai = require('chai');
let chaiHttp = require('chai-http');
let chailike = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { ERROR_NOT_AUTHORISED } = require('../constants/errors');
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

const makeTargetedPostAsOutsider = async function (targetOrg, user) {
    await joinOrgAs(user, targetOrg);
    let userPublicStatus = user.public ? 'public' : 'private';
    let orgPublicStatus = targetOrg.public ? 'public' : 'private';
    
    let makePostRes = await chai.request(server).post(`/posts/`).set('authorization', `Bearer ${user.token}`).send({
        content: `Post created by ${user.username} (${userPublicStatus}) with target ${targetOrg.handle} (${orgPublicStatus})`,
        postType: 'testimony',
        target: targetOrg._id
    });
    makePostRes.should.have.status(200);
    await leaveOrgAs(user, targetOrg);
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

const joinOrgAs = async function (user, org) {
    let joinRes = await chai.request(server).post(`/organisations/${org._id}/userJoin`).set('authorization', `Bearer ${user.token}`).send();
    joinRes.should.have.status(200);
}

const leaveOrgAs = async function (user, org) {
    let leaveRes = await chai.request(server).post(`/organisations/${org._id}/userLeave`).set('authorization', `Bearer ${user.token}`).send();
    leaveRes.should.have.status(200);
}

const followAs = async function (user, toFollow) {
    let followRes = await chai.request(server).post(`/users/${toFollow._id}/follow`).set('authorization', `Bearer ${user.token}`).send();
    followRes.should.have.status(200);
}

const unfollowAs = async function (user, toUnfollow) {
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
const getWallShouldFail = async function (viewer, user) {
    let getWallRes = await chai.request(server).get(`/users/${user._id}/posts`).set('authorization', `Bearer ${viewer.token}`).send();
    getWallRes.should.have.status(ERROR_NOT_AUTHORISED().status);  
    getWallRes.body.error.should.eql(ERROR_NOT_AUTHORISED().toJSON());  
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
            res.should.have.status(ERROR_NOT_AUTHORISED().status);			
            res.body.should.have.property('error').eql(ERROR_NOT_AUTHORISED().toJSON());			
		});
	});
    
    describe('Access to Posts', function () {			
        describe('Profile Posts', function () {			        
                  
        })
        describe('Individual Posts', function () {			    
            //emphasis: private org => requires member (NO ACCESS 0)
            it('should not allow: public/private poster • private org • viewer non member • follower/non follower', async () => {			
                let privateUserPost = await makeTargetedPostAsOutsider(organisations.private, users.private);
                let publicUserPost = await makeTargetedPostAsOutsider(organisations.private, users.public);
                
                let privatePostRes = await getPostResAsUser(privateUserPost._id, users.viewer);
                let publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                privatePostRes.body.error.should.eql(ERROR_NOT_AUTHORISED().toJSON());
                publicPostRes.body.error.should.eql(ERROR_NOT_AUTHORISED().toJSON());
                
                await followAs(users.viewer, users.public);
                await followAs(users.viewer, users.private);
                privateUserPost = await makeTargetedPostAsOutsider(organisations.private, users.private);
                publicUserPost = await makeTargetedPostAsOutsider(organisations.private, users.public);
                
                privatePostRes = await getPostResAsUser(privateUserPost._id, users.viewer);
                publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                privatePostRes.body.error.should.eql(ERROR_NOT_AUTHORISED().toJSON());
                publicPostRes.body.error.should.eql(ERROR_NOT_AUTHORISED().toJSON());
                await unfollowAs(users.viewer, users.public);
                await unfollowAs(users.viewer, users.private);
            });     
            //emphasis: public org => public access (ACCESS 1)
            it('should allow: private poster • public org • viewer non member • follower/non follower', async () => {			
                let post = await makeTargetedPostAsOutsider(organisations.public, users.private);
                let postRes = await getPostResAsUser(post._id, users.viewer);
                postRes.should.have.status(200);
                
                await followAs(users.viewer, users.private);
                post = await makeTargetedPostAsOutsider(organisations.public, users.private);
                postRes = await getPostResAsUser(post._id, users.viewer);
                postRes.should.have.status(200);
                await unfollowAs(users.viewer, users.private);
            });    
            //emphasis: member => access (ACCESS 2)
            it('should allow: public/private poster • private org • viewer member • non follower', async () => {		                	
                await joinOrgAs(users.viewer, organisations.private);
                let privateUserPost = await makeTargetedPostAsOutsider(organisations.private, users.private);
                let publicUserPost = await makeTargetedPostAsOutsider(organisations.private, users.public);
                
                let privatePostRes = await getPostResAsUser(privateUserPost._id, users.viewer);
                let publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                privatePostRes.should.have.status(200);
                publicPostRes.should.have.status(200);
                
                await leaveOrgAs(users.viewer, organisations.private);
            });        
            //emphasis: public user no target => access (ACCESS 3)
            it('should allow: public/private poster • private org • viewer member • non follower', async () => {		                	
                await joinOrgAs(users.viewer, organisations.private);
                let privateUserPost = await makeTargetedPostAsOutsider(organisations.private, users.private);
                let publicUserPost = await makeTargetedPostAsOutsider(organisations.private, users.public);
                
                let privatePostRes = await getPostResAsUser(privateUserPost._id, users.viewer);
                let publicPostRes = await getPostResAsUser(publicUserPost._id, users.viewer);
                privatePostRes.should.have.status(200);
                publicPostRes.should.have.status(200);
                
                await leaveOrgAs(users.viewer, organisations.private);
            });        
            //emphasis: following private no target => access (ACCESS 4)
            it('should allow: private poster • no target • follower', async () => {		                	
                await followAs(users.viewer, users.private);
                let post = await makeUntargetedPost(users.private);
                let postRes = await getPostResAsUser(post._id, users.viewer);
                postRes.should.have.status(200);
                await unfollowAs(users.viewer, users.private);  
            });        
            // emphasis: private => requires follow (NO ACCESS 1)
            it('should not allow: private poster • no target • non follower', async () => {		                	
                let post = await makeUntargetedPost(users.private);
                let postRes = await getPostResAsUser(post._id, users.viewer);
                postRes.should.have.status(ERROR_NOT_AUTHORISED().status);
                postRes.body.error.should.eql(ERROR_NOT_AUTHORISED().toJSON());
            });        
        })

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
                await followAs(users.viewer, users.public);
                let posts = await getWallAs(users.viewer, users.public);
                posts.should.have.lengthOf(1);
                await unfollowAs(users.viewer, users.public);                               
                
                await makeUntargetedPost(users.private);                                    
                await followAs(users.viewer, users.private);
                posts = await getWallAs(users.viewer, users.private);                
                posts.should.have.lengthOf(1);
                await unfollowAs(users.viewer, users.private);                               
            });
            
            //essence: follower + member => all posts
            it('Should load • public/private org • follower • member • public/private user', async ()=> {
                await makeTargetedPostAsOutsider(organisations.public, users.public);                                    
                await makeTargetedPostAsOutsider(organisations.private, users.public);                                    
                
                await makeTargetedPostAsOutsider(organisations.public, users.private);                                    
                await makeTargetedPostAsOutsider(organisations.private, users.private);                                    
                
                await joinOrgAs(users.viewer, organisations.public);
                await joinOrgAs(users.viewer, organisations.private);
                
                await followAs(users.viewer, users.public);                
                let posts = await getWallAs(users.viewer, users.public);
                posts.should.have.lengthOf(2);                                                      
                await unfollowAs(users.viewer, users.public);                               
                
                await followAs(users.viewer, users.private);
                posts = await getWallAs(users.viewer, users.private);                
                posts.should.have.lengthOf(2);
                await unfollowAs(users.viewer, users.private);                               
                
                await leaveOrgAs(users.viewer, organisations.public);
                await leaveOrgAs(users.viewer, organisations.private);
            });

            //essence: private org target requires member
            it('Should not load • public user • follower/non follower • private org • non member', async ()=> {
                await makeTargetedPostAsOutsider(organisations.private, users.public);
                
                let posts = await getWallAs(users.viewer, users.public);
                posts.should.have.lengthOf(0);

                await followAs(users.viewer, users.public);
                posts = await getWallAs(users.viewer, users.public);
                posts.should.have.lengthOf(0);
                await unfollowAs(users.viewer, users.public);
            });
            
            //essence: private org target requires member (even though follower of private user)
            it('Should not load • private org • follower • non member • private user', async ()=> {
                await makeTargetedPostAsOutsider(organisations.private, users.private);
                
                await followAs(users.viewer, users.private);
                let posts = await getWallAs(users.viewer, users.private);
                posts.should.have.lengthOf(0);
                await unfollowAs(users.viewer, users.private);
            });

            //essence: non-follower => requires [member + public org + public user]            
            it('Should load • public org • non follower • member • public user', async ()=> {
                await makeTargetedPostAsOutsider(organisations.public, users.public);                                    
                
                await joinOrgAs(users.viewer, organisations.public);                
                let posts = await getWallAs(users.viewer, users.public);                
                posts.should.have.lengthOf(1);                        
                await leaveOrgAs(users.viewer, organisations.public);                
            });
            
            //essence: all public -> will appear
            //NOTE: POSTER MUST STILL BE A MEMBER
            it('Should load • public org • non follower • non member • public user', async ()=> {
                await makeTargetedPostAsOutsider(organisations.public, users.public);                                    
                
                await joinOrgAs(users.public, organisations.public);                
                let posts = await getWallAs(users.viewer, users.public);                
                posts.should.have.lengthOf(1);                        
                await leaveOrgAs(users.public, organisations.public);                
            });
            
            //essence: private org post loads for non follower member (because user public)
            it('Should load • private org • non follower • member • public user', async ()=> {
                await makeTargetedPostAsOutsider(organisations.private, users.public);
                
                await joinOrgAs(users.viewer, organisations.private);
                let posts = await getWallAs(users.viewer, users.public);
                posts.should.have.lengthOf(1);
                await leaveOrgAs(users.viewer, organisations.private);
            });
 
            
            //essence: private org post loads for non follower member (because user public)
            it('Should load • private org • non follower • member • public user', async ()=> {
                await makeTargetedPostAsOutsider(organisations.private, users.public);
                
                await joinOrgAs(users.viewer, organisations.private);
                let posts = await getWallAs(users.viewer, users.public);
                posts.should.have.lengthOf(1);
                await leaveOrgAs(users.viewer, organisations.private);
            });
            
            //essence: not follower private using
            //won't load anything (even tho access is given if same org)
            it('Should throw 401 • private user • not follower • public/private org • member/non member', async ()=> {
                await makeTargetedPostAsOutsider(organisations.public, users.private);
                await makeTargetedPostAsOutsider(organisations.private, users.private);
                await getWallShouldFail(users.viewer, users.private);
            });


            it('Should load all posts if owner', async ()=> {
                await makeTargetedPostAsOutsider(organisations.public, users.private);
                await makeTargetedPostAsOutsider(organisations.private, users.private);
                await makeUntargetedPost(users.private);

                await joinOrgAs(users.private, organisations.public);
                await joinOrgAs(users.private, organisations.private);
                
                let posts = await getWallAs(users.private, users.private);
                posts.should.have.lengthOf(3);
                
                await leaveOrgAs(users.private, organisations.public);
                await leaveOrgAs(users.private, organisations.private);
            });
        });

        describe('Organisation Wall', function () {
            it('', async ()=> {

            });
        });

        describe('Feed', function () {			            
            //essence: targeted private post: requires member
            it('should not feed • public/private poster • private org • non member viewer • follower/non follower', async () => {			
                await makeTargetedPostAsOutsider(organisations.private, users.public);
                await makeTargetedPostAsOutsider(organisations.private, users.private);
                let feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(0);

                await followAs(users.viewer, users.public);
                feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(0);
                await unfollowAs(users.viewer, users.public);
            });

            //essence: member: should feed
            it('should feed • public/private poster • public/private org • member viewer • follower/non follower', async () => {			
                await joinOrgAs(users.viewer, organisations.private);
                await joinOrgAs(users.viewer, organisations.public);

                await makeTargetedPostAsOutsider(organisations.private, users.public);
                await makeTargetedPostAsOutsider(organisations.private, users.private);
                
                let feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(2);

                await makeTargetedPostAsOutsider(organisations.public, users.public);
                await makeTargetedPostAsOutsider(organisations.public, users.private);                
                
                feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(4);

                await followAs(users.viewer, users.public);
                await followAs(users.viewer, users.private);
                
                feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(4);

                await unfollowAs(users.viewer, users.public);
                await unfollowAs(users.viewer, users.private);

                await leaveOrgAs(users.viewer, organisations.private);
                await leaveOrgAs(users.viewer, organisations.public);
            });
            
            //essence: member or follower to feed
            it('should not feed • public poster • public org • non member • non follower', async () => {			                
                await makeTargetedPostAsOutsider(organisations.public, users.public);
                let feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(0);
            });

            // //essence: no target + follower
            it('should feed • public/private poster • no target • follower', async () => {			                
                await makeUntargetedPost(users.private);
                
                await followAs(users.viewer, users.private);
                let feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(1);
                await unfollowAs(users.viewer, users.private);
                
                await makeUntargetedPost(users.public);
                await followAs(users.viewer, users.public);
                feed = await getFeedAsUser(users.viewer);   
                feed.should.have.lengthOf(1);
                await unfollowAs(users.viewer, users.public);
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
                                await followAs(viewer, user);
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

                                    let post = await makeTargetedPostAsOutsider(org, user);
    
                                    if(shouldBeMember) {
                                        await joinOrgAs(viewer, org);
                                    }
                                    
                                    let feed = await getFeedAsUser(viewer);   
                                    let feedValid = feed.length != 0;
                                    
                                    let postRes = await getPostResAsUser(post._id, viewer);
                                    let postValid = (postRes.status == 200);
                                                                        
                                    postValid.should.eql(feedValid);
                                    
                                    if(shouldBeMember) {
                                        await leaveOrgAs(viewer, org);
                                    }

                                    await Post.deleteMany({});
                                }
                            }

                            if(shouldBeFollowing) {
                                await unfollowAs(viewer, user);
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
