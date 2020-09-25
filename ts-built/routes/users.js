"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./../constants/errors");
var express_1 = __importDefault(require("express"));
var userController = require('../controllers/userController');
var _a = require('../helpers/apiHelper'), respond = _a.respond, checkRequiredFields = _a.checkRequiredFields, assertRequiredParams = _a.assertRequiredParams;
var Errors = __importStar(require("../constants/Errors"));
var _b = require('../middleware/user'), setAndRequireUser = _b.setAndRequireUser, resolveParamUser = _b.resolveParamUser;
var organisationController = require('../controllers/organisationController');
var router = express_1.default.Router();
var mongoose = require('mongoose');
var postController = require('../controllers/postController');
var isOwner = require('../middleware/access').isOwner;
var rbac = require('../middleware/rbac');
router.get('/', function (req, res) {
});
// router.post('/', makeExpressCallback(signup));
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userController.createUser(req.body)];
            case 1:
                newUser = _a.sent();
                respond(res, __assign(__assign({}, newUser), { password: undefined }));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                respond(res, {}, error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loginData, resData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userController.login(req.body)];
            case 1:
                loginData = _a.sent();
                resData = {
                    user: __assign(__assign({}, loginData.user), { password: undefined }),
                    token: loginData.token
                };
                respond(res, resData);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                respond(res, {}, error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get user data by id or by handl
 */
router.get('/:userIdOrHandle', setAndRequireUser, resolveParamUser, rbac.can('read', 'user'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            respond(res, req.paramUser);
        }
        catch (error) {
            respond(res, {}, error);
        }
        return [2 /*return*/];
    });
}); });
/**
 * Get user data by id or by handl
 */
router.get('/:userIdOrHandle/memberOf', setAndRequireUser, resolveParamUser, rbac.can('read', 'user'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var organisations, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userController.memberOf(req.paramUser._id)];
            case 1:
                organisations = _a.sent();
                respond(res, organisations);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                respond(res, {}, error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Update user data (incomplete: only updates public status of user account)
 */
router.put('/:userIdOrHandle', setAndRequireUser, resolveParamUser, rbac.can('edit', 'user'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, isPublic, newUserData, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userData = req.body;
                isPublic = userData.public;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userController.update(req.paramUser._id, { public: isPublic })];
            case 2:
                newUserData = _a.sent();
                respond(res, newUserData);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                respond(res, {}, error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Get user data by id or by handl
 */
router.get('/:userIdOrHandle/posts', setAndRequireUser, resolveParamUser, rbac.can('read', 'user'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dateBefore, pageSize, viewerOrgIds, posts_1, publicOrgIds, orgIds, posts, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dateBefore = req.query.before;
                pageSize = req.query.limit;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                viewerOrgIds = req.user.organisationIds;
                if (!req.user._id.equals(req.paramUser._id)) return [3 /*break*/, 3];
                return [4 /*yield*/, postController.getUserPosts(req.user._id, req.paramUser._id, viewerOrgIds, dateBefore, pageSize)];
            case 2:
                posts_1 = _a.sent();
                respond(res, posts_1);
                return [2 /*return*/];
            case 3: return [4 /*yield*/, organisationController.filterPublicOrgs(req.paramUser.organisationIds)];
            case 4:
                publicOrgIds = _a.sent();
                orgIds = __spread(new Set(__spread(viewerOrgIds, publicOrgIds)));
                return [4 /*yield*/, postController.getUserPosts(req.user._id, req.paramUser._id, orgIds, dateBefore, pageSize)];
            case 5:
                posts = _a.sent();
                respond(res, posts);
                return [3 /*break*/, 7];
            case 6:
                error_5 = _a.sent();
                respond(res, {}, error_5);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
/**
 * Get user data by id or by handl
 */
router.post('/:userIdOrHandle/follow', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var toFollowUserIdOrHandle, isFollowingUserId, toFollowUserData, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                toFollowUserIdOrHandle = req.params.userIdOrHandle;
                isFollowingUserId = req.user._id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userController.getUserByIdOrHandle(toFollowUserIdOrHandle)];
            case 2:
                toFollowUserData = _a.sent();
                if (!toFollowUserData) {
                    throw Errors.USER_NOT_FOUND();
                }
                return [4 /*yield*/, userController.follow(isFollowingUserId, toFollowUserData._id)];
            case 3:
                _a.sent();
                respond(res, {});
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                if (error_6.code == 'ERROR_ALREADY_FOLLOWING_USER') {
                    respond(res, error_6);
                    return [2 /*return*/];
                }
                respond(res, {}, error_6);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * Get user data by id or by handl
 */
router.post('/:userIdOrHandle/unfollow', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var toFollowUserIdOrHandle, isFollowingUserId, toFollowUserData, error_7, errorCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                toFollowUserIdOrHandle = req.params.userIdOrHandle;
                isFollowingUserId = req.user._id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userController.getUserByIdOrHandle(toFollowUserIdOrHandle)];
            case 2:
                toFollowUserData = _a.sent();
                if (!toFollowUserData) {
                    throw Errors.USER_NOT_FOUND();
                }
                return [4 /*yield*/, userController.unfollow(isFollowingUserId, toFollowUserData._id)];
            case 3:
                _a.sent();
                respond(res, {});
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                errorCode = (error_7 instanceof errors_1.APIError && error_7.code) || null;
                switch (errorCode) {
                    case 'ERROR_CANNOT_UNFOLLOW_SELF':
                    case 'ERROR_NOT_FOLLOWING_USER':
                        respond(res, error_7.toJSON());
                        break;
                    default:
                        respond(res, {}, error_7);
                        break;
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get('/:userIdOrHandle/followers', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var toFollowUserIdOrHandle, followerUserId, userData, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                toFollowUserIdOrHandle = req.params.userIdOrHandle;
                followerUserId = req.user._id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userController.getUserByIdOrHandle(toFollowUserIdOrHandle, true)];
            case 2:
                userData = _a.sent();
                if (!userData) {
                    throw Errors.USER_NOT_FOUND();
                }
                respond(res, userData.followers);
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                respond(res, {}, error_8);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/:userIdOrHandle/following', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var toFollowUserIdOrHandle, followerUserId, userData, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                toFollowUserIdOrHandle = req.params.userIdOrHandle;
                followerUserId = req.user._id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userController.getUserByIdOrHandle(toFollowUserIdOrHandle, true)];
            case 2:
                userData = _a.sent();
                if (!userData) {
                    throw Errors.USER_NOT_FOUND();
                }
                respond(res, userData.following);
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                respond(res, {}, error_9);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Get user data by id or by handl
 */
router.get('/:userIdOrHandle/isFollowing', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var toFollowUserIdOrHandle, followerUserId, toFollowUserData, isFollowing, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                toFollowUserIdOrHandle = req.params.userIdOrHandle;
                followerUserId = req.user._id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userController.getUserByIdOrHandle(toFollowUserIdOrHandle)];
            case 2:
                toFollowUserData = _a.sent();
                if (!toFollowUserData) {
                    throw Errors.USER_NOT_FOUND();
                }
                return [4 /*yield*/, userController.isFollowing(followerUserId, toFollowUserData._id)];
            case 3:
                isFollowing = _a.sent();
                respond(res, isFollowing);
                return [3 /*break*/, 5];
            case 4:
                error_10 = _a.sent();
                respond(res, {}, error_10);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
