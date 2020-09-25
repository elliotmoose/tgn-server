
// require = require('esm')(module);
const express = require('express');
const config = require('./config');
const app = express();
const bodyParser = require('body-parser');

//controllers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to model
import './database';

// const userRouter = require('./routes/users');
// const organisationRouter = require('./routes/organisations');
// const postRouter = require('./routes/posts');
// const feedRouter = require('./routes/feed');

// const v1 = express.Router();
// v1.use('/users', userRouter);
// v1.use('/organisations', organisationRouter);
// v1.use('/posts', postRouter);
// v1.use('/feed', feedRouter);

// app.use('/', v1);

app.listen(config.PORT, ()=>console.log(`========server started on port: ${config.PORT} env: ${process.env.NODE_ENV}========`));

// //for tests
module.exports = app;

// import makeCrypto from "./helpers/crypto";
// const secret = 'mooselliot';
// const crypto = makeCrypto(secret);