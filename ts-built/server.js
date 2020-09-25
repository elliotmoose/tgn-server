"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map-support').install();
// require = require('esm')(module);
var express = require('express');
var config_1 = __importDefault(require("./config"));
var app = express();
var bodyParser = require('body-parser');
//controllers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//connect to model
require("./database");
var users_1 = __importDefault(require("./routes/users"));
// const organisationRouter = require('./routes/organisations');
// const postRouter = require('./routes/posts');
// const feedRouter = require('./routes/feed');
var v1 = express.Router();
v1.use('/users', users_1.default);
// v1.use('/organisations', organisationRouter);
// v1.use('/posts', postRouter);
// v1.use('/feed', feedRouter);
app.use('/', v1);
app.listen(config_1.default.PORT, function () { return console.log("========server started on port: " + config_1.default.PORT + " env: " + process.env.NODE_ENV + "========"); });
// //for tests
module.exports = app;
//# sourceMappingURL=server.js.map