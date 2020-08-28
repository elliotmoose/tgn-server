import { ERROR_NOT_AUTHORISED } from "../constants/errors";
import { organisationTemplateData, secondOrganisationTemplateData, userCredentials, secondUserCredentials, thirdUserCredentials } from "./templateData";

let chai = require('chai');
let chaiHttp = require('chai-http');
let chailike = require('chai-like');
let mongoose = require('mongoose');
let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');
let Post = mongoose.model('post');
let Comment = mongoose.model('comment');

let server;
export let users = {};
export let organisations = {};

export const initTestHelper = async function (initServer) { 
    server = initServer;
    await Organisation.deleteMany({});      
    await User.deleteMany({});      
    await Post.deleteMany({});      
    await Comment.deleteMany({});      

    organisations.public = await createOrganisation(organisationTemplateData);
    organisations.private = await createOrganisation(secondOrganisationTemplateData);

    users.private = await createUserAndLogin(userCredentials);
    users.public = await createUserAndLogin(secondUserCredentials); //public
    users.viewer = await createUserAndLogin(thirdUserCredentials);

    updateUser('public', {public: true});
}
export const createUserAndLogin = async function(credentials) {
    let createUserRes = await chai.request(server).post('/users/').send(credentials);
    createUserRes.should.have.status(200);

    let loginRes = await chai.request(server).post('/users/login').send({username: credentials.username, password: credentials.password});
    loginRes.should.have.status(200);
    
    let token = loginRes.body.data.token;
    let userData = loginRes.body.data.user;
    userData.token = token;
    return userData;
}

export const createOrganisation = async function (credentials) {
    let createOrgRes = await chai.request(server).post('/organisations/').send(credentials);
    createOrgRes.should.have.status(200);
    return createOrgRes.body.data;
}

export const makeTargetedPost = async function (targetOrg, user) {
    // await joinOrgAs(user, targetOrg);
    let userPublicStatus = user.public ? 'public' : 'private';
    let orgPublicStatus = targetOrg.public ? 'public' : 'private';
    
    let makePostRes = await chai.request(server).post(`/posts/`).set('authorization', `Bearer ${user.token}`).send({
        content: `Post created by ${user.username} (${userPublicStatus}) with target ${targetOrg.handle} (${orgPublicStatus})`,
        postType: 'testimony',
        target: targetOrg._id
    });
    makePostRes.should.have.status(200);
    // await leaveOrgAs(user, targetOrg);
    return makePostRes.body.data;
}

export const makeUntargetedPost = async function (user) {
    let userPublicStatus = user.public ? 'public' : 'private';
    
    let makePostRes = await chai.request(server).post(`/posts/`).set('authorization', `Bearer ${user.token}`).send({
        content: `Post created by ${user.username} (${userPublicStatus}) with no target`,
        postType: 'testimony',
    });
    makePostRes.should.have.status(200);
    return makePostRes.body.data;
}

export const getPostResAsUser = async function (postId, user) {
    let postRes = await chai.request(server).get(`/posts/${postId}`).set('authorization', `Bearer ${user.token}`).send();
    return postRes;
}

export const getFeedAsUser = async function (user) {
    let feedRes = await chai.request(server).get(`/feed/`).set('authorization', `Bearer ${user.token}`).send();
    feedRes.should.have.status(200);
    return feedRes.body.data;
}

export const updateUser = async function (userKey, userData) {
    let user = users[userKey];
    let updateUserRes = await chai.request(server).put(`/users/${user._id}`).set('authorization', `Bearer ${user.token}`).send(userData);
    updateUserRes.should.have.status(200);
    users[userKey] = {...user, ...updateUserRes.body.data};
}

export const joinOrgAs = async function (user, org) {
    let joinRes = await chai.request(server).post(`/organisations/${org._id}/userJoin`).set('authorization', `Bearer ${user.token}`).send();
    if(joinRes.body.error) {
        console.log(joinRes.body.error)
    }
    joinRes.should.have.status(200);
}

export const leaveOrgAs = async function (user, org) {
    let leaveRes = await chai.request(server).post(`/organisations/${org._id}/userLeave`).set('authorization', `Bearer ${user.token}`).send();
    leaveRes.should.have.status(200);
}

export const followAs = async function (user, toFollow) {
    let followRes = await chai.request(server).post(`/users/${toFollow._id}/follow`).set('authorization', `Bearer ${user.token}`).send();
    followRes.should.have.status(200);
}

export const unfollowAs = async function (user, toUnfollow) {
    let unfollowRes = await chai.request(server).post(`/users/${toUnfollow._id}/unfollow`).set('authorization', `Bearer ${user.token}`).send();
    unfollowRes.should.have.status(200);
}

export const getWallAs = async function (viewer, user) {
    let getWallRes = await chai.request(server).get(`/users/${user._id}/posts`).set('authorization', `Bearer ${viewer.token}`).send();
    if(getWallRes.body.error) {
        console.log(getWallRes.body.error)
    }
    getWallRes.should.have.status(200);  
    return getWallRes.body.data;
}
export const getWallShouldFail = async function (viewer, user) {
    let getWallRes = await chai.request(server).get(`/users/${user._id}/posts`).set('authorization', `Bearer ${viewer.token}`).send();
    getWallRes.should.have.status(ERROR_NOT_AUTHORISED.status);  
    getWallRes.body.error.should.eql(ERROR_NOT_AUTHORISED);  
}

export const reactToPostAs = async function (user, postId) {
    let reactRes = await chai.request(server).post(`/posts/${postId}/react`).set('authorization', `Bearer ${user.token}`).send({reactionType: 'love'});               
    reactRes.should.have.status(200);
}