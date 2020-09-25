"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
/**
 * @class User
 */
var userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: 'This field is required'
    },
    username: {
        type: String,
        unique: true,
        required: 'This field is required'
    },
    email: {
        type: String,
        unique: true,
        required: 'This field is required'
    },
    password: {
        type: String,
        required: 'This field is required'
    },
    passwordSalt: {
        type: String,
        required: 'This field is required'
    },
    role: {
        type: String,
        required: 'This field is required'
    },
    isPublic: {
        type: Boolean,
        required: 'This field is required',
        default: false
    },
    bio: {
        type: String,
        default: ''
    },
    following: {
        type: [mongoose_1.default.Types.ObjectId],
        required: 'This field is required',
        default: []
    },
    followers: {
        type: [mongoose_1.default.Types.ObjectId],
        required: 'This field is required',
        default: []
    },
    organisationIds: {
        type: [{
                type: mongoose_1.default.Types.ObjectId,
                ref: 'organisation'
            }],
        required: 'This field is required',
        default: []
    },
    createdAt: {
        type: Date,
        default: function () { return Date.now(); }
    },
});
mongoose_1.default.model('user', userSchema);
//# sourceMappingURL=user.model.js.map