"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController = require('../controllers/userController');
var _a = require('../helpers/apiHelper'), respond = _a.respond, checkRequiredFields = _a.checkRequiredFields, assertRequiredParams = _a.assertRequiredParams;
var Errors = __importStar(require("../constants/Errors"));
var setAndRequireUser = require('../middleware/user').setAndRequireUser;
var organisationController = require('../controllers/organisationController');
var router = express_1.default.Router();
var mongoose = require('mongoose');
/**
 * Join org by updating user organisationId
 */
router.post('/:orgIdOrHandle/userJoin', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orgIdOrHandle, userId, orgData_1, userData, isMember, newUserData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgIdOrHandle = req.params.orgIdOrHandle;
                userId = req.user._id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, organisationController.getOrganisationByIdOrHandle(orgIdOrHandle)];
            case 2:
                orgData_1 = _a.sent();
                if (!orgData_1) {
                    throw Errors.ORG_NOT_FOUND();
                }
                return [4 /*yield*/, userController.getUserByIdOrHandle(userId)];
            case 3:
                userData = _a.sent();
                isMember = (userData.organisationIds.findIndex(function (id, index) { return id.equals(orgData_1._id); }) != -1);
                if (isMember) {
                    throw Errors.ALREADY_JOINED_ORG();
                }
                return [4 /*yield*/, userController.update(userId, {
                        $push: {
                            organisationIds: orgData_1._id
                        }
                    })
                    //TODO: update organisation members     
                ];
            case 4:
                newUserData = _a.sent();
                //TODO: update organisation members     
                if (!newUserData) {
                    throw Errors.INTERNAL_SERVER();
                }
                respond(res, newUserData);
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                respond(res, {}, error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/:orgIdOrHandle/userLeave', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orgIdOrHandle, userId, orgData_2, userData, isMember, newUserData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgIdOrHandle = req.params.orgIdOrHandle;
                userId = req.user._id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, organisationController.getOrganisationByIdOrHandle(orgIdOrHandle)];
            case 2:
                orgData_2 = _a.sent();
                if (!orgData_2) {
                    throw Errors.ORG_NOT_FOUND();
                }
                return [4 /*yield*/, userController.getUserByIdOrHandle(userId)];
            case 3:
                userData = _a.sent();
                isMember = (userData.organisationIds.findIndex(function (id) { return id.equals(orgData_2._id); }) != -1);
                if (!isMember) {
                    throw Errors.NOT_ORG_MEMBER();
                }
                return [4 /*yield*/, userController.update(userId, {
                        $pull: {
                            organisationIds: orgData_2._id
                        }
                    })];
            case 4:
                newUserData = _a.sent();
                if (!newUserData) {
                    throw Errors.INTERNAL_SERVER();
                }
                respond(res, newUserData);
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                respond(res, {}, error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/:orgIdOrHandle', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orgIdOrHandle, orgData, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgIdOrHandle = req.params.orgIdOrHandle;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, organisationController.getOrganisationByIdOrHandle(orgIdOrHandle)];
            case 2:
                orgData = _a.sent();
                respond(res, orgData);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                respond(res, {}, error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/:orgIdOrHandle/members', setAndRequireUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orgIdOrHandle, orgData, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgIdOrHandle = req.params.orgIdOrHandle;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, organisationController.getOrgMembers(orgIdOrHandle)];
            case 2:
                orgData = _a.sent();
                respond(res, orgData);
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
 * Create a new organisation
 */
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var org, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, organisationController.createOrganisation(req.body)];
            case 1:
                org = _a.sent();
                respond(res, org);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                respond(res, {}, error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
