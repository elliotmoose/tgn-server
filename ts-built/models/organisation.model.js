"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
/**
 * @class User
 */
var organisationSchema = new mongoose_1.default.Schema({
    handle: {
        type: String,
        unique: true,
        required: 'This field is required'
    },
    // ownerId: {
    //     type: mongoose.Types.ObjectId,
    //     required: 'This field is required'
    // },
    name: {
        type: String,
        required: 'This field is required'
    },
    public: {
        type: Boolean,
        required: true,
        default: true
    },
    address: {
        type: String,
    },
    contact: {
        type: String,
        required: 'This field is required'
    },
    description: {
        type: String
    },
    website: {
        type: String
    },
    createdAt: {
        type: Date,
        default: function () { return Date.now(); }
    },
});
mongoose_1.default.model('organisation', organisationSchema);
