"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = __importDefault(require("../config"));
// mongoose.pluralize(null);
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.connect(config_1.default.DB, { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log("MongoDB Connection error: " + err);
    }
    else {
        console.log('Successfully connected to MongoDB');
    }
});
require('./user.model');
require('./organisation.model');
require('./reaction.model');
require('./comment.model');
require('./post.model');
