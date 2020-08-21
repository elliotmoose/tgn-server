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
let Comment = mongoose.model('comment');

chai.use(chaiHttp);
chai.use(chaiLike);
let should = chai.should();

// let token = null;
// let userData = null;

async function main() {
    await Post.deleteMany({});      
    await Comment.deleteMany({});      
    
    let loginRes = await chai.request(server).post('/users/login').send({username: userCredentials.username, password: userCredentials.password});
    let tokens = [];
    tokens.push(loginRes.body.data.token);
    
    let login2Res = await chai.request(server).post('/users/login').send({username: secondUserCredentials.username, password: secondUserCredentials.password});
    tokens.push(login2Res.body.data.token);

    for(let i=0; i< 30; i++)
    {
        let postRes = await chai.request(server).post(`/posts`).set('authorization', `Bearer ${tokens[0]}`).send({...postTemplateData, content: `POST ${i}`});    
        let postId = postRes.body.data._id;
        
        
        for(let token of tokens)
        {
            for(let i=0; i< 2; i++)
            {        
                await chai.request(server).post(`/posts/${postId}/comment`).set('authorization', `Bearer ${token}`).send({...commentTemplateData, content: `COMMENT ${i}`});    
            }
            
            let reactRes = await chai.request(server).post(`/posts/${postId}/react`).set('authorization', `Bearer ${token}`).send({reactionType: 'like'});            
            reactRes.should.have.status(200);
            let reactLoveRes = await chai.request(server).post(`/posts/${postId}/react`).set('authorization', `Bearer ${token}`).send({reactionType: 'love'});    
            reactLoveRes.should.have.status(200);
        }
    }
    
}

main();