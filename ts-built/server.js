"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// require = require('esm')(module);
var express = require('express');
var config = require('./config');
var app = express();
var bodyParser = require('body-parser');
//controllers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//connect to model
require("./database");
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
app.listen(config.PORT, function () { return console.log("========server started on port: " + config.PORT + " env: " + process.env.NODE_ENV + "========"); });
// //for tests
module.exports = app;
// import makeCrypto from "./helpers/crypto";
// const secret = 'mooselliot';
// const crypto = makeCrypto(secret);
