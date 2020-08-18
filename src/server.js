require = require('esm')(module);

const express = require('express');
const config = require('./config.js');
const app = express();
const bodyParser = require('body-parser');

const crypto = require('./helpers/crypto.js');
let secret = 'mooselliot';
crypto.initialize(secret);

//controllers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to model
require('./models/db');

const userRouter = require('./routes/user');
const organisationRouter = require('./routes/organisation');
const postRouter = require('./routes/post');
const feedRouter = require('./routes/feed');

const v1 = express.Router();
v1.use('/user', userRouter);
v1.use('/organisation', organisationRouter);
v1.use('/post', postRouter);
v1.use('/feed', feedRouter);

app.use('/', v1);

app.listen(config.PORT, ()=>console.log(`========server started on port: ${config.PORT} env: ${process.env.NODE_ENV}========`));

//for tests
module.exports = app;