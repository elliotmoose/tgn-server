/**
 * USE FOR MOCK DATA IN DEV ENV
 */

require = require('esm')(module);


process.env.NODE_ENV = 'DEV';
let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiLike = require('chai-like');
let server = require('../server');
let mongoose = require('mongoose');
const { initTestHelper, users, organisations, followAs, makeTargetedPost, joinOrgAs, makeUntargetedPost, reactToPostAs, commentOnPostAs } = require('./testHelper');

let User = mongoose.model('user');
let Organisation = mongoose.model('organisation');
let Post = mongoose.model('post');
let Comment = mongoose.model('comment');

chai.use(chaiHttp);
chai.use(chaiLike);
let should = chai.should();

// let token = null;
// let userData = null;

async function main() {

    try {
        await initTestHelper(server);    
                
        scenarioA();
    } catch (error) {
        console.error(error);
    }
}


//can see posts to organisation from users I am not following
async function scenarioA() {
    await followAs(users.public, users.private);
    
    // await followAs(users.viewer, users.public);
    await followAs(users.viewer, users.private);
    
    await joinOrgAs(users.viewer, organisations.private);
    await joinOrgAs(users.viewer, organisations.public);
    let viewerToPublicPost = await makeTargetedPost(organisations.public, users.viewer);
    let viewerToPrivatePost = await makeTargetedPost(organisations.private, users.viewer);
    let viewerUntargetedPost = await makeUntargetedPost(users.viewer);    
    
    await joinOrgAs(users.public, organisations.private);
    await joinOrgAs(users.public, organisations.public);
    let publicToPublicPost = await makeTargetedPost(organisations.public, users.public);
    let publicToPrivatePost = await makeTargetedPost(organisations.private, users.public);
    let publicUntargetedPost = await makeUntargetedPost(users.public);    

    
    await joinOrgAs(users.private, organisations.private);
    await joinOrgAs(users.private, organisations.public);
    let privateToPublicPost = await makeTargetedPost(organisations.public, users.private);
    let privateToPrivatePost = await makeTargetedPost(organisations.private, users.private);
    let privateUntargetedPost = await makeUntargetedPost(users.private);    

    await reactToPostAs(users.public, privateToPublicPost._id);
    await reactToPostAs(users.public, privateToPrivatePost._id);   
    
    await commentOnPostAs(users.public, privateToPublicPost._id);
    await commentOnPostAs(users.viewer, privateToPublicPost._id);
    await commentOnPostAs(users.private, privateToPublicPost._id);
       
}

//user can see post to private org (viewer member), but cannot see private user unless followed
async function scenarioB() {
    let viewerUntargetedPost = await makeUntargetedPost(users.viewer);    
    await joinOrgAs(users.viewer, organisations.private);
    
    await joinOrgAs(users.private, organisations.private);
    await joinOrgAs(users.private, organisations.public);
    let privateToPublicPost = await makeTargetedPost(organisations.public, users.private);
    let privateToPrivatePost = await makeTargetedPost(organisations.private, users.private);
    let privateUntargetedPost = await makeUntargetedPost(users.private);   
    
    await reactToPostAs(users.viewer, privateToPublicPost._id);
    await reactToPostAs(users.viewer, privateToPrivatePost._id);       
}

//user can see private user post to public, but won't appear on feed
//feed is built if followed
async function scenarioC() {
    await followAs(users.viewer, users.private);
    let viewerUntargetedPost = await makeUntargetedPost(users.viewer);    
    
    await joinOrgAs(users.private, organisations.private);
    let privateToPublicPost = await makeTargetedPost(organisations.public, users.private);
    let privateToPrivatePost = await makeTargetedPost(organisations.private, users.private);
    let privateUntargetedPost = await makeUntargetedPost(users.private);    

    await reactToPostAs(users.public, privateToPublicPost._id);
    await reactToPostAs(users.public, privateToPrivatePost._id);       
}


//user cannot access public user post to private org (non member) on profile
async function scenarioD() {
    await followAs(users.viewer, users.public);
    await joinOrgAs(users.private, organisations.private);
    let publicToPrivatePost = await makeTargetedPost(organisations.private, users.public);
    let publicUntargetedPost = await makeUntargetedPost(users.private);   
}

main();