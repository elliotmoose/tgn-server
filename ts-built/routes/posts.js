"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController = require('../controllers/userController');
var _a = require('../helpers/apiHelper'), respond = _a.respond, checkRequiredFields = _a.checkRequiredFields, assertRequiredParams = _a.assertRequiredParams;
var setAndRequireUser = require('../middleware/user').setAndRequireUser;
var router = express_1.default.Router();
var mongoose = require('mongoose');
var postController = require('../controllers/postController');
var resolveParamPost = require('../middleware/post').resolveParamPost;
var rbac = require('../middleware/rbac');
var makeExpressCallback = require('../helpers/expressCallback').makeExpressCallback;
var createPost = require('../controllers/post').createPost;
router.post('/', setAndRequireUser, makeExpressCallback(createPost));
// router.post('/', setAndRequireUser, async (req, res)=>{    
//     let userId =  req.user._id;
//     let {content, postType, target} = req.body;
//     try {   
//         //check if is member       
//         if(target) {
//             let isMember = req.user.organisationIds.findIndex((id) => id.equals(target)) != -1;
//             if(!isMember) {
//                 throw Errors.NOT_ORG_MEMBER();
//             }
//         }
//         let newPost = await postController.makePost({content, postType, target}, userId);
//         respond(res, newPost);
//     } catch (error) {
//         respond(res, {}, error);
//     }
// });
router.get('/:postId', setAndRequireUser, resolveParamPost, rbac.can('read', 'post'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                postId = req.params.postId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, postController.getPost(postId)];
            case 2:
                post = _a.sent();
                respond(res, post);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                if (error_1.code == 'ERROR_REACTION_EXISTS') {
                    respond(res, error_1);
                    return [2 /*return*/];
                }
                respond(res, {}, error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/:postId/react', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, postId, reactionType, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user._id;
                postId = req.params.postId;
                reactionType = req.body.reactionType;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, postController.reactToPost(reactionType, postId, userId)];
            case 2:
                _a.sent();
                respond(res, { success: true });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                if (error_2.code == 'ERROR_REACTION_EXISTS') {
                    respond(res, error_2);
                    return [2 /*return*/];
                }
                respond(res, {}, error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/:postId/unreact', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, postId, reactionType, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user._id;
                postId = req.params.postId;
                reactionType = req.body.reactionType;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, postController.unreactToPost(reactionType, postId, userId)];
            case 2:
                _a.sent();
                respond(res, { success: true });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                if (error_3.code == 'ERROR_REACTION_NOT_FOUND') {
                    respond(res, error_3);
                    return [2 /*return*/];
                }
                respond(res, {}, error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/:postId/comment', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, postId, content, updatedPost, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user._id;
                postId = req.params.postId;
                content = req.body.content;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, postController.commentOnPost(content, postId, userId)];
            case 2:
                updatedPost = _a.sent();
                respond(res, updatedPost);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                respond(res, {}, error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/:postId/comments', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, dateAfter, pageSize, comments, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                postId = req.params.postId;
                dateAfter = req.query.after;
                pageSize = req.query.limit;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, postController.getComments(postId, dateAfter, pageSize)];
            case 2:
                comments = _a.sent();
                respond(res, comments);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                respond(res, {}, error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
//# sourceMappingURL=posts.js.map