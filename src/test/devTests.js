/**
 * USE FOR MOCK DATA IN DEV ENV
 */



process.env.NODE_ENV = 'DEV';
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

// let token = null;
// let userData = null;

async function main() {
    await Post.deleteMany({});      
    let loginRes = await chai.request(server).post('/users/login').send({username: userCredentials.username, password: userCredentials.password});
    let token = loginRes.body.data.token;

    for(let i=0; i< 30; i++)
    {
        await chai.request(server).post(`/posts`).set('authorization', `Bearer ${token}`).send({...postTemplateData, content: `POST ${i}`});    
    }
}

main();